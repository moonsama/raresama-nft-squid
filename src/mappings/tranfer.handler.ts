import {
  EvmLogEvent,
  SubstrateBlock,
  BatchContext,
} from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";
import assert from "assert";
import { Contract, Direction, Metadata, OwnerTransfer, Token, Transfer } from "../model";
import * as raresamaCollection from "../types/generated/raresama-collection";
import {
  contracts,
  ownerTransfers,
  tokens,
  transfers,
  metadatas
} from "../utils/entitiesManager";
import { getTokenId, getOrCreateOwner } from "../helpers";
import { NULL_ADDRESS, TOKEN_RELATIONS } from "../utils/config";
import { parseMetadata } from "../helpers/metadata.helper";

export async function handleTransfer(
  ctx: BatchContext<Store, unknown>,
  block: SubstrateBlock,
  event: EvmLogEvent
): Promise<void> {
  const evmLog = event.args;
  const address = evmLog.address.toLowerCase();
  const contractAPI = new raresamaCollection.Contract(ctx, block, address);
  const contractEntity = (await contracts.get(
    ctx.store,
    Contract,
    address,
    undefined,
    true
  )) as Contract;
  const data =
    raresamaCollection.events["Transfer(address,address,uint256)"].decode(
      evmLog
    );
  const owner =
    data.to === NULL_ADDRESS ? null : await getOrCreateOwner(ctx, data.to.toLowerCase());
  const nativeId = data.tokenId.toBigInt();
  const id = getTokenId(address, nativeId);

  let token = await tokens.get(ctx.store, Token, id, TOKEN_RELATIONS);
  if (!token) {
    assert(
      data.from === NULL_ADDRESS,
      `Contract's ${address} Token ${nativeId} transferred before mint`
    );

    const [tokenUri, compositeTokenUri] = await Promise.all([
      contractAPI.tokenURI(data.tokenId),
      contractAPI.compositeURI(data.tokenId),
    ]);

    token = new Token({
      id,
      numericId: nativeId,
      owner,
      tokenUri,
      compositeTokenUri,
      contract: contractEntity,
    });
    contractEntity.totalSupply += 1n;
  } else {
    token.owner = owner;
    if (!owner) contractEntity.totalSupply -= 1n;
  }
  contracts.save(contractEntity);
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  // ctx.log.info(`Total supply of contract ${contractEntity.id} equals ${contractEntity.totalSupply}`)
  
  if (token.tokenUri){
    let metadata = await metadatas.get(ctx.store,Metadata,token.tokenUri)
    if (!metadata) {
      metadata = await parseMetadata(ctx,token.tokenUri)
      if (metadata) metadatas.save(metadata)
      token.metadataUpdated = BigInt(block.timestamp)
    }
    token.metadata = metadata
  }
  tokens.save(token);
  
  const oldOwner =
    data.from === NULL_ADDRESS ? null : await getOrCreateOwner(ctx, data.from.toLowerCase());

  const transfer = new Transfer({
    id: event.id,
    token,
    from: oldOwner,
    to: owner,
    timestamp: BigInt(block.timestamp),
    block: block.height,
    transactionHash: event.evmTxHash,
  });

  transfers.save(transfer);

  const ownerTransfer = new OwnerTransfer({
    id: `${event.id}-to`,
    owner,
    transfer,
    direction: Direction.TO,
  });

  ownerTransfers.save(ownerTransfer);

  const oldOwnerTransfer = new OwnerTransfer({
    id: `${event.id}-from`,
    owner: oldOwner,
    transfer,
    direction: Direction.FROM,
  });

  ownerTransfers.save(oldOwnerTransfer);

  ctx.log.info(`Transfer of token ${id} processed`);
}
