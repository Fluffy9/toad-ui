import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

/**
 * Protocols
 */
export class getAllProtocolsParameters extends createToolParameters(
    z.object({
        cname: z.string().describe("The name of the protocol"),
        cursor: z.string().describe("Pagination cursor to retrieve next page"),
        excludeTokenInfo: z.boolean().describe("Exclude token info, default is false"),
        includeContractMetadata: z.boolean().describe("Include contract metadata, default is false"),
        limit: z.number().describe("Limit the number of results"),
        pinned: z.boolean().describe("Comma seperated cnames of protocols, response will be in the in the order of pinned protocols at the start"),
    }),
) {}

export class getSingleProtocolParameters extends createToolParameters(
    z.object({
        cname: z.string().describe("The name of the protocol"),
        excludeTokenInfo: z.boolean().describe("Exclude token info, default is false"),
        includeContractMetadata: z.boolean().describe("Include contract metadata, default is false"),
    }),
) {}

/**
 * Proposals
 */
export class getAllProposalsForProtocolParameters extends createToolParameters(
    z.object({
        cname: z.string().describe("The name of the protocol"),
        cursor: z.string().describe("Pagination cursor to retrieve next page"),
        limit: z.number().describe("Limit the number of results"),
        status: z.string().describe("Status of the proposal, allowed values: pending, active, closed"),
        includesFlagged: z.string().describe("Include flagged proposals, default is false"),
        orderByIndexedAt: z.string().describe("Order in which data is indexed by, allowed values: asc, desc"),
        proposer: z.string().describe("Proposer address of the proposal"),
    }),
) {}

export class getProposalsAcrossAllProtocolsParameters extends createToolParameters(
    z.object({
        cnames: z.string().describe("Comma seperated cnames of protocols"),
        cursor: z.string().describe("Pagination cursor to retrieve next page"),
        limit: z.number().describe("Limit the number of results"),
        status: z.string().describe("Status of the proposal, allowed values: pending, active, closed"),
        proposer: z.string().describe("Proposer address of the proposal"),
        proposers: z.string().describe("Comma seperated proposer addresses of the proposal"),
        excludeVotedOnBy: z.string().describe("Filter proposals voted on by an address."),
        includeFlagged: z.string().describe("Include flagged proposals, default is false"),
        includeVoteFunctionInfo: z.boolean().describe("Include voting contract, vote function selectors and inputs"),
        lite: z.boolean().describe("return lite version of the response, Filters results, choices and total votes"),
        orderByIndexedAt: z.string().describe("Order in which data is indexed by, allowed values: asc, desc"),
    }),
) {}

export class getSingleProposalParameters extends createToolParameters(
    z.object({
        refId: z.string().describe("proposal ID number"),
        includeVoteFunctionInfo: z.boolean().describe("Include voting contract, vote function selectors and inputs"),
    }),
) {}

export class getPendingVotesByAddressParameters extends createToolParameters(
    z.object({
        proposalRefId: z.string().describe("proposal ID number"),
        adapter: z.string().describe("Whether it is snapshot or onchain instances to query for"),
        address: z.string().describe("address of the voter"),
        protocol: z.string().describe("protocol name"),
    }),
) {}
/**
 * Discourse Topics
 */
export class getDiscourseTopicsParameters extends createToolParameters(
    z.object({
        categoryId: z.number().describe("category ID number, this will return all topics with that categoryId in discourse"),
        cursor: z.string().describe("Pagination cursor to retrieve next page"),
        protocol: z.string().describe(`protocol cname that you want to get discourse topics for, you can pass multiple protocol cnames separated by ","`),
        topicId: z.number().describe("a single discourse topic ID, this will return a single topic with that ID"),
    }),
) {}

export class getDiscourseCategoriesParameters extends createToolParameters(
    z.object({
        protocol: z.string().describe(`protocol cname that you want to get discourse categories for`),
    }),
) {}

export class getDiscourseTopicPostsParameters extends createToolParameters(
    z.object({
        cursor: z.string().describe("Pagination cursor to retrieve next page"),
        protocol: z.string().describe(`protocol cname that you want to get discourse topic posts for`),
        topicId: z.number().describe("topic ID number, this will return all replies with that topicId in discourse"),
        
    }),
) {}

/**
 * Voter
 */
// export class getPendingVotesByAddressParameters extends createToolParameters(
//     z.object({
//         adapter: z.string().describe("Whether it is snapshot or onchain instances to query for"),
//         proposalRefId: z.string().describe("proposal ID number"),
//         protocol: z.string().describe("protocol name"),
//     }),
// ) {}

export class getAllVotersForAProtocolParameters extends createToolParameters(
    z.object({
        cname: z.string().describe("The name of the protocol"),
        cursor: z.string().describe("Pagination cursor to retrieve next page"),
        limit: z.number().describe("Limit the number of results"),
    }),
) {}

export class getVotersAcrossAllProtocolsParameters extends createToolParameters(
    z.object({
        cursor: z.string().describe("Pagination cursor to retrieve next page"),
        limit: z.number().describe("Limit the number of results"),
    }),
) {}

export class getDetailsForASpecificVoterParameters extends createToolParameters(
    z.object({
        address: z.string().describe("address of the voter"),
    }),
) {}

export class getVotesOnAProposalParameters extends createToolParameters(
    z.object({
        refId: z.string().describe("proposal ID number"),
        addresses: z.string().describe("Comma seperated addresses of the voters"),
        cursor: z.string().describe("Pagination cursor to retrieve next page"),
        fromTimestamp: z.number().describe("filter by votes after this timestamp"),
        limit: z.number().describe("Limit the number of results"),
        pinned: z.boolean().describe("Response is Ordered with votes cast by these addresses at the start."),
        untilTimestamp: z.number().describe("filter by votes before this timestamp"),
    }),
) {}
