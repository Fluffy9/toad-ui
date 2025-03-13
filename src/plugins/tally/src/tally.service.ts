import { TallyApi } from "./api";
import { getAllProposalsParameters, getProposalByIdParameters, getProposalByNameParameters } from "./parameters";
import { organizationQuery, proposalsQuery, proposalQuery } from "./constants";

export class TallyService {
    organization: any;
    constructor(private readonly tallyApi: TallyApi) {
        this.organization = null;
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
        return organizationResponse;
    }

    async getAllProposals(parameters: getAllProposalsParameters) {
        if (!this.organization) {
            this.organization = await this.getOrganization();
        }
        if (!this.organization) {
            return "Organization not found";
        }
        const proposalsQueryData = {
            query: proposalsQuery,
            operationName: "Proposals",
            variables: {
                governorId: this.organization.organization.governorIds[0],
                sort: { sortBy: "id", isDescending: parameters.isDescending },
                page: { limit: parameters.limit },
                afterCursor: parameters.afterCursor,
            }
        }
        console.log("Proposals Query Data", JSON.stringify(proposalsQueryData.variables));
        const proposalsResponse = await this.tallyApi.makeRequest(proposalsQueryData);
        console.log("Proposals Response", JSON.stringify(proposalsResponse));

        return proposalsResponse ? proposalsResponse : "No proposals found";
    }

    async getProposalById(parameters: getProposalByIdParameters) {
        if (!this.organization) {
            this.organization = await this.getOrganization();
        }
        if (!this.organization) {
            return "Organization not found";
        }
        const proposalQueryData = {
            query: proposalQuery,
            operationName: "Proposal",
            variables: {
                input: { id: parameters.id }
            }
        }
        const proposalResponse = await this.tallyApi.makeRequest(proposalQueryData);
        return proposalResponse ? proposalResponse : "Proposal id not found";
    }

    async getProposalByName(parameters: getProposalByNameParameters) {
        return "You can only query Tally by proposals by id, try asking for a list of proposals instead";
    }
}