// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTContract is ERC721URIStorage {
    uint256 private tokenIdCounter;

    constructor() ERC721("NFTContract", "NFTC") {}

    function generateNFT(address to, string memory tokenURI) external returns (uint256) {
        uint256 newTokenId = tokenIdCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenIdCounter++;
        return newTokenId;
    }
}
