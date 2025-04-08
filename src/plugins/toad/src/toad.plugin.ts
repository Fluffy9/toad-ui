import { createTool, PluginBase } from "@goat-sdk/core";
import { ToadService } from "./toad.service";
import {
    getProposalAnswerParameters,
    getProposalReasonParameters,
    getProposalDetailsParameters,
} from "./parameters";

export type ToadOptions = {
    contractAddress: string;
    chainId: string;
}

export class ToadPlugin extends PluginBase {
    private toadService: ToadService;

    constructor(options: ToadOptions) {
        const service = new ToadService(options.contractAddress as `0x${string}`, options.chainId);
        super("toad", [service]);
        this.toadService = service;
    }

    supportsChain = () => true;
    getTools() {
        return [
            createTool({
                name: "toad_proposal_answer",
                description: "Fetches the answer for a specific proposal that I, (TOAD), have decided on from the TOAD contract",
                parameters: getProposalAnswerParameters,
            }, async (parameters) => {
                return await this.toadService.getProposalAnswer(parameters.proposalId);
            }),

            createTool({
                name: "toad_proposal_reason",
                description: "Fetches the reason for a specific proposal that I, (TOAD), have decided on from the TOAD contract",
                parameters: getProposalReasonParameters,
            }, async (parameters) => {
                return await this.toadService.getProposalReason(parameters.proposalId);
            }),

            createTool({
                name: "toad_proposal_details",
                description: "Fetches both the answer and reason for a specific proposal that I, (TOAD), have decided on from the TOAD contract",
                parameters: getProposalDetailsParameters,
            }, async (parameters) => {
                return await this.toadService.getProposalDetails(parameters.proposalId);
            })
        ];
    }
}

export function toad(options: ToadOptions) {
    return new ToadPlugin(options);
} 