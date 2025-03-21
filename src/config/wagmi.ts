import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { optimism, polygon, arbitrum } from 'wagmi/chains';
import { QueryClient } from '@tanstack/react-query';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const chains = [optimism, polygon, arbitrum] as const;

const { connectors } = getDefaultWallets({
    appName: 'TOAD UI',
    projectId,
});

export const queryClient = new QueryClient();

export const config = createConfig({
    chains,
    transports: {
        [optimism.id]: http(),
        [polygon.id]: http(),
        [arbitrum.id]: http(),
    },
    connectors,
}); 