import { createToolParameters } from "@goat-sdk/core";
import { z } from "zod";

export class getAllProposalsParameters extends createToolParameters(
    z.object({
        organization: z.string().describe("The organization to fetch"),
        isDescending: z.boolean().describe("The direction of the sort"),
        limit: z.number().describe("The number of proposals to fetch"),
        afterCursor: z.string().describe("The cursor to fetch the next page of proposals"),
    }),
) { }

export class getProposalByIdParameters extends createToolParameters(
    z.object({
        id: z.string().describe("The tally id of the proposal to fetch"),
    }),
) { }

export class getProposalByNameParameters extends createToolParameters(
    z.object({
        name: z.string().describe("The name of the proposal to fetch"),
    }),
) { }

export class generateGraphQLQueryParameters extends createToolParameters(
    z.object({
        request: z.string().describe("The user request in natural language"),
    }),
) { }

export class getTallyQueryParameters extends createToolParameters(
    z.object({
        graphql: z.string().describe("The graphql query to execute"),
        governor: z.string().describe("The organization to fetch"),
    }),
) { }
