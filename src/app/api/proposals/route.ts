import { tally } from "../../../plugins/tally/src";
import { NextResponse } from 'next/server';
import { apiKeys, config, hasRequiredEnvVars, contracts } from '@/config/constants';
import { createPublicClient, http, encodeFunctionData, decodeFunctionResult, Abi } from 'viem';
import { optimism } from 'viem/chains';
import TOAD_ABI from '../../../../public/abi/TOAD.json';
import MULTICALL_ABI from '../../../../public/abi/Multicall.json';

interface ProposalView {
    tallyId: bigint;
    answer: number;
    reason: string;
    discoveredAt: bigint;
    validBlock: bigint;
    disablePower: bigint;
    votingPeriod: bigint;
    announced: boolean;
}

async function checkProposalDiscovery(tallyProposals: any[]) {
    const client = createPublicClient({
        chain: optimism,
        transport: http(process.env.RPC_PROVIDER_URL),
    });

    // Prepare multicall data
    const calls = tallyProposals.map((proposal) => ({
        target: contracts.toad,
        callData: encodeFunctionData({
            abi: TOAD_ABI.abi,
            functionName: 'getProposal',
            args: [BigInt(proposal.id)],
        }),
    }));

    // Execute multicall
    const multicallResult = await client.readContract({
        address: contracts.multicall,
        abi: MULTICALL_ABI as unknown as Abi,
        functionName: 'tryAggregate',
        args: [false, calls],
    }) as { success: boolean; returnData: `0x${string}` }[];

    // Process results
    const proposalsWithDiscovery = tallyProposals.map((proposal, index) => {
        const result = multicallResult[index];
        if (!result?.success) {
            return {
                ...proposal,
                discovered: false,
                status: {
                    active: proposal.status?.active ?? false
                }
            };
        }

        try {
            const proposalData = decodeFunctionResult({
                abi: TOAD_ABI.abi,
                functionName: 'getProposal',
                data: result.returnData,
            }) as ProposalView;

            return {
                ...proposal,
                discovered: !!proposalData?.tallyId,
                status: {
                    active: proposal.status?.active ?? false
                }
            };
        } catch (error) {
            return {
                ...proposal,
                discovered: false,
                status: {
                    active: proposal.status?.active ?? false
                }
            };
        }
    });

    return proposalsWithDiscovery;
}

export async function GET() {
    try {
        // Check for required environment variables
        if (!hasRequiredEnvVars()) {
            return NextResponse.json(
                { error: 'Missing required environment variables' },
                { status: 500 }
            );
        }

        // Initialize Tally service
        const tallyService = tally({
            apiKey: apiKeys.tally,
            organizationName: config.organizationName,
            chainId: config.chainId,
        });

        // Get all proposals
        const proposals = await tallyService.getTools()[0].execute({
            name: 'tally_proposals',
            id: 'all_proposals',
            organization: config.organizationName,
            isDescending: true,
            limit: 50,
            afterCursor: '',
        });

        // Check discovery status for each proposal
        const proposalsWithDiscovery = await checkProposalDiscovery(proposals.proposals.nodes);

        return NextResponse.json(proposalsWithDiscovery);
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch proposals' },
            { status: 500 }
        );
    }
} 