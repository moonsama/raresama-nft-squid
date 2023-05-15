export const CHAIN_NODE =
  process.env.CHAIN_NODE || 'wss://rpc.exosama.com'

export const CHAIN_RPC =
  process.env.CHAIN_RPC || 'https://rpc.exosama.com'

export const CONTRACT_API_BATCH_SIZE = 5
export const IPFS_API_BATCH_SIZE = 5
// export const FACTORY_ADDRESS =
//   process.env.FACTORY_ADDRESS ||
//   '0x76d156A8DaAF31a4E9Ded9a0DB975943898af2b3'.toLowerCase()
// export const FACTORY_ADDRESS =
//   process.env.FACTORY_ADDRESS ||
//   '0x89d3f6270EB5EA504f95379892fBBefC4d88405D'.toLowerCase()

// export const FACTORY_ADDRESS= process.env.FACTORY_ADDRESS || "0xc0eF9EcA902bdAf1c4978dFc680e12732f48A790".toLowerCase()
export const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS || "0xd08b0cDD31bd5e1aD12bD7854DE0714E6afADf9e".toLowerCase()
export const PODS_ADDRESS = process.env.PODS_ADDRESS || "0xaa821f830beff26626379d840621b92911ea53b7".toLowerCase();
export const PODS_HEIGHT = process.env.PODS_HEIGHT || 691012;

export const EXCLUDE_ADDRESS = [
  "0xea1d5002ff97f8b570c29f5f3f1b33deb4c2c406"
]
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TOKEN_RELATIONS = {
  metadata: true,
  contract: true,
  owner: true,
}

export const ContractNFT = {
  test1: "0x12F013b9E922d6Ab82393234217A37dCCBca6773",
  PODS: '0xaa821f830beff26626379d840621b92911ea53b7'
}

export const CONTRACTS_CREATED_OUTSIDE_FACTORY = [
  "0xaa821f830beff26626379d840621b92911ea53b7", // PODS
  "0x1aCB10DBD319DA52D941DFEC478f1aA2D118D7F7", // degenerousDAO
  "0x41a9c9dac4d16e5f6ed2b1bd1e8645a150f86186", // trippy trunks
  "0xe170B5B0D507B3E0ce3d51C043175E0A39f78B9F", // rareships
].map(c => c.toLowerCase())

export const CONTRACT_BLACKLIST = [
  "0x54350AdE8650Fe470993AF0e2bDb8B1197ffAB0B", // degenerousDAO first run not used
  "0xbc70b2da1fa3df3b8f22f5ae322e53564ec13245",
  "0xcf9e2a5440073c427fb916dd86dcd78e03ad907a", // trippy trunks contract created through governance
  "0xf5ef11ce8a66dc6791ccfbf5ee2d23f2f534cfff", // old rareships contract
].map(c => c.toLowerCase())

export const DISABLE_METADATA_FETCH = false