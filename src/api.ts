import * as ethers from './../node_modules/ethers/dist/ethers.min.js'
globalThis.ethers = ethers
export const networks = {
  1: {
    name: 'ethereum',
    logo: './assets/ethereum.svg'
  },
  56: {
    name: 'binance',
    logo: './assets/binance.svg'
  },
  137: {
    name: 'polygon',
    logo: './assets/polygon.svg'
  }
}

export const supportedNetworks = ['ethereum', 'polygon', 'binance']

export const chainIds = [1, 56, 137]

export const getNetworkChainId = (name) => chainIds[supportedNetworks.indexOf(name)]

export const changeNetwork = async (chainId: number) => {
  let id = ethers.toBeHex(chainId).toString()
  if (id.split('0x')[1].startsWith('0')) id = id.replace('0x0', '0x')
  try {
    await globalThis.provider.send('wallet_switchEthereumChain', [{ chainId: id }])
  } catch (error) {
    console.log(chainId)

    if (Number(chainId) === 137) {
      await globalThis.provider.send('wallet_addEthereumChain', [
        {
          chainId: id,
          blockExplorerUrls: ['https://polygon-rpc.com'],
          rpcUrls: ['https://polygon-rpc.com', 'https://polygon.llamarpc.com', 'https://1rpc.io/matic'],
          chainName: 'Polygon Mainnet',
          nativeCurrency: {
            decimals: 18,
            name: 'MATIC',
            symbol: 'MATIC'
          }
        }
      ])
    }
  }
}

export const nativeCoins = {
  1: {
    icon: {
      color: './assets/ethereum.svg'
    },
    name: 'Ethereum',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    symbol: 'ETH'
  },
  56: {
    icon: {
      color: './assets/binance.svg'
    },
    name: 'Binance',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    symbol: 'BNB'
  },
  137: {
    icon: {
      color: './assets/polygon.svg'
    },
    name: 'Polygon',
    address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    symbol: 'MATIC'
  }
}

export const getNativeCoin = (chainId) => {
  if (!chainIds.includes(chainId)) throw new Error(`nothing found for ${chainId}`)
  return nativeCoins[chainId]
}
