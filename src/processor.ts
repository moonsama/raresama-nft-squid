import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import {
  BatchContext,
  EvmLogEvent,
  SubstrateBatchProcessor,
  SubstrateBlock,
} from "@subsquid/substrate-processor"
import {handleNewContract, handleTransfer} from "./mappings"
import { saveAll } from "./utils/entitiesManager"
import * as collectionFactory from "./types/generated/collection-factory"
import * as raresamaCollection from "./types/generated/raresama-collection"
import * as config from "./utils/config"
import { isKnownContract } from "./helpers"

const database = new TypeormDatabase()
const processor = new SubstrateBatchProcessor()
    .setBatchSize(100)
    .setBlockRange({ from: 2385792 }) 
    .setDataSource({
        chain: config.CHAIN_NODE,
        archive: 'https://moonriver.archive.subsquid.io/graphql',
    })
    .setTypesBundle('moonriver')
    .addEvmLog(config.FACTORY_ADDRESS, {
        filter: [collectionFactory.events['CollectionAdded(uint256,bytes32,address,uint256)'].topic],
    })

processor.addEvmLog('*', {
    filter: [raresamaCollection.events['Transfer(address,address,uint256)'].topic],
})

processor.run(database, async (ctx) => {
    for (const block of ctx.blocks) {
        for (const item of block.items) {
            if (item.kind === 'event') {
                if (item.name === 'EVM.Log') {
                    await handleEvmLog(ctx, block.header, item.event)
                }
            }
        }
    }
    await saveAll(ctx.store)
})

async function handleEvmLog(ctx: BatchContext<Store, unknown>, block: SubstrateBlock, event: EvmLogEvent) {
  const contractAddress = event.args.address
  if (contractAddress === config.FACTORY_ADDRESS 
    && event.args.topics[0] === collectionFactory.events["CollectionAdded(uint256,bytes32,address,uint256)"].topic) {
      await handleNewContract(ctx, block, event)
  } 
  else if (await isKnownContract(ctx.store, contractAddress, block.height)
    && event.args.topics[0] === raresamaCollection.events["Transfer(address,address,uint256)"].topic) {
      await handleTransfer(ctx, block, event)
  }
}

