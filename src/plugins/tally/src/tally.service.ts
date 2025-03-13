import { TallyApi } from "./api";
import { getAllProposalsParameters, getProposalByIdParameters, getProposalByNameParameters } from "./parameters";
import { organizationQuery, proposalsQuery, proposalQuery } from "./constants";

interface Proposal {
    id: string;
    governor: {
        id: string;
        name: string;
    };
    metadata: {
        title: string;
        description: string;
    };
    votingStats: {
        forVotes: string;
        againstVotes: string;
        abstainVotes: string;
    };
    status: string;
}

interface Organization {
    id: string;
    name: string;
    proposalCount: number;
}

export class TallyService {
    private tallyApi: TallyApi;
    private organization: Organization | null = null;

    constructor(apiKey: string, organizationName: string, chainId: string) {
        this.tallyApi = new TallyApi(apiKey, organizationName, chainId);
    }

    async getOrganization(): Promise<Organization> {
        const organizationQueryData = {
            query: organizationQuery,
            operationName: "Organization",
            variables: {}
        }
        const organizationResponse = await this.tallyApi.makeRequest(organizationQueryData);
        return organizationResponse.data.organization;
    }

    async getAllProposals(parameters: getAllProposalsParameters): Promise<Proposal[]> {
        if (!this.organization) {
            this.organization = await this.getOrganization();
        }
        const proposalsQueryData = {
            query: proposalsQuery,
            operationName: "Proposals",
            variables: {
                input: {
                    organizationId: this.organization?.id,
                    ...parameters
                }
            }
        }
        const proposalsResponse = await this.tallyApi.makeRequest(proposalsQueryData);
        return proposalsResponse?.data?.proposals || [];
    }

    async getProposalById(parameters: getProposalByIdParameters): Promise<Proposal | null> {
        if (!this.organization) {
            this.organization = await this.getOrganization();
        }
        const proposalQueryData = {
            query: proposalQuery,
            operationName: "Proposal",
            variables: {
                input: { id: parameters.id }
            }
        }
        const proposalResponse = await this.tallyApi.makeRequest(proposalQueryData);
        return proposalResponse?.data?.proposal || null;
    }

    async getProposalByName(parameters: getProposalByNameParameters): Promise<Proposal | null> {
        if (!this.organization) {
            this.organization = await this.getOrganization();
        }
        // Since Tally API doesn't support querying by name, we'll fetch all proposals and filter
        const proposals = await this.getAllProposals({
            organization: this.organization.name,
            isDescending: false,
            limit: 100,
            afterCursor: ""
        });
        return proposals.find(p => p.metadata.title.toLowerCase().includes(parameters.name.toLowerCase())) || null;
    }
}