export class BoardroomApi {
    public readonly baseUrl = "https://api.boardroom.info/v1";

    constructor(private readonly apiKey: string) {}

    async makeRequest(path: string, options: RequestInit = {}) {
        const query = new URL(`${this.baseUrl}${path}`);
        query.searchParams.append("key", this.apiKey);
        console.log(query.toString());
        const response = await fetch(query, {
            ...options,
            headers: {
                ...options.headers,
            },
        });

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error("Boardroom API rate limit exceeded");
            }
            throw new Error(`Boardroom API request failed: ${response.statusText}`);
        }

        return (await response.json()).data;
    }

}