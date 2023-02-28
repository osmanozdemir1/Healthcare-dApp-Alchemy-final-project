// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//goerli address: 0x61Fd4512070Ae108F37E84d2A55b9abd8a2CDCB9
//second goerli: 0x9B462b6415D150f723a4Db45840c4FCcfA6F912d

contract ProofOfConsent is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable, IERC721Receiver {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("ProofOfConsent", "POC") {}

    // Create Surgery and Patient structures
    struct Surgery {
        string surgeryName;
        uint surgeryDate;
        address patientId;
    }

    struct Patient {
        address id;
        Surgery[] surgeries;
    }

    // Create a mapping for each address to a Patient structure.
    mapping(address => Patient) public patients;
    event SurgeryAdded(string surgeryName, uint surgeryDate, address patientId);

    // Function that updates the mapping and also calls safeMint function. 
    function addSurgery(string memory _surgeryName, uint _surgeryDate, address _to, string memory _uri) public {
        Surgery memory surgery = Surgery(_surgeryName, _surgeryDate, msg.sender);
        patients[msg.sender].id = msg.sender;
        patients[msg.sender].surgeries.push(surgery);
        safeMint(_to, _uri);

        emit SurgeryAdded(_surgeryName, _surgeryDate, msg.sender);
    }

    // Public view function to get values from the storage.
    function checkSurgery(address _patientId) public view returns(Surgery[] memory){
        return patients[_patientId].surgeries;
    }

    function safeMint(address to, string memory uri) internal {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // This contract will be the hospital vault and has to have onERC721Received function.
    // If this function is not implemented, contract can not receive tokens.
    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        require(from == address(0), "Token not transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}