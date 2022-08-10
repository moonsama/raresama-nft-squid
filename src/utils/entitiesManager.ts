import { Store, EntityClass } from "@subsquid/typeorm-store";
import { FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { TOKEN_RELATIONS } from "./config";
import {
  Contract,
  Transfer,
  Owner,
  Token,
  Metadata,
  OwnerTransfer,
} from "../model";

interface EntityWithId {
  id: string;
}

class EntitiesBuffer<Entity extends EntityWithId> {
  protected saveBuffer: Set<Entity> = new Set();

  save(entity: Entity): void {
    this.saveBuffer.add(entity);
  }

  async saveAll(db: Store): Promise<void> {
    await db.save([...this.saveBuffer]);
    this.saveBuffer.clear();
  }

}



class EntitiesCache<
  Entity extends EntityWithId
> extends EntitiesBuffer<Entity> {
  protected cache: Map<string, Entity> = new Map();

  protected addCache(entity: Entity): void {
    this.cache.set(entity.id, entity);
  }

  save(entity: Entity): void {
    this.saveBuffer.add(entity);
    this.addCache(entity);
  }

  async get(
    db: Store,
    entity: EntityClass<Entity>,
    id: string,
    relations?: FindOptionsRelations<Entity>,
    dieIfNull?: boolean
  ): Promise<Entity | undefined> {
    let item = this.cache.get(id);
    if (!item) {
      item = await db.get(entity, {
        where: { id } as FindOptionsWhere<Entity>,
        relations,
      });
    }
    if (item) {
      this.addCache(item);
    } else if (dieIfNull) {
      throw new Error("Not null assertion");
    }
    return item;
  }

  async saveAll(db: Store, clear?: boolean): Promise<void> {
    await db.save([...this.saveBuffer]);
    this.saveBuffer.clear();
    if (clear) {
      this.cache.clear();
    }
  }
}


// class TokensCache extends EntitiesCache<Token> {
//   private metadataQueue: Map<string,Token> = new Map();

//   async getWithOldMeta(db: Store, curTimestamp: BigInt): Promise<Array<Token>> {
//     dbTokens = await db.find(Token,  { 
//       where: {
//         metadataUpdated: {}
//       },
//       relations: TOKEN_RELATIONS
//     }
//       )
//   }
// }

class ContractsCache extends EntitiesCache<Contract> {
  protected addCache(entity: Contract): void {
    this.cache.set(entity.address, entity);
  }

  save(entity: Contract): void {
    this.saveBuffer.add(entity);
    this.addCache(entity);
  }

  get(): never {
    throw new Error("Use getByAddress for Contracts");
  }

  async getByAddress(
    db: Store,
    address: string,
    dieIfNull?: boolean
  ): Promise<Contract | undefined> {
    let item = this.cache.get(address);
    if (!item) {
      item = await db.get(Contract, {
        where: {
          address,
        },
      });
    }
    if (item) {
      this.addCache(item);
    } else if (dieIfNull) {
      throw new Error("Not null assertion");
    }
    return item;
  }
}

export const contracts = new ContractsCache();
export const transfers = new EntitiesBuffer<Transfer>();
export const ownerTransfers = new EntitiesBuffer<OwnerTransfer>();
export const owners = new EntitiesCache<Owner>();
export const tokens = new EntitiesCache<Token>();
export const metadatas = new EntitiesCache<Metadata>();


export async function saveAll(db: Store): Promise<void> {
  await contracts.saveAll(db);
  await metadatas.saveAll(db, true);
  await owners.saveAll(db, true);
  await tokens.saveAll(db, true);
  await transfers.saveAll(db);
  await ownerTransfers.saveAll(db);
}
