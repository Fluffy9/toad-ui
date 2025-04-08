import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DisableToad } from '../DisableToad';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useGovernance } from '@/hooks/useGovernance';
import { Hash } from 'viem';

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
    contracts: {
        toad: '0x0987654321098765432109876543210987654321',
    },
}));

// Mock the hooks
jest.mock('wagmi', () => ({
    useAccount: jest.fn(),
    useWaitForTransactionReceipt: jest.fn(),
}));

jest.mock('@/hooks/useGovernance', () => ({
    useGovernance: jest.fn(),
}));

describe('DisableToad', () => {
    const mockAddress = '0x1234567890123456789012345678901234567890';
    const mockTallyIds = [1, 2, 3];
    const mockOnComplete = jest.fn();

    // Mock transaction hashes
    const mockDelegateHash = '0xdelegate' as Hash;
    const mockSetPowerHash = '0xsetpower' as Hash;
    const mockToggleHash = '0xtoggle' as Hash;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock useAccount
        (useAccount as jest.Mock).mockReturnValue({
            address: mockAddress,
        });

        // Mock useWaitForTransactionReceipt
        (useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: false,
        });

        // Mock useGovernance
        (useGovernance as jest.Mock).mockReturnValue({
            delegateVotes: jest.fn(),
            setDisablePower: jest.fn(),
            toggleDisablePower: jest.fn(),
        });
    });

    it('renders the initial state correctly', () => {
        render(<DisableToad tallyIds={mockTallyIds} />);
        expect(screen.getByRole('button', { name: /disable toad/i })).toBeInTheDocument();
    });

    it('shows error when wallet is not connected', () => {
        (useAccount as jest.Mock).mockReturnValue({
            address: undefined,
        });

        render(<DisableToad tallyIds={mockTallyIds} onComplete={mockOnComplete} />);
        fireEvent.click(screen.getByText('Disable TOAD'));

        expect(screen.getByText('Please connect your wallet')).toBeInTheDocument();
    });

    it('handles transaction failures', async () => {
        const { delegateVotes } = useGovernance();

        // Mock failed transaction
        (delegateVotes as jest.Mock).mockResolvedValue(mockDelegateHash);
        (useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
            data: { status: 'reverted' },
            isLoading: false,
        });

        render(<DisableToad tallyIds={mockTallyIds} onComplete={mockOnComplete} />);
        fireEvent.click(screen.getByText('Disable TOAD'));

        await waitFor(() => {
            expect(screen.getByText('Transaction failed')).toBeInTheDocument();
            expect(screen.getByText('Disable TOAD')).toBeInTheDocument(); // Button should be back
        });
    });

    it('handles errors during the disable process', async () => {
        const errorMessage = 'Transaction failed';
        const { delegateVotes } = useGovernance();
        (delegateVotes as jest.Mock).mockRejectedValue(new Error(errorMessage));

        render(<DisableToad tallyIds={mockTallyIds} onComplete={mockOnComplete} />);
        fireEvent.click(screen.getByText('Disable TOAD'));

        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
            expect(screen.getByText('Disable TOAD')).toBeInTheDocument(); // Button should be back
        });
    });

    it('displays transaction hashes during the process', async () => {
        const { delegateVotes } = useGovernance();

        // Mock successful transaction response
        (delegateVotes as jest.Mock).mockResolvedValue(mockDelegateHash);

        render(<DisableToad tallyIds={mockTallyIds} onComplete={mockOnComplete} />);
        fireEvent.click(screen.getByText('Disable TOAD'));

        // Check transaction hash is displayed
        await waitFor(() => {
            expect(screen.getByText(`Transaction: ${mockDelegateHash}`)).toBeInTheDocument();
        });
    });

    it('shows loading state during transaction confirmation', async () => {
        const { delegateVotes } = useGovernance();

        // Mock transaction response
        (delegateVotes as jest.Mock).mockResolvedValue(mockDelegateHash);

        // Mock loading state
        (useWaitForTransactionReceipt as jest.Mock).mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        render(<DisableToad tallyIds={mockTallyIds} onComplete={mockOnComplete} />);
        fireEvent.click(screen.getByText('Disable TOAD'));

        await waitFor(() => {
            expect(screen.getByText('Delegating votes back to your wallet...')).toBeInTheDocument();
        });
    });
}); 