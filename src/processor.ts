import { Store, TypeormDatabase } from "@subsquid/typeorm-store";

// import {
//   EvmLogHandlerContext,
//   SubstrateBatchProcessor,
// } from '@subsquid/substrate-processor'
import {
  assertNotNull,
  EvmBatchProcessor,
  EvmBlock,
  EvmLog,
  LogHandlerContext,
} from "@subsquid/evm-processor";
import {
  handleContractUri,
  handleNewContract,
  handleTransfer,
  handleUri,
  handleUriAll,
} from "./mappings";
import { saveAll } from "./utils/entitiesManager";
import * as collectionFactory from "./types/generated/collection-factory";
import * as raresamaCollection from "./types/generated/raresama-collection";
import * as config from "./utils/config";
import { isKnownContract } from "./helpers";
import { updateAllMetadata } from "./helpers/metadata.helper";

const database = new TypeormDatabase();
const processor = new EvmBatchProcessor()
  .setBlockRange({ from: 0 })
  .setDataSource({
    chain: config.CHAIN_NODE,
    archive: "https://exosama.archive.subsquid.io/",
  })
  .addLog(config.FACTORY_ADDRESS, {
    filter: [
      [
        collectionFactory.events[
          "CollectionAdded(uint256,bytes32,address,uint256)"
        ].topic,
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
        raresamaCollection.events["Transfer(address,address,uint256)"].topic,
        raresamaCollection.events["URI(uint256)"].topic,
        raresamaCollection.events["URIAll()"].topic,
        raresamaCollection.events["ContractURI()"].topic,
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
          // block: block,
          // evmLog: item.evmLog,
          // transaction: undefined,
          block: block.header,
          ...item,
        });

        await updateAllMetadata({
          ...ctx,
          block: ctx.blocks[ctx.blocks.length - 1].header,
          ...item,
        });
      }
    }
  }
  // await updateAllMetadata({
  //   ...ctx,
  //   block: ctx.blocks[ctx.blocks.length - 1].header,
  //   evmLog: undefined,
  //   transaction: undefined
  // });
  // await updateAllMetadata({
  //   ...ctx,
  //   block: ctx.blocks[ctx.blocks.length - 1].header,
  //   evmLog: undefined,
  //   transaction: undefined
  // });
  await saveAll(ctx.store);
});

export type LogContext = LogHandlerContext<
  Store,
  {
    evmLog: { topics: true; data: true };
    transaction: { hash: true };
    // eventLogEvent:EvmLog
    // block: EvmBlock;
  }
>;

async function handleEvmLog(ctx: LogContext) {
  const { evmLog, store, transaction, block } = ctx;
  const event = evmLog as EvmLog;
  const contractAddress = evmLog.address.toLowerCase();
  const args = evmLog;
  if (
    contractAddress === config.FACTORY_ADDRESS &&
    args.topics[0] ===
      collectionFactory.events[
        "CollectionAdded(uint256,bytes32,address,uint256)"
      ].topic
  ) {
    await handleNewContract(ctx);
  } else if (
    await isKnownContract(ctx.store, contractAddress, ctx.block.height)
  )
    switch (args.topics[0]) {
      case raresamaCollection.events["Transfer(address,address,uint256)"].topic:
        await handleTransfer(ctx);
        break;
      case raresamaCollection.events["URI(uint256)"].topic:
        await handleUri(ctx);
        break;
      case raresamaCollection.events["URIAll()"].topic:
        await handleUriAll(ctx);
        break;
      case raresamaCollection.events["ContractURI()"].topic:
        await handleContractUri(ctx);
        break;
      default:
    }
}
