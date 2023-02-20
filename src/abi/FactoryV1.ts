import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './FactoryV1.abi'

export const abi = new ethers.utils.Interface(ABI_JSON);

export const events = {
    CollectionAdded: new LogEvent<([id: ethers.BigNumber, template: string, collectionAddress: string, blockNumber: ethers.BigNumber, name: string, symbols: string, _decimals: number, _contractURI: string] & {id: ethers.BigNumber, template: string, collectionAddress: string, blockNumber: ethers.BigNumber, name: string, symbols: string, _decimals: number, _contractURI: string})>(
        abi, '0x875d8aa930bfd6ff486739ed8e86f474bb5fc8ecea45153ed67443ed133b0629'
    ),
    CollectionAddedWithoutConstructor: new LogEvent<([id: ethers.BigNumber, template: string, collectionAddress: string, blockNumber: ethers.BigNumber] & {id: ethers.BigNumber, template: string, collectionAddress: string, blockNumber: ethers.BigNumber})>(
        abi, '0xcbf40c79e9e9431bc2a6be508f68bd93b89ff5fce5a20f0d4ca8a44c3a4e42a8'
    ),
    RoleAdminChanged: new LogEvent<([role: string, previousAdminRole: string, newAdminRole: string] & {role: string, previousAdminRole: string, newAdminRole: string})>(
        abi, '0xbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff'
    ),
    RoleGranted: new LogEvent<([role: string, account: string, sender: string] & {role: string, account: string, sender: string})>(
        abi, '0x2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d'
    ),
    RoleRevoked: new LogEvent<([role: string, account: string, sender: string] & {role: string, account: string, sender: string})>(
        abi, '0xf6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b'
    ),
    TemplateRegistrySet: new LogEvent<([newTemplateRegistry: string] & {newTemplateRegistry: string})>(
        abi, '0xc47ce5a3d1962f1bd5ac9b69c672053fee26d979df0b718003fe388bf3da1f5e'
    ),
}

export const functions = {
    DEFAULT_ADMIN_ROLE: new Func<[], {}, string>(
        abi, '0xa217fddf'
    ),
    GOVERNANCE_ROLE: new Func<[], {}, string>(
        abi, '0xf36c8f5c'
    ),
    OPERATOR_ROLE: new Func<[], {}, string>(
        abi, '0xf5b541a6'
    ),
    TEMPLATE_TAG_ERC1155: new Func<[], {}, string>(
        abi, '0x6c0f402e'
    ),
    TEMPLATE_TAG_ERC721: new Func<[], {}, string>(
        abi, '0xde8327e0'
    ),
    VERSION: new Func<[], {}, ethers.BigNumber>(
        abi, '0xffa1ad74'
    ),
    addManual: new Func<[_templateTag: string, _collection: string, _indexFromBlockNumber: ethers.BigNumber], {_templateTag: string, _collection: string, _indexFromBlockNumber: ethers.BigNumber}, [_: ethers.BigNumber, _: string]>(
        abi, '0xa8fa85bb'
    ),
    batch: new Func<[calls: Array<string>, revertOnFail: boolean], {calls: Array<string>, revertOnFail: boolean}, []>(
        abi, '0xd2423b51'
    ),
    create: new Func<[_templateTag: string, addresses: Array<string>, name: string, symbol: string, _decimals: number, _contractURI: string, _defaultTokenURI: string, _proxyRegistryAddress: string], {_templateTag: string, addresses: Array<string>, name: string, symbol: string, _decimals: number, _contractURI: string, _defaultTokenURI: string, _proxyRegistryAddress: string}, [_: ethers.BigNumber, _: string]>(
        abi, '0xef464f01'
    ),
    createNonInit: new Func<[_templateTag: string], {_templateTag: string}, [_: ethers.BigNumber, _: string]>(
        abi, '0x28919127'
    ),
    exists: new Func<[_id: ethers.BigNumber], {_id: ethers.BigNumber}, boolean>(
        abi, '0x4f558e79'
    ),
    getCollection: new Func<[_id: ethers.BigNumber], {_id: ethers.BigNumber}, string>(
        abi, '0x5a1f3c28'
    ),
    getCollections: new Func<[], {}, Array<string>>(
        abi, '0x46e63586'
    ),
    getLastCollection: new Func<[], {}, string>(
        abi, '0xcfe35e8b'
    ),
    getLastCollectionId: new Func<[], {}, ethers.BigNumber>(
        abi, '0xbdad1454'
    ),
    getRoleAdmin: new Func<[role: string], {role: string}, string>(
        abi, '0x248a9ca3'
    ),
    grantRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x2f2ff15d'
    ),
    hasRole: new Func<[role: string, account: string], {role: string, account: string}, boolean>(
        abi, '0x91d14854'
    ),
    renounceRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0x36568abe'
    ),
    revokeRole: new Func<[role: string, account: string], {role: string, account: string}, []>(
        abi, '0xd547741f'
    ),
    setTemplateRegistry: new Func<[_templateRegistry: string], {_templateRegistry: string}, []>(
        abi, '0x2ea47822'
    ),
    supportsInterface: new Func<[interfaceId: string], {interfaceId: string}, boolean>(
        abi, '0x01ffc9a7'
    ),
    templateRegistry: new Func<[], {}, string>(
        abi, '0xa0af81f0'
    ),
    totalSupply: new Func<[], {}, ethers.BigNumber>(
        abi, '0x18160ddd'
    ),
}

export class Contract extends ContractBase {

    DEFAULT_ADMIN_ROLE(): Promise<string> {
        return this.eth_call(functions.DEFAULT_ADMIN_ROLE, [])
    }

    GOVERNANCE_ROLE(): Promise<string> {
        return this.eth_call(functions.GOVERNANCE_ROLE, [])
    }

    OPERATOR_ROLE(): Promise<string> {
        return this.eth_call(functions.OPERATOR_ROLE, [])
    }

    TEMPLATE_TAG_ERC1155(): Promise<string> {
        return this.eth_call(functions.TEMPLATE_TAG_ERC1155, [])
    }

    TEMPLATE_TAG_ERC721(): Promise<string> {
        return this.eth_call(functions.TEMPLATE_TAG_ERC721, [])
    }

    VERSION(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.VERSION, [])
    }

    exists(_id: ethers.BigNumber): Promise<boolean> {
        return this.eth_call(functions.exists, [_id])
    }

    getCollection(_id: ethers.BigNumber): Promise<string> {
        return this.eth_call(functions.getCollection, [_id])
    }

    getCollections(): Promise<Array<string>> {
        return this.eth_call(functions.getCollections, [])
    }

    getLastCollection(): Promise<string> {
        return this.eth_call(functions.getLastCollection, [])
    }

    getLastCollectionId(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.getLastCollectionId, [])
    }

    getRoleAdmin(role: string): Promise<string> {
        return this.eth_call(functions.getRoleAdmin, [role])
    }

    hasRole(role: string, account: string): Promise<boolean> {
        return this.eth_call(functions.hasRole, [role, account])
    }

    supportsInterface(interfaceId: string): Promise<boolean> {
        return this.eth_call(functions.supportsInterface, [interfaceId])
    }

    templateRegistry(): Promise<string> {
        return this.eth_call(functions.templateRegistry, [])
    }

    totalSupply(): Promise<ethers.BigNumber> {
        return this.eth_call(functions.totalSupply, [])
    }
}
