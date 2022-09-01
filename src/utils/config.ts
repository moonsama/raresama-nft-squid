export const CHAIN_NODE =
  process.env.CHAIN_NODE || 'wss://wss.api.moonbeam.network'
export const FACTORY_ADDRESS =
  process.env.FACTORY_ADDRESS ||
  '0x6Be3f97E53CE016f9ad16b8c3DEdf03ecC6A4ED7'.toLowerCase()
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TOKEN_RELATIONS = {
  metadata: true,
  contract: true,
  owner: true,
}
