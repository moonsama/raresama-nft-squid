import { BatchContext } from "@subsquid/substrate-processor"
import { Store } from "@subsquid/typeorm-store"
import { Token } from "../model"

export function getTokenId(contract: string,nativeId: BigInt): string {
    return `${contract}-${String(nativeId).padStart(9,'0')}`
}