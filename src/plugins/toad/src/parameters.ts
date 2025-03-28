import { z } from 'zod';

export const getProposalAnswerParameters = z.object({
    proposalId: z.string().describe('The ID of the proposal to get the answer for'),
});

export const getProposalReasonParameters = z.object({
    proposalId: z.string().describe('The ID of the proposal to get the reason for'),
});

export const getProposalDetailsParameters = z.object({
    proposalId: z.string().describe('The ID of the proposal to get details for'),
}); 