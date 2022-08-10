import * as ethers from "ethers";
import assert from "assert";

export const abi = new ethers.utils.Interface(getJsonAbi());

export interface Approval0Event {
  owner: string;
  approved: string;
  tokenId: ethers.BigNumber;
}

export interface ApprovalForAll0Event {
  owner: string;
  operator: string;
  approved: boolean;
}

export interface Lock0Event {
  supply: ethers.BigNumber;
}

export interface RoleAdminChanged0Event {
  role: string;
  previousAdminRole: string;
  newAdminRole: string;
}

export interface RoleGranted0Event {
  role: string;
  account: string;
  sender: string;
}

export interface RoleRevoked0Event {
  role: string;
  account: string;
  sender: string;
}

export interface SecondarySaleFee0Event {
  feeRecipient: string;
  feeValueBps: ethers.BigNumber;
}

export interface Transfer0Event {
  from: string;
  to: string;
  tokenId: ethers.BigNumber;
}

export interface EvmEvent {
  data: string;
  topics: string[];
}

export const events = {
  "Approval(address,address,uint256)":  {
    topic: abi.getEventTopic("Approval(address,address,uint256)"),
    decode(data: EvmEvent): Approval0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Approval(address,address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        owner: result[0],
        approved: result[1],
        tokenId: result[2],
      }
    }
  }
  ,
  "ApprovalForAll(address,address,bool)":  {
    topic: abi.getEventTopic("ApprovalForAll(address,address,bool)"),
    decode(data: EvmEvent): ApprovalForAll0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("ApprovalForAll(address,address,bool)"),
        data.data || "",
        data.topics
      );
      return  {
        owner: result[0],
        operator: result[1],
        approved: result[2],
      }
    }
  }
  ,
  "Lock(uint256)":  {
    topic: abi.getEventTopic("Lock(uint256)"),
    decode(data: EvmEvent): Lock0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Lock(uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        supply: result[0],
      }
    }
  }
  ,
  "RoleAdminChanged(bytes32,bytes32,bytes32)":  {
    topic: abi.getEventTopic("RoleAdminChanged(bytes32,bytes32,bytes32)"),
    decode(data: EvmEvent): RoleAdminChanged0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RoleAdminChanged(bytes32,bytes32,bytes32)"),
        data.data || "",
        data.topics
      );
      return  {
        role: result[0],
        previousAdminRole: result[1],
        newAdminRole: result[2],
      }
    }
  }
  ,
  "RoleGranted(bytes32,address,address)":  {
    topic: abi.getEventTopic("RoleGranted(bytes32,address,address)"),
    decode(data: EvmEvent): RoleGranted0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RoleGranted(bytes32,address,address)"),
        data.data || "",
        data.topics
      );
      return  {
        role: result[0],
        account: result[1],
        sender: result[2],
      }
    }
  }
  ,
  "RoleRevoked(bytes32,address,address)":  {
    topic: abi.getEventTopic("RoleRevoked(bytes32,address,address)"),
    decode(data: EvmEvent): RoleRevoked0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("RoleRevoked(bytes32,address,address)"),
        data.data || "",
        data.topics
      );
      return  {
        role: result[0],
        account: result[1],
        sender: result[2],
      }
    }
  }
  ,
  "SecondarySaleFee(address,uint256)":  {
    topic: abi.getEventTopic("SecondarySaleFee(address,uint256)"),
    decode(data: EvmEvent): SecondarySaleFee0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("SecondarySaleFee(address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        feeRecipient: result[0],
        feeValueBps: result[1],
      }
    }
  }
  ,
  "Transfer(address,address,uint256)":  {
    topic: abi.getEventTopic("Transfer(address,address,uint256)"),
    decode(data: EvmEvent): Transfer0Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Transfer(address,address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        from: result[0],
        to: result[1],
        tokenId: result[2],
      }
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

  private async call(name: string, args: any[]) : Promise<ReadonlyArray<any>> {
    const fragment = abi.getFunction(name)
    const data = abi.encodeFunctionData(fragment, args)
    const result = await this._chain.client.call('eth_call', [{to: this.address, data}, this.blockHeight])
    return abi.decodeFunctionResult(fragment, result)
  }

  async COMPOSITE_CREATOR_ROLE(): Promise<string> {
    const result = await this.call("COMPOSITE_CREATOR_ROLE", [])
    return result[0]
  }

  async DEFAULT_ADMIN_ROLE(): Promise<string> {
    const result = await this.call("DEFAULT_ADMIN_ROLE", [])
    return result[0]
  }

  async GOVERNANCE_ROLE(): Promise<string> {
    const result = await this.call("GOVERNANCE_ROLE", [])
    return result[0]
  }

  async MINTER_ROLE(): Promise<string> {
    const result = await this.call("MINTER_ROLE", [])
    return result[0]
  }

  async OPERATOR_ROLE(): Promise<string> {
    const result = await this.call("OPERATOR_ROLE", [])
    return result[0]
  }

  async balanceOf(owner: string): Promise<ethers.BigNumber> {
    const result = await this.call("balanceOf", [owner])
    return result[0]
  }

  async compositeURI(tokenId: ethers.BigNumber): Promise<string> {
    const result = await this.call("compositeURI", [tokenId])
    return result[0]
  }

  async contractURI(): Promise<string> {
    const result = await this.call("contractURI", [])
    return result[0]
  }

  async decimals(): Promise<number> {
    const result = await this.call("decimals", [])
    return result[0]
  }

  async defaultTokenURI(): Promise<string> {
    const result = await this.call("defaultTokenURI", [])
    return result[0]
  }

  async erc2665Handler(): Promise<string> {
    const result = await this.call("erc2665Handler", [])
    return result[0]
  }

  async exists(tokenId: ethers.BigNumber): Promise<boolean> {
    const result = await this.call("exists", [tokenId])
    return result[0]
  }

  async getApproved(tokenId: ethers.BigNumber): Promise<string> {
    const result = await this.call("getApproved", [tokenId])
    return result[0]
  }

  async getRoleAdmin(role: string): Promise<string> {
    const result = await this.call("getRoleAdmin", [role])
    return result[0]
  }

  async getRoleMember(role: string, index: ethers.BigNumber): Promise<string> {
    const result = await this.call("getRoleMember", [role, index])
    return result[0]
  }

  async getRoleMemberCount(role: string): Promise<ethers.BigNumber> {
    const result = await this.call("getRoleMemberCount", [role])
    return result[0]
  }
  
  async getTransferFee(_tokenId: ethers.BigNumber): Promise<ethers.BigNumber>
  async getTransferFee(_tokenId: ethers.BigNumber, _currencySymbol: string): Promise<ethers.BigNumber> 
  async getTransferFee(_tokenId: ethers.BigNumber, _currencySymbol?: string): Promise<ethers.BigNumber> {
    if (!_currencySymbol) {
      const result = await this.call("getTransferFee", [_tokenId])
      return result[0]
    }
    else {
      const result = await this.call("getTransferFee", [_tokenId, _currencySymbol])
      return result[0]
    }
  }

  async globalCompositeTokenURIBase(): Promise<string> {
    const result = await this.call("globalCompositeTokenURIBase", [])
    return result[0]
  }

  async hasRole(role: string, account: string): Promise<boolean> {
    const result = await this.call("hasRole", [role, account])
    return result[0]
  }

  async isApprovedForAll(_owner: string, _operator: string): Promise<boolean> {
    const result = await this.call("isApprovedForAll", [_owner, _operator])
    return result[0]
  }

  async isProxy(_address: string, _operator: string): Promise<boolean> {
    const result = await this.call("isProxy", [_address, _operator])
    return result[0]
  }

  async lockedForever(): Promise<boolean> {
    const result = await this.call("lockedForever", [])
    return result[0]
  }

  async name(): Promise<string> {
    const result = await this.call("name", [])
    return result[0]
  }

  async originalURI(tokenId: ethers.BigNumber): Promise<string> {
    const result = await this.call("originalURI", [tokenId])
    return result[0]
  }

  async ownerOf(tokenId: ethers.BigNumber): Promise<string> {
    const result = await this.call("ownerOf", [tokenId])
    return result[0]
  }

  async proxyRegistry(): Promise<string> {
    const result = await this.call("proxyRegistry", [])
    return result[0]
  }

  async royaltyInfo(param: ethers.BigNumber, _salePrice: ethers.BigNumber): Promise<{receiver: string,royaltyAmount: ethers.BigNumber}> {
    const result = await this.call("royaltyInfo", [param, _salePrice])
    return  {
      receiver: result[0],
      royaltyAmount: result[1],
    }
  }

  async secondarySaleFee(param: ethers.BigNumber): Promise<{res: string,res2: ethers.BigNumber}> {
    const result = await this.call("secondarySaleFee", [param])
    return  {
      res: result[0],
      res2: result[1],
    }
  }

  async supportsInterface(interfaceId: string): Promise<boolean> {
    const result = await this.call("supportsInterface", [interfaceId])
    return result[0]
  }

  async symbol(): Promise<string> {
    const result = await this.call("symbol", [])
    return result[0]
  }

  async tokenByIndex(index: ethers.BigNumber): Promise<ethers.BigNumber> {
    const result = await this.call("tokenByIndex", [index])
    return result[0]
  }

  async tokenOfOwnerByIndex(owner: string, index: ethers.BigNumber): Promise<ethers.BigNumber> {
    const result = await this.call("tokenOfOwnerByIndex", [owner, index])
    return result[0]
  }

  async tokenURI(tokenId: ethers.BigNumber): Promise<string> {
    const result = await this.call("tokenURI", [tokenId])
    return result[0]
  }

  async totalSupply(): Promise<ethers.BigNumber> {
    const result = await this.call("totalSupply", [])
    return result[0]
  }

  async transferListener(): Promise<string> {
    const result = await this.call("transferListener", [])
    return result[0]
  }

  async uri(tokenId: ethers.BigNumber): Promise<string> {
    const result = await this.call("uri", [tokenId])
    return result[0]
  }
}

