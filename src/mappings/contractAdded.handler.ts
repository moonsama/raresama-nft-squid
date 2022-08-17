import {EvmLogEvent, SubstrateBlock, BatchContext, assertNotNull} from '@subsquid/substrate-processor'
import {Store} from '@subsquid/typeorm-store'
import {getAddress} from 'ethers/lib/utils'
import {fetchContractMetadata} from '../helpers/metadata.helper'
import {Contract} from '../model'
import * as collectionFactory from '../types/generated/collection-factory'
import * as raresamaCollection from '../types/generated/raresama-collection'
import {contracts} from '../utils/entitiesManager'

export async function handleNewContract(
    ctx: BatchContext<Store, unknown>,
    block: SubstrateBlock,
    event: EvmLogEvent
): Promise<void> {
    const evmLog = event.args
    const data = collectionFactory.events['CollectionAdded(uint256,bytes32,address,uint256)'].decode(evmLog)
    const address = getAddress(data.collectionAddress)

    const contractAPI = new raresamaCollection.Contract(ctx, block, address)

    const [name, symbol, contractURI, decimals] = await Promise.all([
        contractAPI.name(),
        contractAPI.symbol(),
        contractAPI.contractURI(),
        contractAPI.decimals()
    ])

    const {name: metadataName, ...metadata} = assertNotNull(await fetchContractMetadata(ctx, contractURI))

    const contract = new Contract({
        id: data.id.toString(),
        name,
        symbol,
        totalSupply: 0n,
        contractURI,
        address,
        decimals,
        startBlock: data.blockNumber.toNumber(),
        metadataName,
        ...metadata
    })

    ctx.log.info(`Collection added - ${address}`)
    contracts.save(contract)
}

