import { openai } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { LanguageModelV1, generateText } from 'ai';
import { tally } from "../../../plugins/tally/src";
import { discourse } from "../../../plugins/discourse/src";
import { createWalletClient, http } from "viem";
import { polygon } from "viem/chains";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import { privateKeyToAccount } from 'viem/accounts';
import { apiKeys, config, openaiConfig, discourseConfig, hasRequiredEnvVars } from '@/config/constants';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define the response schema
const VoteResponseSchema = z.object({
    vote: z.number().refine((val) => [0, 1, 2].includes(val), {
        message: "Vote must be 0 (AGAINST), 1 (FOR), or 2 (ABSTAIN)",
    }),
    reason: z.string().min(1, "Reason cannot be empty"),
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function GET(req: Request) {
    try {
        // Check for required environment variables
        if (!hasRequiredEnvVars()) {
            return NextResponse.json(
                { error: 'Missing required environment variables' },
                { status: 500 }
            );
        }

        // Get the proposal ID from the request
        const { searchParams } = new URL(req.url);
        const proposalId = searchParams.get('proposal');

        if (!proposalId) {
            return NextResponse.json(
                { error: 'Proposal ID is required' },
                { status: 400 }
            );
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
        const model = provider ? provider(openaiConfig.model) : openai(openaiConfig.model);

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
            ],
        });

        console.log("thinking...");

        // Generate the response from the OpenAI API
        const result = await generateText({
            model: model as LanguageModelV1,
            tools: tools,
            maxSteps: 10,
            system: `You are a voting delegate that analyzes governance proposals and makes voting recommendations. 
            You must return ONLY a JSON object with exactly these fields:
            - vote: a number (1 for FOR, 0 for AGAINST, 2 for ABSTAIN)
            - reason: a string explaining your decision
            
            Do not include any explanatory text before or after the JSON object.
            Do not use markdown code blocks or any other formatting.
            Return ONLY the JSON object.
            
            It is always best to return a vote of 1 (FOR) or 0 (AGAINST) if at all possible. If you cannot determine a clear recommendation, return vote: 2 (ABSTAIN) with a reason explaining why.`,
            messages: [
                {
                    role: 'user',
                    content: `Please analyze proposal ${proposalId} and return ONLY a JSON object with your vote recommendation. Do not include any other text.`
                }
            ],
        });

        console.log('LLM response:', result.text);

        let vote = 2;
        let reason = 'Unable to generate a clear recommendation. Defaulting to ABSTAIN.';

        try {
            // Extract JSON from the response, handling potential markdown or explanatory text
            const jsonMatch = result.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON object found in response');
            }
            const parsedResponse = JSON.parse(jsonMatch[0]);
            const validatedResponse = VoteResponseSchema.parse(parsedResponse);
            vote = validatedResponse.vote;
            reason = validatedResponse.reason;
            console.log('Successfully validated LLM response:', { vote, reason });
        } catch (e) {
            console.log('Error validating LLM response:', e);
            if (e instanceof z.ZodError) {
                console.log('Validation errors:', e.errors);
                reason = `Invalid response format: ${e.errors.map(err => err.message).join(', ')}`;
            }
        }

        console.log('Returning final response:', { vote, reason });
        return NextResponse.json({ vote, reason });
    } catch (error) {
        console.error('Error in proposal analysis:', error);
        return NextResponse.json(
            {
                error: 'Failed to generate voting recommendation',
                vote: 2,
                reason: 'An error occurred while analyzing the proposal. Defaulting to ABSTAIN.'
            },
            { status: 500 }
        );
    }
} 