# TOAD UI

TOAD (Trustless Onchain Autonomous Delegate) is an AI-powered voting delegate system. This repo contains the UI and AI agent. The UI is built with Vercel AI SDK and the AI agent uses GOAT. GAIA is used for the LLM

## Development

1. Modify the .env.example file with your own information
2. Rename .env.example to .env
3. To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Docker

```
docker run -d -p 3000:3000 --env-file ./.env --name toad-ui pupcakes/toad-ui
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

