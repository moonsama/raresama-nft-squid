import https from 'https'
import Axios from 'axios'
import assert from 'assert'
import { BigNumber, ethers } from 'ethers'
import { Attribute, Contract, Metadata, Token } from '../model'
import { IRawMetadata } from '../types/custom/metadata'
import {
  contracts,
  EntitiesCache,
  EntityWithId,
  metadatas,
  tokens,
} from '../utils/entitiesManager'
// import * as raresamaCollection from '../types/generated/raresama-collection'
import * as raresamaCollection from '../abi/CollectionV2'
import ABI_COLLECTION from '../abi/CollectionV2.json'
import { CONTRACT_API_BATCH_SIZE, IPFS_API_BATCH_SIZE } from '../utils/config'
import { LogContext, LogContextWithoutItem } from '../processor';
import { BlockHandlerContext, CommonHandlerContext, EvmBlock } from '@subsquid/evm-processor'
import { Store } from '@subsquid/typeorm-store'
import { getUrlContentType } from '../utils/media'


export const BASE_URL = 'https://moonsama.mypinata.cloud/'

export const api = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 5000,
  httpsAgent: new https.Agent({ keepAlive: true }),
})

const urlBlackList = new Map<string, number>()
const BLACKLIST_TRIES_TRASHOLD = 5
const isUrlBanned = (url: string) => {
  const tries = urlBlackList.get(url)
  if (!tries) return false
  return tries > BLACKLIST_TRIES_TRASHOLD
}
const addFailedFetch = (url: string) => {
  let tries = urlBlackList.get(url)
  if (!tries) tries = 1
  else tries += 1
  urlBlackList.set(url, tries)
  return tries
}

export const sanitizeIpfsUrl = (ipfsUrl: string): string => {
  const reg1 = /^ipfs:\/\/ipfs/
  if (reg1.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', BASE_URL)
  }

  const reg2 = /^ipfs:\/\//
  if (reg2.test(ipfsUrl)) {
    return ipfsUrl.replace('ipfs://', `${BASE_URL}ipfs/`)
  }

  return ipfsUrl
}

export const fetchMetadata = async (
  // ctx: CommonHandlerContext<Store>,
  ctx: LogContext,
  url: string
): Promise<IRawMetadata | null> => {
  const properUrl = sanitizeIpfsUrl(url)
  if (isUrlBanned(properUrl)) {
    ctx.log.warn(`[IPFS] SKIP DUE TO TRIES LIMIT ${properUrl}`)
    return null
  }
  try {
    const { status, data } = await api.get(sanitizeIpfsUrl(properUrl))
    ctx.log.info(`[IPFS] ${status} ${properUrl}`)
    if (status < 400) {
      return data as IRawMetadata
    }
  } catch (e) {
    const tries = addFailedFetch(properUrl)
    ctx.log.warn(
      `[IPFS] ERROR ${properUrl} ${tries} TRY ${(e as Error).message}`
    )
  }
  return null
}

export async function parseMetadata(
  // ctx: CommonHandlerContext<Store>,
  ctx: LogContext,
  url: string
): Promise<Metadata | undefined> {
  const rawMeta = await fetchMetadata(ctx, url)
  if (!rawMeta) return undefined
  const metadata = new Metadata({
    id: url,
    name: rawMeta.name,
    description: rawMeta.description,
    image: rawMeta.image,
    externalUrl: rawMeta.external_url,
    layers: rawMeta.layers,
    artist: rawMeta.artist,
    artistUrl: rawMeta.artist_url,
    composite: Boolean(rawMeta.composite),
    type: rawMeta.type,
  })
  if (rawMeta.attributes) {
    const attributes: Attribute[] = rawMeta.attributes.map(
      (attr) =>
        new Attribute({
          displayType: attr.display_type
            ? String(attr.display_type)
            : attr.display_type,
          traitType: String(attr.trait_type),
          value: String(attr.value),
        })
    )
    metadata.attributes = attributes
  }
  // ctx.log.info(attributes)
  // ctx.log.info(metadata)
  if(rawMeta.image) {
    const {contentType, contentLength} = await getUrlContentType(sanitizeIpfsUrl(rawMeta.image))
    console.log("contentType",contentType)
    console.log("contentLength",contentLength)
    metadata.contentType=contentType;
    metadata.contentLength=contentLength;
  }
  return metadata
}

interface ContractMetadata {
  name: string
  description: string
  image: string
  externalLink: string
  artist?: string
  artistUrl?: string
  contentType?:string,
  contentLength?:string | null,
}

export const fetchContractMetadata = async (
  // ctx: CommonHandlerContext<Store>,
  ctx:LogContext,
  url: string
): Promise<ContractMetadata | undefined> => {
  const properUrl = sanitizeIpfsUrl(url)
  if (isUrlBanned(properUrl)) {
    ctx.log.warn(`[IPFS] SKIP DUE TO TRIES LIMIT ${properUrl}`)
    return undefined
  }
  try {
    const { status, data } = await api.get(sanitizeIpfsUrl(properUrl))
    ctx.log.info(`[IPFS] ${status} ${properUrl}`)
    if (status < 400) {
      return {
        name: data.name,
        description: data.description,
        image: data.image,
        externalLink: data.external_link,
        artist: data.artist,
        artistUrl: data.artist_url,
      }
    }
  } catch (e) {
    const tries = addFailedFetch(properUrl)
    ctx.log.warn(
      `[IPFS] ERROR ${properUrl} ${tries} TRY ${(e as Error).message}`
    )
  }
  return undefined
}

