import { Store } from '@subsquid/typeorm-store'
import { getAddress } from 'ethers/lib/utils'
import {contracts} from '../utils/entitiesManager'

export async function isKnownContract(db: Store, contractAddress: string, block: number): Promise<boolean> {
  const contract = await contracts.getByAddress(db,getAddress(contractAddress))
  return contract != null && contract.startBlock < block
}

