import { createPublicClient, http } from 'viem';
import { optimism, polygon, arbitrum, sepolia } from 'viem/chains';
import TOAD_ABI from '../../../../public/abi/TOAD.json';

interface ProposalView {
    tallyId: bigint;
    answer: string;
    reason: string;
    discoveredAt: bigint;
    validBlock: bigint;
    disablePower: bigint;
    votingPeriod: bigint;
    announced: boolean;
}

export class ToadService {
    private client: any;
    private contractAddress: `0x${string}`;

    constructor(contractAddress: `0x${string}`, chainId: string) {
        if (!TOAD_ABI?.abi) {
            throw new Error('TOAD ABI not found. Please ensure public/abi/TOAD.json exists and contains the correct ABI.');
        }

        if (!contractAddress) {
            throw new Error('TOAD contract address is required');
        }

        const chain = this.getChainById(chainId);
        this.client = createPublicClient({
            chain,
            transport: http()
        });
        this.contractAddress = contractAddress;
    }

    private getChainById(chainId: string) {
        switch (chainId) {
            case '10':
                return optimism;
            case '137':
                return polygon;
            case '42161':
                return arbitrum;
            case '11155111':
                return sepolia;
            default:
                throw new Error(`Unsupported chain ID: ${chainId}`);
        }
    }

    async getProposal(tallyId: string): Promise<ProposalView> {
        try {
            if (!this.client || !this.contractAddress) {
                throw new Error('TOAD service not properly initialized');
            }

            const proposal = await this.client.readContract({
                address: this.contractAddress,
                abi: TOAD_ABI.abi,
                functionName: 'getProposal',
                args: [BigInt(tallyId)]
            });

            return {
                tallyId: proposal.tallyId,
                answer: proposal.answer,
                reason: proposal.reason,
                discoveredAt: proposal.discoveredAt,
                validBlock: proposal.validBlock,
                disablePower: proposal.disablePower,
                votingPeriod: proposal.votingPeriod,
                announced: proposal.announced
            };
        } catch (error) {
            console.error('Error fetching proposal:', error);
            throw error;
        }
    }

    async getProposalAnswer(tallyId: string): Promise<string> {
        try {
            const proposal = await this.getProposal(tallyId);
            return proposal.answer;
        } catch (error) {
            console.error('Error fetching proposal answer:', error);
            throw error;
        }
    }

    async getProposalReason(tallyId: string): Promise<string> {
        try {
            const proposal = await this.getProposal(tallyId);
            return proposal.reason;
        } catch (error) {
            console.error('Error fetching proposal reason:', error);
            throw error;
        }
    }

    async getProposalDetails(tallyId: string): Promise<{
        tallyId: string;
        answer: string;
        reason: string;
        discoveredAt: number;
        validBlock: number;
        disablePower: number;
        votingPeriod: number;
        announced: boolean;
    }> {
        try {
            const proposal = await this.getProposal(tallyId);
            return {
                tallyId: proposal.tallyId.toString(),
                answer: proposal.answer,
                reason: proposal.reason,
                discoveredAt: Number(proposal.discoveredAt),
                validBlock: Number(proposal.validBlock),
                disablePower: Number(proposal.disablePower),
                votingPeriod: Number(proposal.votingPeriod),
                announced: proposal.announced
            };
        } catch (error) {
            console.error('Error fetching proposal details:', error);
            throw error;
        }
    }
} 