// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ZKVerifier
 * @notice Verifies zero-knowledge login proofs and manages user identities
 * @dev Prevents Sybil attacks by ensuring one-person-one-vote
 */
contract ZKVerifier {
    
    // ============ Events ============
    
    event UserVerified(bytes32 indexed zkHash, address indexed userAddress, uint256 timestamp);
    event UserRevoked(bytes32 indexed zkHash, address indexed userAddress, uint256 timestamp);
    
    // ============ State Variables ============
    
    /// @notice Mapping of ZK identity hash to verification status
    mapping(bytes32 => bool) public verifiedUsers;
    
    /// @notice Mapping of ZK identity hash to associated address
    mapping(bytes32 => address) public zkHashToAddress;
    
    /// @notice Mapping of address to ZK identity hash
    mapping(address => bytes32) public addressToZkHash;
    
    /// @notice Total number of verified users
    uint256 public totalVerifiedUsers;
    
    /// @notice Owner address for admin functions
    address public owner;
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // ============ Constructor ============
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Verifies a ZK proof and registers the user
     * @param zkHash The zero-knowledge hash representing the user's identity
     * @param proof The ZK proof data (simplified for MVP)
     * @dev In production, this would verify actual ZK proofs using zk-SNARKs
     */
    function verifyAndRegister(bytes32 zkHash, bytes calldata proof) external {
        require(zkHash != bytes32(0), "Invalid ZK hash");
        require(!verifiedUsers[zkHash], "User already verified");
        require(addressToZkHash[msg.sender] == bytes32(0), "Address already has identity");
        
        // Simplified proof verification for MVP
        // In production: verify zk-SNARK proof using a verifier contract
        require(_verifyProof(zkHash, proof), "Invalid proof");
        
        // Register the user
        verifiedUsers[zkHash] = true;
        zkHashToAddress[zkHash] = msg.sender;
        addressToZkHash[msg.sender] = zkHash;
        totalVerifiedUsers++;
        
        emit UserVerified(zkHash, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Internal function to verify the ZK proof
     * @param zkHash The ZK identity hash
     * @param proof The proof data
     * @return bool Whether the proof is valid
     * @dev Simplified for MVP - replace with actual ZK verification logic
     */
    function _verifyProof(bytes32 zkHash, bytes calldata proof) internal pure returns (bool) {
        // MVP: Basic validation
        // Production: Use Groth16/PLONK verifier
        if (proof.length < 32) return false;
        
        // Simple check: proof should contain some relation to zkHash
        // This is a placeholder - replace with real ZK proof verification
        bytes32 proofHash = keccak256(proof);
        return proofHash != bytes32(0) && zkHash != bytes32(0);
    }
    
    /**
     * @notice Checks if a ZK identity is verified
     * @param zkHash The ZK identity hash to check
     * @return bool Whether the identity is verified
     */
    function isVerified(bytes32 zkHash) external view returns (bool) {
        return verifiedUsers[zkHash];
    }
    
    /**
     * @notice Gets the ZK hash for an address
     * @param userAddress The address to look up
     * @return bytes32 The ZK identity hash
     */
    function getZkHash(address userAddress) external view returns (bytes32) {
        return addressToZkHash[userAddress];
    }
    
    /**
     * @notice Gets the address for a ZK hash
     * @param zkHash The ZK identity hash to look up
     * @return address The associated address
     */
    function getAddress(bytes32 zkHash) external view returns (address) {
        return zkHashToAddress[zkHash];
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Revokes a user's verification (admin only)
     * @param zkHash The ZK identity hash to revoke
     * @dev Use for moderation or dispute resolution
     */
    function revokeVerification(bytes32 zkHash) external onlyOwner {
        require(verifiedUsers[zkHash], "User not verified");
        
        address userAddress = zkHashToAddress[zkHash];
        
        verifiedUsers[zkHash] = false;
        delete zkHashToAddress[zkHash];
        delete addressToZkHash[userAddress];
        totalVerifiedUsers--;
        
        emit UserRevoked(zkHash, userAddress, block.timestamp);
    }
    
    /**
     * @notice Transfers ownership of the contract
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner");
        owner = newOwner;
    }
}