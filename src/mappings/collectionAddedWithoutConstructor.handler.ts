import { EvmLog, LogHandlerContext } from '@subsquid/evm-processor'
import { EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { fetchContractMetadata } from '../helpers/metadata.helper'
import { Contract } from '../model'
import { LogContext } from '../processor'
import * as collectionFactory from '../abi/FactoryV1'
// import * as collectionFactory from '../types/generated/collection-factory'
// import * as raresamaCollection from '../types/generated/raresama-collection'
import * as raresamaCollection from '../abi/CollectionV2'

import { contracts } from '../utils/entitiesManager'
import { CONTRACT_BLACKLIST, EXCLUDE_ADDRESS } from '../utils/config'

export async function handleCollectionAddedWithoutConstructor(
  // ctx: LogHandlerContext<Store>
  ctx: LogContext
): Promise<Contract | undefined> {
  // const { event, block } = ctx
  const { evmLog, store, transaction, block } = ctx;
  const topic = evmLog.topics[0];
  // const evmLog = ((event.args.log || event.args));

  const args = evmLog;
  // console.log("evmLog", evmLog);
  // console.log("transaction", transaction);
  // console.log("block", block);
  const event = evmLog as EvmLog;
  //console.log("contract address", contractAddress);
  const data = collectionFactory.events.CollectionAddedWithoutConstructor.decode(event)
  const address = data.collectionAddress.toLowerCase()

  if (EXCLUDE_ADDRESS.includes(address)) {
    return;
  }

  const contractAPI = new raresamaCollection.Contract(ctx, block, address)



  const [name, symbol, contractURI] = await Promise.all([
    contractAPI.name() ?? "",
    contractAPI.symbol() ?? "",
    contractAPI.contractURI() ?? "",
  ])

  let decimals = 0
  try {
    decimals = await contractAPI.decimals() ?? 0
  } catch (e) { }


  if (CONTRACT_BLACKLIST.includes(address.toLowerCase())) {
    ctx.log.info(`collectionAddedWithoutConstructor:: [BLACKLISTED] [NEW COLLECTION] name: ${name} symbol: ${symbol} contractURI: ${contractURI} decimals: ${decimals} contractAddress: ${address}`)
    return
  } else {
    ctx.log.info(`collectionAddedWithoutConstructor:: [NEW COLLECTION] name: ${name} symbol: ${symbol} contractURI: ${contractURI} decimals: ${decimals} contractAddress: ${address}`)

  }
  const contract = new Contract({
    id: address,
    factoryId: data.id.toBigInt(),
    name,
    symbol,
    totalSupply: 0n,
    contractURI,
    decimals,
    startBlock: ctx.block.height,

    contractURIUpdated: BigInt(block.timestamp),
    uniqueOwnersCount: 0,
  })
  contracts.addToUriUpdatedBuffer(contract)

  ctx.log.info(`Collection added - ${contract.id}`)
  contracts.save(contract)
  return contract;
}
