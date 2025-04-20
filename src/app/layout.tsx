import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { Providers } from './providers'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
    title: 'TOAD UI',
    description: 'Trustless Onchain Autonomous Delegate',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <Providers>
                    {children}
                    <Toaster position="top-right" />
                </Providers>
            </body>
        </html>
    )
} 