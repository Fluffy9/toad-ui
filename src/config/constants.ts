// This file will be loaded at runtime

// Contract addresses
export const contracts = {
    toad: process.env.NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS as `0x${string}`,
    governance: process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS as `0x${string}`,
} as const;

// API Keys and Secrets
export const apiKeys = {
    tally: process.env.TALLY_API_KEY as string,
    openai: process.env.OPENAI_API_KEY as string,
    discourse: process.env.DISCOURSE_API_KEY as string,
    walletConnect: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
} as const;

// Organization and Chain Configuration
export const config = {
    organizationName: process.env.GOVERNANCE_ORGANIZATION_NAME as string,
    organizationDescription: process.env.ORGANIZATION_DESCRIPTION as string,
    chainId: process.env.CHAIN_ID as string,
    rpcProviderUrl: process.env.RPC_PROVIDER_URL as string,
    walletPrivateKey: process.env.WALLET_PRIVATE_KEY as `0x${string}`,
} as const;

// OpenAI Configuration
export const openaiConfig = {
    model: 'gpt-4o',
    baseUrl: process.env.OPENAI_BASE_URL,
} as const;

export const gaiaConfig = {
    baseUrl: process.env.GAIA_BASE_URL,
    apiKey: process.env.GAIA_API_KEY,
    apiModel: process.env.GAIA_API_MODEL,
} as const;

// Discourse Configuration
export const discourseConfig = {
    apiUsername: process.env.DISCOURSE_API_USERNAME as string,
    baseUrl: process.env.DISCOURSE_BASE_URL as string,
} as const;

// URLs and External Services
export const urls = {
    tally: `https://www.tally.xyz/gov/${process.env.GOVERNANCE_ORGANIZATION_NAME}`,
    discourse: process.env.NEXT_PUBLIC_DISCOURSE_BASE_URL,
} as const;

// Type guards for environment variables
export const hasRequiredEnvVars = () => {
    const requiredVars = [
        'NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS',
        'NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS',
        'TALLY_API_KEY',
        'GOVERNANCE_ORGANIZATION_NAME',
        'CHAIN_ID',
        'RPC_URL',
        'WALLET_PRIVATE_KEY',
        'OPENAI_API_KEY',
        // 'DISCOURSE_API_KEY',
        // 'DISCOURSE_API_USERNAME',
        'DISCOURSE_BASE_URL',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('Missing required environment variables:', missingVars);
        return false;
    }

    return true;
}; 

