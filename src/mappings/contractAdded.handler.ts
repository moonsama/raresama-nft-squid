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

export async function handleNewContract(
  // ctx: LogHandlerContext<Store>
  ctx:LogContext
): Promise<Contract> {
  // const { event, block } = ctx
  const { evmLog, store, transaction, block } = ctx;

  const event = evmLog as EvmLog;
  const contractAddress = evmLog.address.toLowerCase();
  console.log("contract address",contractAddress);
  const data =
    collectionFactory.events[
      'CollectionAdded(uint256,bytes32,address,uint256,string,string,uint8,string)'
    ].decode(event)
  const address = data.collectionAddress.toLowerCase()
  console.log("data",data);
  console.log("address collection",address);
  const contractAPI = new raresamaCollection.Contract(ctx, block, address)
  console.log("contractApi",contractAPI);

  const contract = new Contract({
    id: address,
    factoryId: data.id.toBigInt(),
    name:data.name,
    symbol:data.symbols,
    totalSupply: 0n,
    contractURI:data._contractURI,
    decimals:data._decimals,
    startBlock: ctx.block.height,
    contractURIUpdated: BigInt(block.timestamp),
    uniqueOwnersCount: 0,
  })
  contracts.addToUriUpdatedBuffer(contract)

  ctx.log.info(`Collection added - ${contract.id}`)
  contracts.save(contract)
  return contract;
}
