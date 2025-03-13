import { createTool, PluginBase, WalletClientBase } from "@goat-sdk/core";
import { DiscourseService } from "./discourse.service";
import { DiscourseApi } from "./api";
import { z } from "zod";
import {
    getDiscourseSearchParameters,
    getLatestPostsParameters,
    getPostParameters,
    getPostRepliesParameters,
} from "./parameters";

export type DiscourseOptions = {
    apiKey: string;
    apiUsername: string;
    baseUrl: string;
}

export class DiscoursePlugin extends PluginBase {
    private discourseService: DiscourseService;

    constructor(options: DiscourseOptions) {
        const service = new DiscourseService(new DiscourseApi(options.apiKey, options.apiUsername, options.baseUrl));
        super("discourse", [service]);
        this.discourseService = service;
    }

    supportsChain = () => true;
    getTools(walletClient: WalletClientBase) {
        return [
            createTool({
                name: "discourse_getDiscourseSearch",
                description: "Search for posts from the current governance organization in Discourse",
                parameters: getDiscourseSearchParameters.schema,
            }, async (parameters) => {
                return this.discourseService.getDiscourseSearch(parameters);
            }),

            createTool({
                name: "discourse_getLatestPosts",
                description: "Get the latest post from the current governance organization in Discourse",
                parameters: getLatestPostsParameters.schema,
            }, async (parameters) => {
                return this.discourseService.getLatestPosts(parameters);
            }),

            createTool({
                name: "discourse_getPost",
                description: "Get a post from the current governance organization in Discourse",
                parameters: getPostParameters.schema,
            }, async (parameters) => {
                return this.discourseService.getPost(parameters);
            }),

            createTool({
                name: "discourse_getPostReplies",
                description: "Get the replies to a post in Discourse",
                parameters: getPostRepliesParameters.schema,
            }, async (parameters) => {
                return this.discourseService.getPostReplies(parameters);
            })
        ];
    }
}

export function discourse(options: DiscourseOptions) {
    return new DiscoursePlugin(options);
}
