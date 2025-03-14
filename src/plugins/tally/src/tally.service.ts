import { TallyApi } from "./api";
import { getAllProposalsParameters, getProposalByIdParameters, getProposalByNameParameters } from "./parameters";
import { organizationQuery, proposalsQuery, proposalQuery } from "./constants";


interface Organization {
    id: string;
    governorIds: string[];
}

export class TallyService {
    private tallyApi: TallyApi;
    private organization: Organization | null = null;

    constructor(apiKey: string, organizationName: string, chainId: string) {
        this.tallyApi = new TallyApi(apiKey, organizationName, chainId);
    }

    async getOrganization() {
        const organizationQueryData = {
            query: organizationQuery,
            operationName: "Organization",
            variables: {            
                input: {
                    slug: this.tallyApi.organizationName.toLowerCase()
                }
            }        
        }
        const organizationResponse = await this.tallyApi.makeRequest(organizationQueryData);
        return organizationResponse.organization;
    }

    async getAllProposals(parameters: getAllProposalsParameters) {
        if (!this.organization) {
            this.organization = await this.getOrganization();
        }
        const proposalsQueryData = {
            query: proposalsQuery,
            operationName: "Proposals",
            variables: {
                governorId:this.organization?.governorIds[0],
                sort: {sortBy: "id", isDescending: parameters.isDescending},
                page: {limit: parameters.limit},
                afterCursor: parameters.afterCursor,
            }
        }
        console.log("proposalsQueryData: ", JSON.stringify(proposalsQueryData));
        const proposalsResponse = await this.tallyApi.makeRequest(proposalsQueryData);
        return proposalsResponse || [];
    }

    async getProposalById(parameters: getProposalByIdParameters) {
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
        return proposalResponse || null;
    }

    async getProposalByName(parameters: getProposalByNameParameters) {
        console.log("getProposalByName: ", parameters);
        return "You can only request Tally proposals by id. Try using the getProposalById method.";
    }
}