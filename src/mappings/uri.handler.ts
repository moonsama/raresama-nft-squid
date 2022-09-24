import { EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import assert from 'assert'
import { getTokenId, updateTokenMetadata } from '../helpers'
import { Token } from '../model'
import * as raresamaCollection from '../types/generated/raresama-collection'
import { tokens } from '../utils/entitiesManager'

export async function handleUri(
  ctx: EvmLogHandlerContext<Store>
): Promise<void> {
  const { event, store } = ctx
  const evmLog = ((event.args.log || event.args));
  const address = (<string>evmLog.address).toLowerCase()
  const contractAPI = new raresamaCollection.Contract(ctx, address)
  const { tokenId } = raresamaCollection.events['URI(uint256)'].decode(evmLog)
  const tokenAddress = getTokenId(address, tokenId.toBigInt())
  const token = await tokens.get(store, Token, tokenAddress, undefined, true)
  assert(token)
  await updateTokenMetadata(ctx, token, contractAPI)
  ctx.log.info(`Token URI updated - ${token.id}`)
  tokens.save(token)
}
