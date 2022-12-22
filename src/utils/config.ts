export const CHAIN_NODE =
  process.env.CHAIN_NODE || 'wss://rpc.exosama.com'

export const CONTRACT_API_BATCH_SIZE = 100
export const IPFS_API_BATCH_SIZE = 100
// export const FACTORY_ADDRESS =
//   process.env.FACTORY_ADDRESS ||
//   '0x76d156A8DaAF31a4E9Ded9a0DB975943898af2b3'.toLowerCase()
// export const FACTORY_ADDRESS =
//   process.env.FACTORY_ADDRESS ||
//   '0x89d3f6270EB5EA504f95379892fBBefC4d88405D'.toLowerCase()

// export const FACTORY_ADDRESS= process.env.FACTORY_ADDRESS || "0xc0eF9EcA902bdAf1c4978dFc680e12732f48A790".toLowerCase()
export const FACTORY_ADDRESS= process.env.FACTORY_ADDRESS || "0xd08b0cDD31bd5e1aD12bD7854DE0714E6afADf9e".toLowerCase()



export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TOKEN_RELATIONS = {
  metadata: true,
  contract: true,
  owner: true,
}

export const ContractNFT = {
  test1:"0x12F013b9E922d6Ab82393234217A37dCCBca6773"
}
