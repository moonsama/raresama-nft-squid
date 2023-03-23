import { Store } from '@subsquid/typeorm-store'
import assert from 'assert'
import { fetchContractMetadata } from '../helpers/metadata.helper'
import { Contract } from '../model'
import { LogContext } from '../processor'
// import * as raresamaCollection from '../types/generated/raresama-collection'
import * as raresamaCollection from '../abi/CollectionV2'
import { contracts } from '../utils/entitiesManager'
import { ethers } from 'ethers'

export async function handleContractUri(
  // ctx: LogHandlerContext<Store>
  ctx: LogContext

): Promise<void> {
  const { evmLog, store } = ctx
  // const evmLog = event.args.log || event.args
  const address = (<string>evmLog.address).toLowerCase()
  console.log("Before get")
  let contract = await contracts.get(
    store,
    Contract,
    address,
    undefined,
    true
  )
  console.log("after get")

  if (!contract) {
    const { evmLog, store, transaction, block } = ctx;

    const contractAPI = new raresamaCollection.Contract(ctx, address)

    let lenCollection = await ctx.store.count(Contract)

    let decimals = 0
    try {
      decimals = await contractAPI.decimals() ?? 0
    } catch (e) { }
    contract = new Contract({
      id: address,
      factoryId: ethers.BigNumber.from(lenCollection).toBigInt(),
      name: await contractAPI.name(),
      symbol: await contractAPI.symbol(),
      totalSupply: 0n,
      contractURI: await contractAPI.contractURI(),
      decimals,
      startBlock: ctx.block.height,
      contractURIUpdated: BigInt(block.timestamp),
      uniqueOwnersCount: 0,
    });
  }
  contracts.addToUriUpdatedBuffer(contract)

  ctx.log.info(`Collection URI will be updated - ${contract.id}`)
  contracts.save(contract)
}
