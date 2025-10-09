export enum TxType {
  mintNFT = 'mintNFT(address to, uint256 quantity, uint256[] generateIds, bytes32[] merkleProof)',
  burnNFT = 'burnNFT(uint256[] tokenIds)',
  createNFTContract = 'createNFTContract(string _name, string _symbol, string _tokenBaseURI, uint256 _collectionId, address _mintTo, (bytes32,uint256,uint256,uint256,uint256) wlConfig)',
}

export enum DopamintEvent {
  NFTBurned = 'NFTBurned(address indexed from, uint256 indexed tokenId, uint256 refund, uint256 protocolFee, uint256 creatorFee)',
}
