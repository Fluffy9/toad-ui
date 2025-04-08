export const TOAD_ABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tallyId",
                "type": "uint256"
            }
        ],
        "name": "getProposal",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "tallyId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "answer",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "reason",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "discoveredAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "validBlock",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "disablePower",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votingPeriod",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "announced",
                        "type": "bool"
                    }
                ],
                "internalType": "struct TOAD.Proposal",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "proposalId",
                "type": "string"
            }
        ],
        "name": "getProposalAnswer",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "proposalId",
                "type": "string"
            }
        ],
        "name": "getProposalReason",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
] as const; 