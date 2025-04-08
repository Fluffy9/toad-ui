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