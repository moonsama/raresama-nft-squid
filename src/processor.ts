import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

// import {
//   EvmLogHandlerContext,
//   SubstrateBatchProcessor,
// } from '@subsquid/substrate-processor'
import {
  assertNotNull,
  BatchHandlerContext,
  CommonHandlerContext,
  EvmBatchProcessor,
  EvmBlock,
  EvmLog,
  EvmTransaction,
  LogHandlerContext,
} from "@subsquid/evm-processor";
import {
  handleContractUri,
  handleCollectionAddedWithoutConstructor,
  handleCollectionAdded,
  handleTransfer,
  handleUri,
  handleUriAll,
} from "./mappings";
import { saveAll } from "./utils/entitiesManager";
// import * as collectionFactory from "./types/generated/collection-factory";
// import * as raresamaCollection from "./types/generated/raresama-collection";
import * as collectionFactory from "./abi/FactoryV1";
import * as raresamaCollection from "./abi/CollectionV2";
import * as raresamaCollectionV1 from "./abi/CollectionV1";
import * as config from "./utils/config";
import { isKnownContract, updateTokenMetadata } from "./helpers";
import { updateAllMetadata } from "./helpers/metadata.helper";
import { BlockHandlerContext } from "@subsquid/substrate-processor";
import { AddLogItem } from "@subsquid/evm-processor/lib/interfaces/dataSelection";

const database = new TypeormDatabase();
const processor = new EvmBatchProcessor()
  .setBlockRange({ from: 2099941 })
  .setDataSource({
    chain: config.CHAIN_NODE,
    archive: "https://exosama.archive.subsquid.io/",
  })
  .addLog(config.FACTORY_ADDRESS, {
    filter: [
      [
        collectionFactory.events.CollectionAdded.topic,
        collectionFactory.events.CollectionAddedWithoutConstructor.topic,
      ],
    ],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true,
      },
    },
  })
  .addLog(config.PODS_ADDRESS, {
    filter: [
      [
        raresamaCollection.events.Transfer.topic,
        raresamaCollection.events.URI.topic,
        raresamaCollection.events.URIAll.topic,
        raresamaCollection.events.ContractURI.topic,
      ],
    ],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true,
      },
    },
  })
  .addLog("*", {
    filter: [
      [
        raresamaCollection.events.Transfer.topic,
        raresamaCollection.events.URI.topic,
        raresamaCollection.events.URIAll.topic,
        raresamaCollection.events.ContractURI.topic,
      ],
    ],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true,
      },
    },
  });

processor.run(database, async (ctx) => {
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === "evmLog") {
        await handleEvmLog({
          ...ctx,
          block: block.header,
          ...item,
        });

        // await updateAllMetadata({
        //   ...ctx,
        //   // block: ctx.blocks[ctx.blocks.length - 1].header,
        //   evmLog: item.evmLog,
        //   transaction: item.transaction
        // });
      }
    }
    let lastBlock = ctx.blocks[ctx.blocks.length - 1].header
    await updateAllMetadata({
      ...ctx,
      block: lastBlock,
    }, lastBlock);


    await saveAll(ctx.store);
  }

});

export type LogContext = LogHandlerContext<
  Store,
  {
    evmLog: { topics: true; data: true };
    transaction: { hash: true };
    block: EvmBlock;
  }
>;

export type LogContextWithoutItem = BatchHandlerContext<Store, { blocks: EvmBlock[], block: EvmBlock }>

async function handleEvmLog(ctx: LogContext) {
  const { evmLog, store, transaction, block } = ctx;
  const event = evmLog as EvmLog;
  const contractAddress = evmLog.address.toLowerCase();
  const args = evmLog;

  if (contractAddress.toLowerCase() === config.PODS_ADDRESS.toLowerCase() && config.PODS_HEIGHT <= ctx.block.height) {
    switch (args.topics[0]) {
      case raresamaCollectionV1.events.Transfer.topic:
        await handleTransfer(ctx);
        break;
      default:
    }
  }

  // Get collections with the factory
  if (contractAddress === config.FACTORY_ADDRESS && collectionFactory.events.CollectionAdded.topic === args.topics[0]) {
    await handleCollectionAdded(ctx);
  } else if (contractAddress === config.FACTORY_ADDRESS && collectionFactory.events.CollectionAddedWithoutConstructor.topic === args.topics[0]) {
    await handleCollectionAddedWithoutConstructor(ctx);
  } else if (
    await isKnownContract(ctx.store, contractAddress, ctx.block.height)
  )
    switch (args.topics[0]) {
      case raresamaCollectionV1.events.Transfer.topic:
        await handleTransfer(ctx);
        break;
      case raresamaCollection.events.URI.topic:
        await handleUri(ctx);
        break;
      case raresamaCollection.events.URIAll.topic:
        await handleUriAll(ctx);
        break;
      case raresamaCollection.events.ContractURI.topic:
        await handleContractUri(ctx);
        break;
      default:
    }
}
