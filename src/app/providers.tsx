'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from '../config/wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { AppProvider } from '@/context/AppContext'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <AppProvider>
                        {children}
                    </AppProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
} 