"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZK_VERIFIER_ABI = exports.VOTE_MANAGER_ABI = exports.CONSENSUS_ENGINE_ABI = exports.NEWS_REGISTRY_ABI = exports.CONTRACT_ADDRESSES = void 0;
exports.getContracts = getContracts;
exports.validateContractAddresses = validateContractAddresses;
// src/config/contracts.ts
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Contract addresses (update after deployment)
 */
exports.CONTRACT_ADDRESSES = {
    zkVerifier: requireEnv("ZKVERIFIER_ADDRESS"),
    newsRegistry: requireEnv("NEWSREGISTRY_ADDRESS"),
    voteManager: requireEnv("VOTEMANAGER_ADDRESS"),
    consensusEngine: requireEnv("CONSENSUSENGINE_ADDRESS"),
};
/**
 * Contract ABIs
 * Note: These should be imported from your compiled contracts
 * For now, we include minimal ABIs for the functions we need
 */
exports.NEWS_REGISTRY_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_zkVerifier",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "contentHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "submitter",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "submitterZkHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "aiScore",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "NewsSubmitted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allNewsIds",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "contentHashToNewsId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "getAIScore",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "count",
                "type": "uint256"
            }
        ],
        "name": "getLatestNews",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "getNews",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "contentHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "aiScore",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "submitter",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "submitterZkHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "sourceUrl",
                        "type": "string"
                    },
                    {
                        "internalType": "bool",
                        "name": "exists",
                        "type": "bool"
                    }
                ],
                "internalType": "struct NewsRegistry.News",
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
                "internalType": "uint256",
                "name": "offset",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "limit",
                "type": "uint256"
            }
        ],
        "name": "getNewsList",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalNews",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "newsById",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "contentHash",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "aiScore",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "submitter",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "submitterZkHash",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "sourceUrl",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "exists",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "newsCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "contentHash",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "sourceUrl",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "aiScore",
                "type": "uint256"
            }
        ],
        "name": "submitNews",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "zkVerifier",
        "outputs": [
            {
                "internalType": "contract ZKVerifier",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
exports.CONSENSUS_ENGINE_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newsRegistry",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_voteManager",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum ConsensusEngine.Verdict",
                "name": "verdict",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "finalScore",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "confidence",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "VerdictCalculated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum ConsensusEngine.Verdict",
                "name": "verdict",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "VerdictFinalized",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "aiWeight",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "calculateVerdict",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "disputeThreshold",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "fakeThreshold",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "getResult",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "newsId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum ConsensusEngine.Verdict",
                        "name": "verdict",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "aiScore",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "communityScore",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "finalScore",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "confidence",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "finalized",
                        "type": "bool"
                    }
                ],
                "internalType": "struct ConsensusEngine.ConsensusResult",
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
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "getVerdict",
        "outputs": [
            {
                "internalType": "enum ConsensusEngine.Verdict",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "isFinalized",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minVotesRequired",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "newsRegistry",
        "outputs": [
            {
                "internalType": "contract NewsRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "realThreshold",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "results",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            },
            {
                "internalType": "enum ConsensusEngine.Verdict",
                "name": "verdict",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "aiScore",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "communityScore",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "finalScore",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "confidence",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "finalized",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newWeight",
                "type": "uint256"
            }
        ],
        "name": "setAIWeight",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newMin",
                "type": "uint256"
            }
        ],
        "name": "setMinVotesRequired",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_realThreshold",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_fakeThreshold",
                "type": "uint256"
            }
        ],
        "name": "setThresholds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "voteManager",
        "outputs": [
            {
                "internalType": "contract VoteManager",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
exports.VOTE_MANAGER_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_zkVerifier",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_newsRegistry",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "voterZkHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "enum VoteManager.VoteType",
                "name": "voteType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "VoteCast",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "voterZkHash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "enum VoteManager.VoteType",
                "name": "oldVote",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "enum VoteManager.VoteType",
                "name": "newVote",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "VoteChanged",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "allowVoteChanges",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            },
            {
                "internalType": "enum VoteManager.VoteType",
                "name": "voteType",
                "type": "uint8"
            }
        ],
        "name": "castVote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "getMyVote",
        "outputs": [
            {
                "internalType": "enum VoteManager.VoteType",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "voterZkHash",
                "type": "bytes32"
            }
        ],
        "name": "getVote",
        "outputs": [
            {
                "internalType": "enum VoteManager.VoteType",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "getVoteCounts",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "real",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fake",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "uncertain",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "total",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct VoteManager.VoteCounts",
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
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "getVotePercentages",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "realPercent",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "fakePercent",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "uncertainPercent",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "voterZkHash",
                "type": "bytes32"
            }
        ],
        "name": "hasVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "newsId",
                "type": "uint256"
            }
        ],
        "name": "haveIVoted",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "newsRegistry",
        "outputs": [
            {
                "internalType": "contract NewsRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "allow",
                "type": "bool"
            }
        ],
        "name": "setAllowVoteChanges",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "voteCounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "real",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "fake",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "uncertain",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "total",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "votes",
        "outputs": [
            {
                "internalType": "enum VoteManager.VoteType",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "zkVerifier",
        "outputs": [
            {
                "internalType": "contract ZKVerifier",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
exports.ZK_VERIFIER_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "zkHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "UserRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "zkHash",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "UserVerified",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "addressToZkHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "zkHash",
                "type": "bytes32"
            }
        ],
        "name": "getAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "userAddress",
                "type": "address"
            }
        ],
        "name": "getZkHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "zkHash",
                "type": "bytes32"
            }
        ],
        "name": "isVerified",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "zkHash",
                "type": "bytes32"
            }
        ],
        "name": "revokeVerification",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalVerifiedUsers",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "verifiedUsers",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "zkHash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "proof",
                "type": "bytes"
            }
        ],
        "name": "verifyAndRegister",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "zkHashToAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
/**
 * Get contract instances with signer
 */
function getContracts(signer) {
    const newsRegistry = new ethers_1.ethers.Contract(exports.CONTRACT_ADDRESSES.newsRegistry, exports.NEWS_REGISTRY_ABI, signer);
    const consensusEngine = new ethers_1.ethers.Contract(exports.CONTRACT_ADDRESSES.consensusEngine, exports.CONSENSUS_ENGINE_ABI, signer);
    const voteManager = new ethers_1.ethers.Contract(exports.CONTRACT_ADDRESSES.voteManager, exports.VOTE_MANAGER_ABI, signer);
    const zkVerifier = new ethers_1.ethers.Contract(exports.CONTRACT_ADDRESSES.zkVerifier, exports.ZK_VERIFIER_ABI, signer);
    return {
        newsRegistry,
        consensusEngine,
        voteManager,
        zkVerifier
    };
}
/**
 * Validate that all contract addresses are set
 */
function validateContractAddresses() {
    const addresses = Object.values(exports.CONTRACT_ADDRESSES);
    const allSet = addresses.every(addr => addr && addr.length > 0);
    if (!allSet) {
        console.error('❌ Not all contract addresses are set!');
        console.error('Missing addresses:', {
            zkVerifier: !exports.CONTRACT_ADDRESSES.zkVerifier,
            newsRegistry: !exports.CONTRACT_ADDRESSES.newsRegistry,
            voteManager: !exports.CONTRACT_ADDRESSES.voteManager,
            consensusEngine: !exports.CONTRACT_ADDRESSES.consensusEngine
        });
    }
    return allSet;
}
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not set`);
    }
    return value;
}
