import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

const config: Config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
    transformIgnorePatterns: [
        'node_modules/(?!(react-markdown|@types/react-markdown)/)',
    ],
};

export default createJestConfig(config); 