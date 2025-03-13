import { createTool, PluginBase } from "@goat-sdk/core";
import { BoardroomService } from "./boardroom.service";
import { BoardroomApi } from "./api";
import {
    getDiscourseTopicsParameters,
    getDiscourseCategoriesParameters,
    getDiscourseTopicPostsParameters,
    getPendingVotesByAddressParameters,
    getAllVotersForAProtocolParameters,
    getVotersAcrossAllProtocolsParameters,
    getDetailsForASpecificVoterParameters,
} from "./parameters";

export type BoardroomOptions = {
    apiKey: string;
}

export class BoardroomPlugin extends PluginBase {
    private boardroomService: BoardroomService;

    constructor(options: BoardroomOptions) {
        const service = new BoardroomService(new BoardroomApi(options.apiKey));
        super("boardroom", [service]);
        this.boardroomService = service;
    }

    supportsChain = () => true;
    getTools() {
        return [
            createTool({
                name: "boardroom_getDiscourseTopics",
                description: "Gets a list of all the discourse topics for a protocol",
                parameters: getDiscourseTopicsParameters.schema,
            }, async (parameters) => {
                return this.boardroomService.getDiscourseTopics(parameters);
            }),

            createTool({
                name: "boardroom_getDiscourseCategories",
                description: "Gets a list of all the discourse categories for a protocol",
                parameters: getDiscourseCategoriesParameters.schema,
            }, async (parameters) => {
                return this.boardroomService.getDiscourseCategories(parameters);
            }),

            createTool({
                name: "boardroom_getDiscourseTopicPosts",
                description: "Gets a list of all the discourse topic posts for a topic",
                parameters: getDiscourseTopicPostsParameters.schema,
            }, async (parameters) => {
                return this.boardroomService.getDiscourseTopicPosts(parameters);
            }),

            createTool({
                name: "boardroom_getPendingVotesByAddress",
                description: "Get pending votes by address",
                parameters: getPendingVotesByAddressParameters.schema,
            }, async (parameters) => {
                return this.boardroomService.getPendingVotesByAddress(parameters);
            }),

            createTool({
                name: "boardroom_getAllVotersForAProtocol",
                description: "Gets a list of all the voters for a protocol",
                parameters: getAllVotersForAProtocolParameters.schema,
            }, async (parameters) => {
                return this.boardroomService.getAllVotersForAProtocol(parameters);
            }),

            createTool({
                name: "boardroom_getVotersAcrossAllProtocols",
                description: "Gets a list of all the voters across all protocols",
                parameters: getVotersAcrossAllProtocolsParameters.schema,
            }, async (parameters) => {
                return this.boardroomService.getVotersAcrossAllProtocols(parameters);
            }),

            createTool({
                name: "boardroom_getDetailsForASpecificVoter",
                description: "Gets details for a specific voter",
                parameters: getDetailsForASpecificVoterParameters.schema,
            }, async (parameters) => {
                return this.boardroomService.getDetailsForASpecificVoter(parameters);
            })
        ];
    }
}

export function boardroom(options: BoardroomOptions) {
    return new BoardroomPlugin(options);
}
