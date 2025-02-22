import { EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import assert from 'assert'
import { fetchContractMetadata } from '../helpers/metadata.helper'
import { Contract } from '../model'
import * as raresamaCollection from '../types/generated/raresama-collection'
import { contracts } from '../utils/entitiesManager'

export async function handleContractUri(
  ctx: EvmLogHandlerContext<Store>
): Promise<void> {
  const { event, store } = ctx
  const evmLog = event.args.log || event.args
  const address = (<string>evmLog.address).toLowerCase()

  const contract = await contracts.get(
    store,
    Contract,
    address,
    undefined,
    true
  )
  assert(contract)
  contracts.addToUriUpdatedBuffer(contract)

  ctx.log.info(`Collection URI will be updated - ${contract.id}`)
  contracts.save(contract)
}
