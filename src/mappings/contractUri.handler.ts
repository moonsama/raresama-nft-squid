import { Store } from '@subsquid/typeorm-store'
import assert from 'assert'
import { fetchContractMetadata } from '../helpers/metadata.helper'
import { Contract } from '../model'
import { LogContext } from '../processor'
// import * as raresamaCollection from '../types/generated/raresama-collection'
import * as raresamaCollection from '../abi/CollectionV2'
import { contracts } from '../utils/entitiesManager'

export async function handleContractUri(
  // ctx: LogHandlerContext<Store>
  ctx: LogContext

): Promise<void> {
  const { evmLog, store } = ctx
  // const evmLog = event.args.log || event.args
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
