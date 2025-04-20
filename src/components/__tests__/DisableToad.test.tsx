import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DisableToad } from '../DisableToad';

// Mock environment variables
process.env.NEXT_PUBLIC_GOVERNANCE_ORGANIZATION_NAME = 'test';
process.env.NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';
process.env.NEXT_PUBLIC_TOAD_CONTRACT_ADDRESS = '0x0987654321098765432109876543210987654321';
process.env.TALLY_API_KEY = 'https://www.tally.xyz/gov/test';
process.env.NEXT_PUBLIC_DISCOURSE_BASE_URL = 'https://forum.example.com';
process.env.CHAIN_ID = '1';
process.env.RPC_PROVIDER_URL = 'https://mainnet.infura.io/v3/test';
process.env.WALLET_PRIVATE_KEY = '0x1234567890123456789012345678901234567890123456789012345678901234';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.DISCOURSE_BASE_URL = 'https://forum.example.com';

// Mock the constants file
jest.mock('@/config/constants', () => ({
    urls: {
        tally: 'https://www.tally.xyz/gov/test-org',
        discourse: 'https://forum.example.com',
    },
    contracts: {
        toad: '0x0987654321098765432109876543210987654321',
        governance: '0x1234567890123456789012345678901234567890',
    },
    config: {
        organizationName: 'test',
        organizationDescription: 'Test Organization',
        chainId: '1',
        rpcProviderUrl: 'https://mainnet.infura.io/v3/test',
        walletPrivateKey: '0x1234567890123456789012345678901234567890123456789012345678901234',
    },
    apiKeys: {
        tally: 'https://www.tally.xyz/gov/test',
        openai: 'test-openai-key',
        discourse: 'test-discourse-key',
        walletConnect: 'test-wallet-connect-id',
    },
}));

// Mock chains.ts
jest.mock('@/config/chains', () => ({
    chains: [
        { id: 1, name: 'Ethereum' },
        { id: 42161, name: 'Arbitrum' },
        { id: 11155111, name: 'Sepolia' },
    ],
    supportedChains: [
        { id: 1, name: 'Ethereum' },
        { id: 42161, name: 'Arbitrum' },
        { id: 11155111, name: 'Sepolia' },
    ],
}));

// Mock wagmi hooks
jest.mock('wagmi', () => ({
    useAccount: () => ({
        isConnected: true,
        address: '0x1234567890123456789012345678901234567890',
    }),
    useWriteContract: () => ({
        writeContract: jest.fn().mockResolvedValue('0x123'),
    }),
    useReadContract: () => ({
        data: true,
        isLoading: false,
    }),
    useWaitForTransactionReceipt: () => ({
        data: { status: 'success' },
        isLoading: false,
    }),
    useChainId: () => 1,
    useWatchContractEvent: () => jest.fn(),
}));

// Mock useGovernance hook
jest.mock('@/hooks/useGovernance', () => ({
    useGovernance: () => ({
        delegateVotes: jest.fn().mockResolvedValue('0x123'),
        setDisablePower: jest.fn().mockResolvedValue('0x123'),
        toggleDisablePower: jest.fn().mockResolvedValue('0x123'),
    }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('DisableToad', () => {
    const mockOnComplete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        // @ts-ignore
        global.fetch.mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve([
                    { id: 1, title: 'Test Proposal 1', discovered: true, status: { active: true } },
                    { id: 2, title: 'Test Proposal 2', discovered: true, status: { active: true } },
                ]),
            })
        );
    });

    it('renders the initial state correctly', async () => {
        await act(async () => {
            render(<DisableToad onComplete={mockOnComplete} />);
        });
        expect(screen.getByText('Disable TOAD')).toBeInTheDocument();
        expect(screen.getByText('Test Proposal 1')).toBeInTheDocument();
        expect(screen.getByText('Test Proposal 2')).toBeInTheDocument();
    });

    it('shows error when wallet is not connected', async () => {
        jest.spyOn(require('wagmi'), 'useAccount').mockImplementation(() => ({
            isConnected: false,
        }));

        await act(async () => {
            render(<DisableToad onComplete={mockOnComplete} />);
        });
        expect(screen.getByText('Please Connect Your Wallet')).toBeInTheDocument();
    });

    it('handles transaction failures', async () => {
        // Mock useWaitForTransactionReceipt to show failure state
        jest.spyOn(require('wagmi'), 'useWaitForTransactionReceipt').mockImplementation(() => ({
            data: { status: 'reverted' },
            isLoading: false,
        }));

        // Mock useAccount to ensure wallet is connected
        jest.spyOn(require('wagmi'), 'useAccount').mockImplementation(() => ({
            isConnected: true,
            address: '0x1234567890123456789012345678901234567890',
        }));

        await act(async () => {
            render(<DisableToad onComplete={mockOnComplete} />);
        });

        // Select a proposal first
        await act(async () => {
            const proposal = screen.getByText('Test Proposal 1').closest('div');
            if (proposal) {
                fireEvent.click(proposal);
            }
        });

        // Then click the disable button
        await act(async () => {
            fireEvent.click(screen.getByText('Disable TOAD'));
        });

        await waitFor(() => {
            expect(screen.getByText('Transaction failed')).toBeInTheDocument();
        });
    });

});
