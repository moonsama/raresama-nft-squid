import { BatchContext } from "@subsquid/substrate-processor"
import { Store } from "@subsquid/typeorm-store"
import { Owner } from "../model"
import { owners } from "../utils/entitiesManager"

export async function getOrCreateOwner(ctx: BatchContext<Store, unknown> , id: string): Promise<Owner> {
    let owner = await owners.get(ctx.store,Owner,id)
    if (!owner) {
        owner = new Owner({
            id,
            balance: 0n
        })
    }
    owners.save(owner)
    return owner
}

