// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interface to interact with Master Token
interface IMusicNFT {
    function getLatestEthPrice() external view returns (uint256);
    function ownerOf(uint256 tokenId) external view returns (address);
}

contract UsageRightsNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    IMusicNFT public masterContract;

    // Pricing in USD (18 decimals)
    uint256 public constant NORMAL_FEE_USD = 1 * 1e18;      // $1
    uint256 public constant ENTERPRISE_FEE_USD = 20 * 1e18; // $20

    enum UsageType { Normal, Enterprise }

    // Maps the Rights Token to the Original Song ID
    mapping(uint256 => uint256) public rightToSongId;

    event UsageRightMinted(address indexed buyer, uint256 tokenId, uint256 songId, UsageType usageType);

    constructor(address _masterContract, address _initialOwner) 
        ERC721("SongUsageRights", "SUR") 
        Ownable(_initialOwner) 
    {
        masterContract = IMusicNFT(_masterContract);
    }

    
    function mintUsageRight(
        uint256 songId, 
        UsageType usageType, 
        string memory lighthouseURI
    ) public payable returns (uint256) {
        // 1. Calculate price in ETH 
        uint256 requiredUsd = (usageType == UsageType.Normal) ? NORMAL_FEE_USD : ENTERPRISE_FEE_USD;
        uint256 ethPrice = masterContract.getLatestEthPrice();
        uint256 requiredEth = (requiredUsd * 1e18) / ethPrice;

        // 2. Security Checks
        require(msg.value >= requiredEth, "Insufficient ETH sent for this tier");
        require(masterContract.ownerOf(songId) != address(0), "Song does not exist");

        // 3. Minting
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, lighthouseURI);
        
        rightToSongId[tokenId] = songId;

        emit UsageRightMinted(msg.sender, tokenId, songId, usageType);
        return tokenId;
    }

    
    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
    }
}