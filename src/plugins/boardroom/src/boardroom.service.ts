import { Tool } from "@goat-sdk/core";
import { BoardroomApi } from "./api";
import { 
    getAllProposalsForProtocolParameters, 
    getAllProtocolsParameters, 
    getSingleProtocolParameters,
    getProposalsAcrossAllProtocolsParameters,
    getSingleProposalParameters,
    getPendingVotesByAddressParameters,
    getAllVotersForAProtocolParameters,
    getDiscourseTopicsParameters,
    getDiscourseCategoriesParameters,
    getDiscourseTopicPostsParameters,
    getVotersAcrossAllProtocolsParameters,
    getDetailsForASpecificVoterParameters,
} from "./parameters";

export class BoardroomService {
    constructor(private readonly boardroomApi: BoardroomApi) {}



    // @Tool({
    //     name: "boardroom_getPendingVotesByAddress",
    //     description: "Gets a list of all the pending votes for a address",
    // })
    // async getPendingVotesByAddress(parameters: getPendingVotesByAddressParameters) {
    //     const query = new URLSearchParams();
    //     query.set("adapter", parameters.adapter);
    //     query.set("address", parameters.address);
    //     query.set("protocol", parameters.protocol);
    //     const endpoint = `/proposals/${parameters.proposalRefId}/pendingVotes?` + query.toString();
    //     const response = await this.boardroomApi.makeRequest(endpoint);
    //     return response;
    // }

    async getDiscourseTopics(parameters: getDiscourseTopicsParameters) {
        const query = new URLSearchParams();
        Object.keys(parameters).map((parameter) => {
            if (parameters[parameter as keyof getDiscourseTopicsParameters]) {
                query.set(parameter, parameters[parameter as keyof getDiscourseTopicsParameters].toString());
            }
        });
        const endpoint = `/discourseTopics?` + query.toString();
        const response = await this.boardroomApi.makeRequest(endpoint);
        return response;
    }


    async getDiscourseCategories(parameters: getDiscourseCategoriesParameters) {
        const query = new URLSearchParams();
        Object.keys(parameters).map((parameter) => {
            if (parameters[parameter as keyof getDiscourseCategoriesParameters]) {
                query.set(parameter, parameters[parameter as keyof getDiscourseCategoriesParameters].toString());
            }
        });
        const endpoint = `/discourseCategories?` + query.toString();
        const response = await this.boardroomApi.makeRequest(endpoint);
        return response;
    }

    async getDiscourseTopicPosts(parameters: getDiscourseTopicPostsParameters) {
        const query = new URLSearchParams();
        Object.keys(parameters).map((parameter) => {
            if (parameters[parameter as keyof getDiscourseTopicPostsParameters]) {
                query.set(parameter, parameters[parameter as keyof getDiscourseTopicPostsParameters].toString());
            }
        });
        const endpoint = `/discourseTopics?` + query.toString();
        const response = await this.boardroomApi.makeRequest(endpoint);
        return response;
    }

    async getPendingVotesByAddress(parameters: getPendingVotesByAddressParameters) {
        const query = new URLSearchParams();
        Object.keys(parameters).map((parameter) => {
            if (parameters[parameter as keyof getPendingVotesByAddressParameters]) {
                query.set(parameter, parameters[parameter as keyof getPendingVotesByAddressParameters].toString());
            }
        });
        const endpoint = `/proposals/${parameters.address}/pendingVotes?` + query.toString();
        const response = await this.boardroomApi.makeRequest(endpoint);
        return response;
    }

    async getAllVotersForAProtocol(parameters: getAllVotersForAProtocolParameters) {
        const query = new URLSearchParams();
        Object.keys(parameters).map((parameter) => {
            if (parameters[parameter as keyof getAllVotersForAProtocolParameters]) {
                query.set(parameter, parameters[parameter as keyof getAllVotersForAProtocolParameters].toString());
            }
        });
        const endpoint = `/protocols/${parameters.cname}/voters?` + query.toString();
        const response = await this.boardroomApi.makeRequest(endpoint);
        return response;
    }

    async getVotersAcrossAllProtocols(parameters: getVotersAcrossAllProtocolsParameters) {
        const query = new URLSearchParams();
        Object.keys(parameters).map((parameter) => {
            if (parameters[parameter as keyof getVotersAcrossAllProtocolsParameters]) {
                query.set(parameter, parameters[parameter as keyof getVotersAcrossAllProtocolsParameters].toString());
            }
        });
        const endpoint = `/voters?` + query.toString();
        const response = await this.boardroomApi.makeRequest(endpoint);
        return response;
    }

    async getDetailsForASpecificVoter(parameters: getDetailsForASpecificVoterParameters) {
        const query = new URLSearchParams();
        Object.keys(parameters).map((parameter) => {
            if (parameters[parameter as keyof getDetailsForASpecificVoterParameters]) {
                query.set(parameter, parameters[parameter as keyof getDetailsForASpecificVoterParameters].toString());
            }
        });
        const endpoint = `/voters/${parameters.address}?` + query.toString();
        const response = await this.boardroomApi.makeRequest(endpoint);
        return response;
    }
    
}
