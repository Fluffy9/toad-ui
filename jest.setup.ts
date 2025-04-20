import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}));

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        return `img[${JSON.stringify(props)}]`;
    },
}));

jest.mock('wagmi', () => ({
    useAccount: () => ({
        address: '0x123',
        isConnected: true,
    }),
    useWriteContract: () => ({
        writeContract: jest.fn(),
    }),
    useReadContract: () => ({
        data: null,
        isLoading: false,
    }),
    useWaitForTransactionReceipt: () => ({
        data: null,
        isLoading: false,
    }),
}));

jest.mock('@/hooks/useGovernance', () => ({
    useGovernance: () => ({
        currentDelegate: '0x123',
        delegateVotes: jest.fn(),
        setDisablePower: jest.fn(),
        toggleDisablePower: jest.fn(),
    }),
})); 