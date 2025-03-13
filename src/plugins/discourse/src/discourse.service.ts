import { getDiscourseSearchParameters, getLatestPostsParameters, getPostParameters, getPostRepliesParameters } from "./parameters";
import { DiscourseApi } from "./api";

export class DiscourseService {
    constructor(private readonly discourseApi: DiscourseApi) { }

    async getDiscourseSearch(parameters: getDiscourseSearchParameters) {
        const query = new URLSearchParams();
        Object.keys(parameters).map((parameter) => {
            if (parameters[parameter as keyof getDiscourseSearchParameters]) {
                query.set(parameter, parameters[parameter as keyof getDiscourseSearchParameters].toString());
            }
        });
        const endpoint = "/search.json?" + query.toString();
        const response = await this.discourseApi.makeRequest(endpoint);
        return response;
    }

    async getLatestPosts(parameters: getLatestPostsParameters) {
        const query = new URLSearchParams();
        Object.keys(parameters).map((parameter) => {
            if (parameters[parameter as keyof getLatestPostsParameters]) {
                query.set(parameter, parameters[parameter as keyof getLatestPostsParameters].toString());
            }
        });
        const endpoint = "/posts.json?" + query.toString();
        const response = await this.discourseApi.makeRequest(endpoint);
        return response;
    }

    async getPost(parameters: getPostParameters) {
        const endpoint = `/posts/${parameters.post_id}.json`
        const response = await this.discourseApi.makeRequest(endpoint);
        return response;
    }

    async getPostReplies(parameters: getPostRepliesParameters) {
        const endpoint = `/posts/${parameters.post_id}/replies.json`
        const response = await this.discourseApi.makeRequest(endpoint);
        return response;
    }
}
