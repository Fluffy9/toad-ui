import { tally } from "../../../plugins/tally/src";
import { NextResponse } from 'next/server';
import { apiKeys, config, hasRequiredEnvVars } from '@/config/constants';

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
            limit: 10,
            afterCursor: '',
        });

        return NextResponse.json(proposals);
    } catch (error) {
        console.error('Error fetching proposals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch proposals' },
            { status: 500 }
        );
    }
} 