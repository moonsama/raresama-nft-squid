export const CHAIN_NODE =
  process.env.CHAIN_NODE || 'wss://wss.api.moonbeam.network'
export const FACTORY_ADDRESS =
  process.env.FACTORY_ADDRESS ||
  '0x11cC2271F7072080139fe325FAD8cA9bEd9F2E63'.toLowerCase()
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TOKEN_RELATIONS = {
  metadata: true,
  contract: true,
  owner: true,
}
