import { openai } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

import { streamText } from 'ai';

import { boardroom } from "../../../plugins/boardroom/src";
import { tally } from "../../../plugins/tally/src";
import { discourse } from "../../../plugins/discourse/src";
import { createWalletClient, http } from "viem";
import { polygon } from "viem/chains";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
// import { polymarket } from "@goat-sdk/plugin-polymarket";
import { viem } from "@goat-sdk/wallet-viem";
import { privateKeyToAccount } from 'viem/accounts';
require("dotenv").config();
// 1. Create a wallet client
const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    transport: http(process.env.RPC_PROVIDER_URL),
    chain: polygon,
});

/*
✅- Should know about the current organization
✅- ask to get the list of proposals
    Use Tally to fetch a list of proposals for the current governance organization
✅- ask for the details of each proposal
    Use Tally to fetch the details of each proposal
✅- ask for a summary of the discussions for each proposal
    Use Discourse to fetch a summary of the discussions for each proposal
✅- ask questions about the proposals in general
⬜- ask TOAD about it’s decision and the reasoning behind it for each proposal
    Fetch the decision from the smart contract and come up with a justification for the decision using proposal summary and forum information
*/

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Using the GOAT SDK to get the tools for TOAD to use
const tools = await getOnChainTools({
  wallet: viem(walletClient),
  plugins: [
    // Discourse plugin
      discourse({
          apiKey: process.env.DISCOURSE_API_KEY as string,
          apiUsername: process.env.DISCOURSE_API_USERNAME as string,
          baseUrl: process.env.DISCOURSE_BASE_URL as string,
      }),

      // Tally plugin
      tally({
          apiKey: process.env.TALLY_API_KEY as string,
          organizationName: process.env.GOVERNANCE_ORGANIZATION_NAME as string,
          chainId: process.env.CHAIN_ID as string,
      }),
  ],
});

export async function POST(req: Request) {
    // Get the messages from the request
  const { messages } = await req.json();


//   const provider = createOpenAICompatible({
//     name: 'provider-name',
//     apiKey: process.env.OPENAI_API_KEY,
//     baseURL: process.env.OPENAI_BASE_URL,
//   });

  console.log("thinking...")
 
  // Stream the response from the OpenAI API. Makes sure it has the tools available, as well as the governance organization from thesystem prompt
  const result = streamText({
    model: openai('gpt-4o-mini'),
    tools: tools,
    maxSteps: 10,
    system: `You are a helpful assistant that can answer questions about the governance organization: ${process.env.GOVERNANCE_ORGANIZATION_NAME}.`,
    messages,
    onStepFinish:(event) => {
        console.log(event.toolResults);
    }
  });

  return result.toDataStreamResponse();
}