import { openai } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { LanguageModelV1, streamText } from 'ai';
import { tally } from "../../../plugins/tally/src";
import { discourse } from "../../../plugins/discourse/src";
import { toad } from "../../../plugins/toad/src";
import { createWalletClient, http } from "viem";
import { polygon } from "viem/chains";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import { privateKeyToAccount } from 'viem/accounts';
import { apiKeys, config, openaiConfig, discourseConfig, hasRequiredEnvVars, contracts } from '@/config/constants';
import dotenv from 'dotenv'
dotenv.config()

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    // Get the messages from the request
    const { messages } = await req.json();

    // Check for required environment variables
    if (!hasRequiredEnvVars()) {
        console.log(JSON.stringify(process.env))
        throw new Error('Missing required environment variables');
    }

    // Initialize wallet client
    const account = privateKeyToAccount(config.walletPrivateKey);
    const walletClient = createWalletClient({
        account: account,
        transport: http(config.rpcProviderUrl),
        chain: polygon,
    });

    let provider = null;
    if (openaiConfig.baseUrl && openaiConfig.model) {
        provider = createOpenAICompatible({
            name: 'compatible',
            apiKey: apiKeys.openai,
            baseURL: openaiConfig.baseUrl
        });
        const response = await fetch(`${openaiConfig.baseUrl}/v1/models`, {
            headers: {
                'Authorization': `Bearer ${apiKeys.openai}`,
            },
        });
        console.log("OpenAI Compatible Provider Response - ", response['status']);
        if (response['status'] != 200) {
            console.log("OpenAI Compatible Provider Response - ", response);
            throw new Error('Failed to connect to model provider');
        }
    }
    else {
        const response = await fetch(`https://api.openai.com/v1/models`, {
            headers: {
                'Authorization': `Bearer ${apiKeys.openai}`,
            },
        });
        console.log("OpenAI Provider Response - ", response['status']);
        if (response['status'] != 200) {
            console.log("OpenAI Provider Response - ", response);
            throw new Error('Failed to connect to openai');
        }
    }
    const model = provider ? provider(openaiConfig.model) : openai(openaiConfig.model) || 'gpt-4o';

    // Initialize tools
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [
            discourse({
                apiKey: apiKeys.discourse,
                apiUsername: discourseConfig.apiUsername,
                baseUrl: discourseConfig.baseUrl,
            }),
            tally({
                apiKey: apiKeys.tally,
                organizationName: config.organizationName,
                chainId: config.chainId,
            }),
            toad({
                contractAddress: contracts.toad,
                chainId: config.chainId,
            }),
        ],
    });

    console.log("thinking...");

    // Stream the response from the OpenAI API
    const result = streamText({
        model: model as LanguageModelV1,
        tools: tools,
        maxSteps: 10,
        system: `You are a helpful assistant that can answer questions about the governance organization: ${config.organizationName}. ${config.organizationDescription}`,
        messages,
        onStepFinish: (event) => {
            console.log(event.text);
        },
    });

    return result.toDataStreamResponse();
}