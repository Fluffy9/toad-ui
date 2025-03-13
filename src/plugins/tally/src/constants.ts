export const proposalsQuery = `query Proposals($governorId: AccountID, $sort:ProposalsSortInput, $page:PageInput) {
    proposals(
      input: {filters: {governorId: $governorId}, 
        sort: $sort, page: $page}
    ) {
      nodes {
        ... on Proposal {
          id
          governor {
            id
            token {
              decimals
            }
            parameters {
              proposalThreshold
            }
            organization {
              id
              slug
            }
          }
          metadata {
            title
            description
          }
          start {
            ... on Block {
              timestamp
            }
          }
          end {
            ... on Block {
              timestamp
            }
          }
          createdAt
          voteStats {
            type
            votesCount
            votersCount
            percent
          }
          status
          proposer {
            address
          }
        }
      }
      pageInfo {
        firstCursor
        lastCursor
        count
      }
    }
  }`
  
export const organizationQuery = `query Organization($input: OrganizationInput!) {
      organization(input: $input) {
            id
            slug
            name
            chainIds
        tokenIds
        governorIds
        metadata {
          color
          description
          icon
        }
        hasActiveProposals
        proposalsCount
        delegatesCount
        delegatesVotesCount
        tokenOwnersCount
      }
    }`
  
export const proposalQuery = `query Proposal($input: ProposalInput!) {
    proposal(input: $input) {
      id
      onchainId
      block {
        id
        number
        timestamp
        ts
      }
      chainId
      metadata {
        title
        description
        eta
        ipfsHash
        previousEnd
        timelockId
        txHash
        discourseURL
        snapshotURL
      }
      organization {
        id
        slug
        name
        chainIds
        tokenIds
        governorIds
        hasActiveProposals
        proposalsCount
        delegatesCount
        delegatesVotesCount
        tokenOwnersCount
      }
      proposer {
        id
        address
        ens
        twitter
        name
        bio
        picture
        safes
        type
      }
      quorum
      status
      voteStats {
        type
        votesCount
        votersCount
        percent
      }
    }
  }`