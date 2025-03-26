import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { optimism, polygon, arbitrum, sepolia } from 'wagmi/chains';
import { apiKeys } from './constants';
import { QueryClient } from '@tanstack/react-query';

export const config = getDefaultConfig({
    appName: 'TOAD',
    projectId: apiKeys.walletConnect,
    chains: [optimism, polygon, arbitrum, sepolia],
});

export const queryClient = new QueryClient(); 