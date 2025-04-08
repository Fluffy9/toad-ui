import { createPublicClient, http, PublicClient } from 'viem';
import { polygon } from 'viem/chains';
import { TOAD_ABI } from './abi';

export interface ProposalView {
    tallyId: string;
    answer: string;
    reason: string;
    discoveredAt: number;
    validBlock: number;
    disablePower: number;
    votingPeriod: number;
    announced: boolean;
}

export class ToadService {
    private client: PublicClient;
    private contractAddress: `0x${string}`;

    constructor(contractAddress: `0x${string}`, chainId: string) {
        this.contractAddress = contractAddress;
        const chain = this.getChainById(chainId);
        this.client = createPublicClient({
            chain,
            transport: http(),
            batch: {
                multicall: true
            }
        });
    }

    private getChainById(chainId: string) {
        switch (chainId) {
            case '137':
                return polygon;
            default:
                return polygon;
        }
    }

    async getProposal(tallyId: string): Promise<ProposalView> {
        try {
            const data = await this.client.readContract({
                address: this.contractAddress,
                abi: TOAD_ABI,
                functionName: 'getProposal',
                args: [BigInt(tallyId)]
            }) as unknown as ProposalView;
            return data;
        } catch (error) {
            console.error('Error getting proposal:', error);
            throw error;
        }
    }

    async getProposalAnswer(tallyId: string): Promise<string> {
        try {
            const proposal = await this.getProposal(tallyId);
            return proposal.answer;
        } catch (error) {
            console.error('Error getting proposal answer:', error);
            throw error;
        }
    }

    async getProposalReason(tallyId: string): Promise<string> {
        try {
            const proposal = await this.getProposal(tallyId);
            return proposal.reason;
        } catch (error) {
            console.error('Error getting proposal reason:', error);
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
            console.error('Error getting proposal details:', error);
            throw error;
        }
    }
} 