import * as ethers from "ethers";
import assert from "assert";

export const abi = new ethers.utils.Interface(getJsonAbi());

export type CollectionAdded0Event = ([id: ethers.BigNumber, template: string, collectionAddress: string, blockNumber: ethers.BigNumber] & {id: ethers.BigNumber, template: string, collectionAddress: string, blockNumber: ethers.BigNumber})

export type RoleAdminChanged0Event = ([role: string, previousAdminRole: string, newAdminRole: string] & {role: string, previousAdminRole: string, newAdminRole: string})

export type RoleGranted0Event = ([role: string, account: string, sender: string] & {role: string, account: string, sender: string})

export type RoleRevoked0Event = ([role: string, account: string, sender: string] & {role: string, account: string, sender: string})

export type TemplateRegistrySet0Event = ([newTemplateRegistry: string] & {newTemplateRegistry: string})

export interface EvmLog {
  data: string;
  topics: string[];
}

function decodeEvent(signature: string, data: EvmLog): any {
  return abi.decodeEventLog(
    abi.getEvent(signature),
    data.data || "",
    data.topics
  );
}

export const events = {
  "CollectionAdded(uint256,bytes32,address,uint256)": {
    topic: abi.getEventTopic("CollectionAdded(uint256,bytes32,address,uint256)"),
    decode(data: EvmLog): CollectionAdded0Event {
      return decodeEvent("CollectionAdded(uint256,bytes32,address,uint256)", data)
    }
  }
  ,
  "RoleAdminChanged(bytes32,bytes32,bytes32)": {
    topic: abi.getEventTopic("RoleAdminChanged(bytes32,bytes32,bytes32)"),
    decode(data: EvmLog): RoleAdminChanged0Event {
      return decodeEvent("RoleAdminChanged(bytes32,bytes32,bytes32)", data)
    }
  }
  ,
  "RoleGranted(bytes32,address,address)": {
    topic: abi.getEventTopic("RoleGranted(bytes32,address,address)"),
    decode(data: EvmLog): RoleGranted0Event {
      return decodeEvent("RoleGranted(bytes32,address,address)", data)
    }
  }
  ,
  "RoleRevoked(bytes32,address,address)": {
    topic: abi.getEventTopic("RoleRevoked(bytes32,address,address)"),
    decode(data: EvmLog): RoleRevoked0Event {
      return decodeEvent("RoleRevoked(bytes32,address,address)", data)
    }
  }
  ,
  "TemplateRegistrySet(address)": {
    topic: abi.getEventTopic("TemplateRegistrySet(address)"),
    decode(data: EvmLog): TemplateRegistrySet0Event {
      return decodeEvent("TemplateRegistrySet(address)", data)
    }
  }
  ,
}

export type AddManual0Function = ([_templateTag: string, _collection: string, _indexFromBlockNumber: ethers.BigNumber] & {_templateTag: string, _collection: string, _indexFromBlockNumber: ethers.BigNumber})

export type Batch0Function = ([calls: string, revertOnFail: boolean] & {calls: string, revertOnFail: boolean})

export type Create0Function = ([_templateTag: string, addresses: Array<string>, name: string, symbol: string, _decimals: number, _contractURI: string, _defaultTokenURI: string, _proxyRegistryAddress: string] & {_templateTag: string, addresses: Array<string>, name: string, symbol: string, _decimals: number, _contractURI: string, _defaultTokenURI: string, _proxyRegistryAddress: string})

export type CreateNonInit0Function = ([_templateTag: string] & {_templateTag: string})

export type GrantRole0Function = ([role: string, account: string] & {role: string, account: string})

export type RenounceRole0Function = ([role: string, account: string] & {role: string, account: string})

export type RevokeRole0Function = ([role: string, account: string] & {role: string, account: string})

export type SetTemplateRegistry0Function = ([_templateRegistry: string] & {_templateRegistry: string})


function decodeFunction(data: string): any {
  return abi.decodeFunctionData(data.slice(0, 10), data)
}

export const functions = {
  "addManual(bytes32,address,uint256)": {
    sighash: abi.getSighash("addManual(bytes32,address,uint256)"),
    decode(input: string): AddManual0Function {
      return decodeFunction(input)
    }
  }
  ,
  "batch(bytes[],bool)": {
    sighash: abi.getSighash("batch(bytes[],bool)"),
    decode(input: string): Batch0Function {
      return decodeFunction(input)
    }
  }
  ,
  "create(bytes32,address[5],string,string,uint8,string,string,address)": {
    sighash: abi.getSighash("create(bytes32,address[5],string,string,uint8,string,string,address)"),
    decode(input: string): Create0Function {
      return decodeFunction(input)
    }
  }
  ,
  "createNonInit(bytes32)": {
    sighash: abi.getSighash("createNonInit(bytes32)"),
    decode(input: string): CreateNonInit0Function {
      return decodeFunction(input)
    }
  }
  ,
  "grantRole(bytes32,address)": {
    sighash: abi.getSighash("grantRole(bytes32,address)"),
    decode(input: string): GrantRole0Function {
      return decodeFunction(input)
    }
  }
  ,
  "renounceRole(bytes32,address)": {
    sighash: abi.getSighash("renounceRole(bytes32,address)"),
    decode(input: string): RenounceRole0Function {
      return decodeFunction(input)
    }
  }
  ,
  "revokeRole(bytes32,address)": {
    sighash: abi.getSighash("revokeRole(bytes32,address)"),
    decode(input: string): RevokeRole0Function {
      return decodeFunction(input)
    }
  }
  ,
  "setTemplateRegistry(address)": {
    sighash: abi.getSighash("setTemplateRegistry(address)"),
    decode(input: string): SetTemplateRegistry0Function {
      return decodeFunction(input)
    }
  }
  ,
}

