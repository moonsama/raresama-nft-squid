export const ABI_JSON = [
    {
        "type": "constructor",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_templateRegistry"
            },
            {
                "type": "address",
                "name": "governor"
            },
            {
                "type": "address",
                "name": "admin"
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CollectionAdded",
        "inputs": [
            {
                "type": "uint256",
                "name": "id",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "template",
                "indexed": false
            },
            {
                "type": "address",
                "name": "collectionAddress",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "blockNumber",
                "indexed": false
            },
            {
                "type": "string",
                "name": "name",
                "indexed": false
            },
            {
                "type": "string",
                "name": "symbols",
                "indexed": false
            },
            {
                "type": "uint8",
                "name": "_decimals",
                "indexed": false
            },
            {
                "type": "string",
                "name": "_contractURI",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "CollectionAddedWithoutConstructor",
        "inputs": [
            {
                "type": "uint256",
                "name": "id",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "template",
                "indexed": false
            },
            {
                "type": "address",
                "name": "collectionAddress",
                "indexed": false
            },
            {
                "type": "uint256",
                "name": "blockNumber",
                "indexed": false
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RoleAdminChanged",
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "previousAdminRole",
                "indexed": true
            },
            {
                "type": "bytes32",
                "name": "newAdminRole",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RoleGranted",
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "RoleRevoked",
        "inputs": [
            {
                "type": "bytes32",
                "name": "role",
                "indexed": true
            },
            {
                "type": "address",
                "name": "account",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": true
            }
        ]
    },
    {
        "type": "event",
        "anonymous": false,
        "name": "TemplateRegistrySet",
        "inputs": [
            {
                "type": "address",
                "name": "newTemplateRegistry",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "DEFAULT_ADMIN_ROLE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32"
            }
        ]
    },
    {
        "type": "function",
        "name": "GOVERNANCE_ROLE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32"
            }
        ]
    },
    {
        "type": "function",
        "name": "OPERATOR_ROLE",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32"
            }
        ]
    },
    {
        "type": "function",
        "name": "TEMPLATE_TAG_ERC1155",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32"
            }
        ]
    },
    {
        "type": "function",
        "name": "TEMPLATE_TAG_ERC721",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "bytes32"
            }
        ]
    },
    {
        "type": "function",
        "name": "VERSION",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "addManual",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "_templateTag"
            },
            {
                "type": "address",
                "name": "_collection"
            },
            {
                "type": "uint256",
                "name": "_indexFromBlockNumber"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            },
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "batch",
        "constant": false,
        "stateMutability": "payable",
        "payable": true,
        "inputs": [
            {
                "type": "bytes[]",
                "name": "calls"
            },
            {
                "type": "bool",
                "name": "revertOnFail"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "create",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "_templateTag"
            },
            {
                "type": "address[5]",
                "name": "addresses"
            },
            {
                "type": "string",
                "name": "name"
            },
            {
                "type": "string",
                "name": "symbol"
            },
            {
                "type": "uint8",
                "name": "_decimals"
            },
            {
                "type": "string",
                "name": "_contractURI"
            },
            {
                "type": "string",
                "name": "_defaultTokenURI"
            },
            {
                "type": "address",
                "name": "_proxyRegistryAddress"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            },
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "createNonInit",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "_templateTag"
            }
        ],
        "outputs": [
            {
                "type": "uint256"
            },
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "exists",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_id"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "getCollection",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "uint256",
                "name": "_id"
            }
        ],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "getCollections",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address[]"
            }
        ]
    },
    {
        "type": "function",
        "name": "getLastCollection",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "getLastCollectionId",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    },
    {
        "type": "function",
        "name": "getRoleAdmin",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            }
        ],
        "outputs": [
            {
                "type": "bytes32"
            }
        ]
    },
    {
        "type": "function",
        "name": "grantRole",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "hasRole",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "renounceRole",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "revokeRole",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "bytes32",
                "name": "role"
            },
            {
                "type": "address",
                "name": "account"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "setTemplateRegistry",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_templateRegistry"
            }
        ],
        "outputs": []
    },
    {
        "type": "function",
        "name": "supportsInterface",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "bytes4",
                "name": "interfaceId"
            }
        ],
        "outputs": [
            {
                "type": "bool"
            }
        ]
    },
    {
        "type": "function",
        "name": "templateRegistry",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "address"
            }
        ]
    },
    {
        "type": "function",
        "name": "totalSupply",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [],
        "outputs": [
            {
                "type": "uint256"
            }
        ]
    }
]
