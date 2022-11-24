import { EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { LogContext } from '../processor'
import { tokens } from '../utils/entitiesManager'

export async function handleUriAll(
  ctx: LogContext
): Promise<void> {
  const { evmLog, store } = ctx
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