interface ChainContext  {
  _chain: Chain
}

interface BlockContext  {
  _chain: Chain
  block: Block
}

interface Block  {
  height: number
}

interface Chain  {
  client:  {
    call: <T=any>(method: string, params?: unknown[]) => Promise<T>
  }
}

export class Contract  {
  private readonly _chain: Chain
  private readonly blockHeight: number
  readonly address: string

  constructor(ctx: BlockContext, address: string)
  constructor(ctx: ChainContext, block: Block, address: string)
  constructor(ctx: BlockContext, blockOrAddress: Block | string, address?: string) {
    this._chain = ctx._chain
    if (typeof blockOrAddress === 'string')  {
      this.blockHeight = ctx.block.height
      this.address = ethers.utils.getAddress(blockOrAddress)
    }
    else  {
      assert(address != null)
      this.blockHeight = blockOrAddress.height
      this.address = ethers.utils.getAddress(address)
    }
  }

  async DEFAULT_ADMIN_ROLE(): Promise<string> {
    return this.call("DEFAULT_ADMIN_ROLE", [])
  }

  async GOVERNANCE_ROLE(): Promise<string> {
    return this.call("GOVERNANCE_ROLE", [])
  }

  async OPERATOR_ROLE(): Promise<string> {
    return this.call("OPERATOR_ROLE", [])
  }

  async TEMPLATE_TAG_ERC1155(): Promise<string> {
    return this.call("TEMPLATE_TAG_ERC1155", [])
  }

  async TEMPLATE_TAG_ERC721(): Promise<string> {
    return this.call("TEMPLATE_TAG_ERC721", [])
  }

  async VERSION(): Promise<ethers.BigNumber> {
    return this.call("VERSION", [])
  }

  async exists(_id: ethers.BigNumber): Promise<boolean> {
    return this.call("exists", [_id])
  }

  async getCollection(_id: ethers.BigNumber): Promise<string> {
    return this.call("getCollection", [_id])
  }

  async getCollections(): Promise<Array<string>> {
    return this.call("getCollections", [])
  }

  async getLastCollection(): Promise<string> {
    return this.call("getLastCollection", [])
  }

  async getLastCollectionId(): Promise<ethers.BigNumber> {
    return this.call("getLastCollectionId", [])
  }

  async getRoleAdmin(role: string): Promise<string> {
    return this.call("getRoleAdmin", [role])
  }

  async hasRole(role: string, account: string): Promise<boolean> {
    return this.call("hasRole", [role, account])
  }

  async supportsInterface(interfaceId: string): Promise<boolean> {
    return this.call("supportsInterface", [interfaceId])
  }

  async templateRegistry(): Promise<string> {
    return this.call("templateRegistry", [])
  }

  async totalSupply(): Promise<ethers.BigNumber> {
    return this.call("totalSupply", [])
  }

  private async call(name: string, args: any[]) : Promise<any> {
    const fragment = abi.getFunction(name)
    const data = abi.encodeFunctionData(fragment, args)
    const result = await this._chain.client.call('eth_call', [{to: this.address, data}, this.blockHeight])
    const decoded = abi.decodeFunctionResult(fragment, result)
    return decoded.length > 1 ? decoded : decoded[0]
  }
}

function getJsonAbi(): any {
  return [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_templateRegistry",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "governor",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "template",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collectionAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "blockNumber",
          "type": "uint256"
        }
      ],
      "name": "CollectionAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "previousAdminRole",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "newAdminRole",
          "type": "bytes32"
        }
      ],
      "name": "RoleAdminChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleGranted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "RoleRevoked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "newTemplateRegistry",
          "type": "address"
        }
      ],
      "name": "TemplateRegistrySet",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "DEFAULT_ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "GOVERNANCE_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "OPERATOR_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TEMPLATE_TAG_ERC1155",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TEMPLATE_TAG_ERC721",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "VERSION",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_templateTag",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_collection",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_indexFromBlockNumber",
          "type": "uint256"
        }
      ],
      "name": "addManual",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes[]",
          "name": "calls",
          "type": "bytes[]"
        },
        {
          "internalType": "bool",
          "name": "revertOnFail",
          "type": "bool"
        }
      ],
      "name": "batch",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_templateTag",
          "type": "bytes32"
        },
        {
          "internalType": "address[5]",
          "name": "addresses",
          "type": "address[5]"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "internalType": "uint8",
          "name": "_decimals",
          "type": "uint8"
        },
        {
          "internalType": "string",
          "name": "_contractURI",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_defaultTokenURI",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "_proxyRegistryAddress",
          "type": "address"
        }
      ],
      "name": "create",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_templateTag",
          "type": "bytes32"
        }
      ],
      "name": "createNonInit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "exists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getCollection",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCollections",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLastCollection",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLastCollectionId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleAdmin",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "grantRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "hasRole",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "renounceRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "revokeRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_templateRegistry",
          "type": "address"
        }
      ],
      "name": "setTemplateRegistry",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "templateRegistry",
      "outputs": [
        {
          "internalType": "contract TemplateRegistry",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}
