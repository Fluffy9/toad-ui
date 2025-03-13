import { createTool, PluginBase, WalletClientBase } from "@goat-sdk/core";
import { TallyService } from "./tally.service";
import { TallyApi } from "./api";
import { z } from "zod";
import {
    getAllProposalsParameters,
    getProposalByIdParameters,
    getProposalByNameParameters,
} from "./parameters";

export type TallyOptions = {
    apiKey: string;
    organizationName: string;
    chainId: string;
}

export class TallyPlugin extends PluginBase {
    private tallyService: TallyService;

    constructor(options: TallyOptions) {
        const service = new TallyService(new TallyApi(options.apiKey, options.organizationName, options.chainId));
        super("tally", [service]);
        this.tallyService = service;
    }

    supportsChain = () => true;
    getTools(walletClient: WalletClientBase) {
        return [
            createTool({
                name: "tally_proposals",
                description: "Fetches a list of proposals for the current governance organization from Tally",
                parameters: getAllProposalsParameters.schema,
            }, async (parameters) => {
                return this.tallyService.getAllProposals(parameters);
            }),

            createTool({
                name: "tally_proposalbyid",
                description: "Fetches details of a proposal for the current governance organization by id from Tally",
                parameters: getProposalByIdParameters.schema,
            }, async (parameters) => {
                return this.tallyService.getProposalById(parameters);
            }),

            createTool({
                name: "tally_proposalbyname",
                description: "Fetches details of a proposal for the current governance organization by name from Tally",
                parameters: getProposalByNameParameters.schema,
            }, async (parameters) => {
                return this.tallyService.getProposalByName(parameters);
            })
        ];
    }
}

export function tally(options: TallyOptions) {
    return new TallyPlugin(options);
}
