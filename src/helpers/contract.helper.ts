import { Store } from '@subsquid/typeorm-store'
import { getAddress } from 'ethers/lib/utils'
import {contracts} from '../utils/entitiesManager'

export async function isKnownContract(db: Store, contractAddress: string): Promise<boolean> {
  return Boolean(await contracts.getByAddress(db,getAddress(contractAddress)))
}

