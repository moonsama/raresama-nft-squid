import { EvmLog, LogHandlerContext } from '@subsquid/evm-processor'
import { EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import { fetchContractMetadata } from '../helpers/metadata.helper'
import { Contract } from '../model'
import { LogContext } from '../processor'
import * as collectionFactory from '../types/generated/collection-factory'
import * as raresamaCollection from '../types/generated/raresama-collection'
import { contracts } from '../utils/entitiesManager'

export async function handleNewContract(
  // ctx: LogHandlerContext<Store>
  ctx:LogContext
): Promise<void> {
  // const { event, block } = ctx
  const { evmLog, store, transaction, block } = ctx;
  const topic = evmLog.topics[0];
  // const evmLog = ((event.args.log || event.args));

  const args = evmLog;
  // console.log("evmLog", evmLog);
  // console.log("transaction", transaction);
  // console.log("block", block);
  const event = evmLog as EvmLog;
  const contractAddress = evmLog.address.toLowerCase();
  const data =
    collectionFactory.events[
      'CollectionAdded(uint256,bytes32,address,uint256)'
    ].decode(evmLog)
  const address = data.collectionAddress.toLowerCase()

  const contractAPI = new raresamaCollection.Contract(ctx, block, address)

  const [name, symbol, contractURI, decimals] = await Promise.all([
    contractAPI.name(),
    contractAPI.symbol(),
    contractAPI.contractURI(),
    contractAPI.decimals(),
  ])

  const contract = new Contract({
    id: address,
    factoryId: data.id.toBigInt(),
    name,
    symbol,
    totalSupply: 0n,
    contractURI,
    decimals,
    startBlock: data.blockNumber.toNumber(),
    contractURIUpdated: BigInt(block.timestamp),
    uniqueOwnersCount: 0,
  })
  contracts.addToUriUpdatedBuffer(contract)

  ctx.log.info(`Collection added - ${contract.id}`)
  contracts.save(contract)
}