function getJsonAbi(): any {
  return [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "minter",
          "type": "address"
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
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "supply",
          "type": "uint256"
        }
      ],
      "name": "Lock",
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
          "indexed": true,
          "internalType": "address",
          "name": "feeRecipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "feeValueBps",
          "type": "uint256"
        }
      ],
      "name": "SecondarySaleFee",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "COMPOSITE_CREATOR_ROLE",
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
      "name": "MINTER_ROLE",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "compositeURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "contractURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "defaultTokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "erc2665Handler",
      "outputs": [
        {
          "internalType": "contract IERC2665Handler",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
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
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
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
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getRoleMember",
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
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "role",
          "type": "bytes32"
        }
      ],
      "name": "getRoleMemberCount",
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
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "getTransferFee",
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
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_currencySymbol",
          "type": "string"
        }
      ],
      "name": "getTransferFee",
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
      "inputs": [],
      "name": "globalCompositeTokenURIBase",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
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
          "internalType": "address",
          "name": "_owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
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
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "isProxy",
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
      "name": "lock",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "lockedForever",
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
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_customTokenURI",
          "type": "string"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        }
      ],
      "name": "mintDefault",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "originalURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
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
      "name": "proxyRegistry",
      "outputs": [
        {
          "internalType": "contract ProxyRegistry",
          "name": "",
          "type": "address"
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
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_salePrice",
          "type": "uint256"
        }
      ],
      "name": "royaltyInfo",
      "outputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "royaltyAmount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "secondarySaleFee",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
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
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "contractURI",
          "type": "string"
        }
      ],
      "name": "setContractURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_customCompositeTokenURIBase",
          "type": "string"
        }
      ],
      "name": "setCustomCompositeTokenURIBase",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_customTokenURI",
          "type": "string"
        }
      ],
      "name": "setCustomTokenURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_defaultTokenURI",
          "type": "string"
        }
      ],
      "name": "setDefaultTokenURI",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_erc2665Handler",
          "type": "address"
        }
      ],
      "name": "setERC2665Handler",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_feeRecipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_feeValueBps",
          "type": "uint256"
        }
      ],
      "name": "setFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_globalCompositeTokenURIBase",
          "type": "string"
        }
      ],
      "name": "setGlobalCompositeTokenURIBase",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_proxyRegistryAddress",
          "type": "address"
        }
      ],
      "name": "setProxyRegistryAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_transferListener",
          "type": "address"
        }
      ],
      "name": "setTransferListener",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_useComposite",
          "type": "bool"
        }
      ],
      "name": "setUseCompositeTokenURI",
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
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenByIndex",
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
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
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
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
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
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "transferListener",
      "outputs": [
        {
          "internalType": "contract ITransferListener",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
}
