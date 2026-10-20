# Kishvanth's Doraemon Agent 💙

A responsive Tamil + English chat website with a friendly blue robotic-cat theme, voice input/output where the browser supports it, local chat history, and exact-question caching.

## Important notes

- This is an original blue robotic-cat design inspired by the idea of a friendly helper. It does not use official Doraemon artwork.
- The web app calls OpenAI from the **Node.js server**. The API key is never meant to be placed in browser code.
- Real AI responses require an OpenAI API key and API access. API usage may cost money and is separate from a ChatGPT subscription. Ask a parent/guardian before setting up paid API billing.
- Browser speech recognition and Tamil voices vary by device/browser. If voice input is not supported, type instead.
- Chat history and cached answers are stored in this browser's local storage. Use “Clear this chat” to clear conversation history. Cached exact-question replies are separate and can be cleared from browser site data.
- This prototype has no account login, database, or per-user security. Do not put private or sensitive information into it.

## Run on your computer

1. Install Node.js 18 or newer.
2. Extract this project folder.
3. Open a terminal in the project folder.
4. Run `npm install`.
5. Copy `.env.example` to `.env`.
6. Open `.env` and replace `put_your_key_here` with your API key. Keep `.env private.
7. Run `npm start`.
8. Open `http://localhost:3000` in your browser.

## Publish online

This project needs a Node.js host because the API key must stay on the server. Static-only hosting such as GitHub Pages cannot run `server.js`.

A general deployment workflow:
1. Put the project in a private GitHub repository (do not upload `.env`).
2. Create a Node.js web service with a hosting provider that supports Node.js.
3. Set the build/install command to `npm install` and the start command to `npm start`.
4. Add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` as server-side environment variables in the hosting dashboard.
5. Deploy, open the service URL, and test text chat first. Then test voice.

For a young developer: ask a parent/guardian to help with API account, billing, and hosting setup. Never share your API key in screenshots, chats, or public repositories.

## API configuration

- `OPENAI_API_KEY`: required for real AI responses.
- `OPENAI_MODEL`: defaults to `gpt-5-mini`; use a model enabled for your API project.
- `PORT`: provided automatically by most hosts; defaults to `3000` locally.

The server uses the OpenAI Responses API. See the official documentation:
https://platform.openai.com/docs/guides/text?api-mode=responses

## Features included

- Tamil, English, and mixed-language preference
- Microphone input using the browser Web Speech API where supported
- Speech synthesis for replies where supported
- Local browser conversation history
- Exact-repeat answer cache to reduce repeated requests
- Limits recent messages and reply size to help control data use/cost
- Responsive layout for mobile and desktop
