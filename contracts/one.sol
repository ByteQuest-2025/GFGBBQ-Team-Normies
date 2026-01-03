// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract MusicNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    AggregatorV3Interface internal priceFeed;
    uint256 public constant MINT_FEE_USD = 50 * 1e18; 

    mapping(address => uint256[]) private _ownerToTokenIds;
    event SongMinted(address indexed singer, uint256 tokenId);

    constructor(address _priceFeed) ERC721("ZenoMusic", "ZM") Ownable(msg.sender) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLatestEthPrice() public view returns (uint256) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return uint256(price) * 1e10; 
    }

    function getMintFeeInEth() public view returns (uint256) {
        return (MINT_FEE_USD * 1e18) / getLatestEthPrice();
    }

    function mintSong(string memory lighthouseURI) public payable {
        require(msg.value >= getMintFeeInEth(), "Need $50 worth of ETH");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, lighthouseURI);

        _ownerToTokenIds[msg.sender].push(tokenId);
        emit SongMinted(msg.sender, tokenId);
    }

    
    function getTokensByOwner(address _owner) public view returns (uint256[] memory) {
        return _ownerToTokenIds[_owner];
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Transfer failed.");
    }
}