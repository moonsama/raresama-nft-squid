export const CHAIN_NODE =
  process.env.CHAIN_NODE || 'wss://wss.api.moonbeam.network'
export const FACTORY_ADDRESS =
  process.env.FACTORY_ADDRESS ||
  '0xc53C410A5CBd4852235CF2d5AC054fCc438B73DF'.toLowerCase()
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TOKEN_RELATIONS = {
  metadata: true,
  contract: true,
  owner: true,
}