export async function batchEntityMapper<T extends EntityWithId>(
  // ctx: CommonHandlerContext<Store>,
  ctx: LogContext,
  manager: EntitiesCache<T>,
  buffer_: Array<T>,
  updater: (
    // ctx: CommonHandlerContext<Store>,
    ctx: LogContext,
    entity: T,
    manager: EntitiesCache<T>
  ) => Promise<void>,
  batchSize: number
): Promise<void> {
  for (let i = 0; i < buffer_.length; i += batchSize) {
    await Promise.all(
      buffer_.slice(i, i + batchSize).map(async (entity) => {
        await updater(ctx, entity, manager)
      })
    )
  }
}

function updateFailedEntity(
  // ctx: CommonHandlerContext<Store>,
  ctx:LogContext,
  // ctx:LogContextWithoutItem,
  manager: EntitiesCache<EntityWithId>
) {
  manager.getBuffer().forEach((entity) => {
    if (manager.hasToUpdate(entity)) manager.addToUriUpdatedBuffer(entity)
  })
}

async function getContractUri(
  // ctx: CommonHandlerContext<Store>,
  ctx: LogContext,
  entity: Contract
): Promise<void> {
  console.log("getContractURI of : ", entity.id)
  try{
    const contractAPI = new ethers.Contract(entity.id, ABI_COLLECTION, new ethers.providers.JsonRpcProvider(process.env.CHAIN_RPC ?? "https://rpc.exosama.com"));
    const contractURI = await contractAPI.contractURI()
    console.log("contractURI",contractURI)
    entity.contractURI = contractURI
    entity.contractURIUpdated = BigInt(ctx.block.timestamp)
  }catch(e){
    console.log(`error : ${e}`)
    entity.contractURI = "ipfs://QmdgzLkcVuNcHar3jBYqYNrgh42giyc6n8skaesTRjZQhr"
    entity.contractURIUpdated = BigInt(ctx.block.timestamp)
  }
 
}

export async function getTokenUri(
  // ctx: CommonHandlerContext<Store>,
  ctx: LogContext,
  // ctx:LogContextWithoutItem,
  entity: Token
): Promise<void> {
  console.log("getTokenURI")
  const contractAPI = new ethers.Contract(entity.contract.id, ABI_COLLECTION, new ethers.providers.JsonRpcProvider(process.env.CHAIN_RPC ?? "https://rpc.exosama.com"));
  // const contractAPI = new raresamaCollection.Contract(ctx, entity.contract.id)
  try {
    const tokenURI = await contractAPI.tokenURI(ethers.BigNumber.from(entity.numericId.toString()))
    console.log("tokenURI",tokenURI)
    entity.tokenUri = tokenURI
  } catch (error) {
    // Token uri doesn't exits or token burned => use default token uri
    entity.tokenUri = "ipfs://QmdgzLkcVuNcHar3jBYqYNrgh42giyc6n8skaesTRjZQhr"
    // tokens.delFromUriUpdatedBuffer(entity); // Not need to be delete
  }
  entity.updatedAt = BigInt(ctx.block.timestamp)
}

export async function fillTokenMetadata<T extends Token>(
  // ctx: CommonHandlerContext<Store>,
  ctx: LogContext,
  entity: T,
  manager: EntitiesCache<T>
): Promise<void> {
  assert(
    entity.tokenUri,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    `Tried to update metadata of ${entity} with null tokenURI`
  )
  const meta =
    (await metadatas.get(ctx.store, Metadata, entity.tokenUri)) ??
    (await parseMetadata(ctx, entity.tokenUri))
  if (meta) {
    metadatas.save(meta)
    entity.metadata = meta
    manager.save(entity)
    manager.delFromUriUpdatedBuffer(entity)
    ctx.log.info(`Metadata updated for token - ${entity.id}`)
  }
}
async function fillContractMetadata<T extends Contract>(
  // ctx: CommonHandlerContext<Store>,
  ctx:LogContext,
  entity: T,
  manager: EntitiesCache<T>
): Promise<void> {
  assert(entity.contractURI)
  const rawMetadata = await fetchContractMetadata(ctx, entity.contractURI)
  if (rawMetadata) {
    entity.metadataName = rawMetadata.name
    entity.artist = rawMetadata.artist
    entity.artistUrl = rawMetadata.artistUrl
    entity.externalLink = rawMetadata.externalLink
    entity.description = rawMetadata.description
    entity.image = rawMetadata.image
    manager.save(entity)
    manager.delFromUriUpdatedBuffer(entity)
    ctx.log.info(`Metadata updated for contract - ${entity.id}`)
  }
}

export async function updateAllMetadata(
  ctx:any,
  block?:EvmBlock
): Promise<void> {
  updateFailedEntity(ctx, contracts)
  updateFailedEntity(ctx, tokens)

  await batchEntityMapper(
    ctx,
    contracts,
    contracts.getUriUpdateBuffer(),
    getContractUri,
    CONTRACT_API_BATCH_SIZE
  )
  await Promise.all([
    batchEntityMapper(
      ctx,
      contracts,
      contracts.getUriUpdateBuffer(),
      fillContractMetadata,
      IPFS_API_BATCH_SIZE
    ),
    batchEntityMapper(
      ctx,
      tokens,
      tokens.getUriUpdateBuffer(),
      getTokenUri,
      CONTRACT_API_BATCH_SIZE
    ),
  ])

  await batchEntityMapper(
    ctx,
    tokens,
    tokens.getUriUpdateBuffer(),
    fillTokenMetadata,
    IPFS_API_BATCH_SIZE
  )
}
