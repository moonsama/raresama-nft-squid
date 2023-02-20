import { EvmLogHandlerContext } from '@subsquid/substrate-processor'
import { Store } from '@subsquid/typeorm-store'
import assert from 'assert'
import { Contract, Direction, OwnerTransfer, Token, Transfer } from '../model'
// import * as raresamaCollection from '../types/generated/raresama-collection'
import * as raresamaCollection from '../abi/CollectionV2'
import {
  contracts,
  ownerTransfers,
  tokens,
  transfers,
} from '../utils/entitiesManager'
import {
  getTokenId,
  getOrCreateOwner,
  findCollectionStat,
  updateTokenMetadata,
} from '../helpers'
import { FACTORY_ADDRESS, NULL_ADDRESS, TOKEN_RELATIONS } from '../utils/config'
import { CommonHandlerContext, LogHandlerContext } from '@subsquid/evm-processor'
import { LogContext } from '../processor'
import { BigNumber, ethers } from 'ethers'

export async function handleTransfer(
  // ctx: LogHandlerContext<Store>
  ctx: LogContext
): Promise<void> {
  // const { event, block } = ctx
  const { evmLog, store, transaction, block } = ctx;
  const topic = evmLog.topics[0];
  // const evmLog = ((event.args.log || event.args));

  const args = evmLog;
  const address = evmLog.address.toLowerCase() as string
  const contractAPI = new raresamaCollection.Contract(ctx, address)
  let contractEntity = (await contracts.get(
    ctx.store,
    Contract,
    address,
    undefined,
    false
  )) as Contract
  if (!contractEntity) {
    let lenCollection = await ctx.store.count(Contract)
    contractEntity = new Contract({
      id: address,
      factoryId: ethers.BigNumber.from(lenCollection).toBigInt(),
      name: await contractAPI.name(),
      symbol: await contractAPI.symbol(),
      totalSupply: 0n,
      contractURI: await contractAPI.contractURI(),
      decimals: await contractAPI.decimals(),
      startBlock: ctx.block.height,
      contractURIUpdated: BigInt(block.timestamp),
      uniqueOwnersCount: 0,
    });
    contracts.addToUriUpdatedBuffer(contractEntity)
    contracts.save(contractEntity);
  }

  const data =
    raresamaCollection.events.Transfer.decode(
      evmLog
    )
  const oldOwner =
    data.from === NULL_ADDRESS
      ? null
      : await getOrCreateOwner(ctx.store, data.from.toLowerCase())
  const owner =
    data.to === NULL_ADDRESS
      ? null
      : await getOrCreateOwner(ctx.store, data.to.toLowerCase())
  const nativeId = data.tokenId.toBigInt()
  const id = getTokenId(address, nativeId)

  let token = await tokens.get(ctx.store, Token, id, TOKEN_RELATIONS)
  if (!token) {
    // check if token is minting
    assert(
      data.from === NULL_ADDRESS,
      `Contract's ${address} Token ${nativeId} transferred before mint`
    )

    token = new Token({
      id,
      numericId: nativeId,
      owner,
      contract: contractEntity,
      updatedAt: BigInt(block.timestamp),
      createdAt: BigInt(block.timestamp),
    })
    // Parse meta if possible
    tokens.addToUriUpdatedBuffer(token)

    contractEntity.totalSupply += 1n
  } else {
    // Update old owner stats (only if not minting)
    if (oldOwner) {
      const collsStats = oldOwner.totalCollectionNfts
      // const collStat = findCollectionStat(collsStats, address, false)
      const collStat = findCollectionStat(collsStats, address, true)

      collStat.amount -= 1
      if (!collStat.amount) {
        // Remove from the array
        contractEntity.uniqueOwnersCount -= 1
        collsStats.splice(collsStats.indexOf(collStat), 1)
      }
    }
    // Token is burned
    token.owner = owner
    if (!owner) contractEntity.totalSupply -= 1n
  }
  // Update current owner stats if not burning
  if (owner) {
    const collsStats = owner.totalCollectionNfts
    const collStat = findCollectionStat(collsStats, address, true)
    collStat.amount += 1
    if (collStat.amount === 1) contractEntity.uniqueOwnersCount += 1
  }
  contracts.save(contractEntity)
  tokens.save(token)

  const transfer = new Transfer({
    // id: event.id, //Event id, in the form <blockNumber>-<index>
    id: evmLog.id, //Event id, in the form <blockNumber>-<index>
    token,
    from: oldOwner,
    to: owner,
    timestamp: BigInt(block.timestamp),
    block: block.height,
    // transactionHash: event.evmTxHash,
    transactionHash: block.transactionsRoot
  })

  transfers.save(transfer)

  const ownerTransfer = new OwnerTransfer({
    id: `${evmLog.id}-to`,
    owner,
    transfer,
    direction: Direction.TO,
  })

  ownerTransfers.save(ownerTransfer)

  const oldOwnerTransfer = new OwnerTransfer({
    // id: `${event.id}-from`,
    id: `${evmLog.id}-from`,
    owner: oldOwner,
    transfer,
    direction: Direction.FROM,
  })

  ownerTransfers.save(oldOwnerTransfer)

  ctx.log.info(`Transfer of token ${id} processed`)
}
