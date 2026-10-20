import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "30kb" }));
app.use(express.static(path.join(__dirname, "public")));

const SYSTEM_PROMPT = `You are Doraemon Agent, a friendly, helpful study and everyday assistant for Kishvanth.
Call the user Kishvanth naturally, but not in every sentence.
Support Tamil, English, and Tamil-English mixed (Tanglish). Match the language of the user's message and the language preference provided.
Keep answers clear and age-appropriate. For school questions, explain step by step and encourage learning.
You are inspired by a friendly blue robotic-cat helper, but do not claim to be the official Doraemon character.
Be honest when you are unsure. Do not pretend to have browsed the internet or know current facts unless supplied.
Keep replies concise unless the user asks for detail.`;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, language } = req.body ?? {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Please send a message first." });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        error: "AI is not connected yet. Add OPENAI_API_KEY in your hosting environment or local .env file, then restart the app."
      });
    }

    // Limit request size and keep only recent conversation turns to reduce data use/cost.
    const safeMessages = messages.slice(-12).map((m) => ({
      role: m?.role === "assistant" ? "assistant" : "user",
      content: String(m?.content ?? "").slice(0, 2500)
    })).filter((m) => m.content.trim());

    const userLanguage = ["Tamil", "English", "Tamil + English"].includes(language)
      ? language : "Tamil + English";

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: `${SYSTEM_PROMPT}\nThe user's selected language preference is: ${userLanguage}.`,
        input: safeMessages.map((m) => ({
          role: m.role,
          content: m.content
        })),
        max_output_tokens: 500
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error:", data?.error?.message || response.status);
      return res.status(502).json({
        error: "The AI service could not answer just now. Check that your API key, billing, and model access are set up correctly."
      });
    }

    const answer = (data.output || [])
      .flatMap((item) => item.content || [])
      .filter((part) => part.type === "output_text")
      .map((part) => part.text)
      .join("\n")
      .trim();

    if (!answer) {
      return res.status(502).json({ error: "The AI returned an empty reply. Please try again." });
    }
    res.json({ reply: answer });
  } catch (error) {
    console.error("Chat request failed:", error.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Kishvanth's Doraemon Agent is running on port ${port}`);
});
