export class DiscourseApi {

    constructor(private readonly apiKey: string, private readonly apiUsername: string, private readonly baseUrl: string) {}

    async makeRequest(path: string, options: RequestInit = {}) {
        let query = new URL(`${this.baseUrl}${path}`);
        console.log(query.toString());
        const response = await fetch(query, {
            ...options,
            headers: {
                ...options.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("Discourse API rate limit exceeded");
            }
            throw new Error(`Discourse API request failed: ${response.statusText}`);
        }
        let res = await response.json();
        return res;
    }

}