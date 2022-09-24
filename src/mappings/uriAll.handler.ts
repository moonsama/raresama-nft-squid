import { EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { tokens } from '../utils/entitiesManager'

export async function handleUriAll(
  ctx: EvmLogHandlerContext<Store>
): Promise<void> {
  const { event, store } = ctx
  const evmLog = event.args.log || event.args
  const address = (<string>evmLog.address).toLowerCase()
  const updatedTokens = await tokens.getAllContractTokens(store, address)

  for (const token of updatedTokens) {
    tokens.addToUriUpdatedBuffer(token)
  }
  ctx.log.info(`All tokens of the contract will be updated - ${address}`)

  updatedTokens.forEach((token) => {
    tokens.save(token)
  })
}
