import { Contract, formatUnits, parseUnits, toBeHex } from 'ethers'
import ERC20 from './ABI/ERC20.js'
import { TokenListToken } from './token-list.js'
import chainmap from 'chainmap'
import { ChainInfo } from './types/provider.js'

export interface InputToken extends TokenListToken {
  amount: string
}

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
  },
  42161: {
    name: 'arbitrum',
    logo: './assets/arbitrum.svg'
  },
  1313161554: {
    name: 'aurora',
    logo: './assets/aurora.svg'
  },
  43114: {
    name: 'avalanche',
    logo: './assets/avalanche.svg'
  },
  8453: {
    name: 'base',
    logo: './assets/base.svg'
  },
  324: {
    name: 'zkSync',
    logo: './assets/zksync-era.svg'
  },
  250: {
    name: 'fantom',
    logo: './assets/fantom.svg'
  },
  100: {
    name: 'gnosis',
    logo: './assets/gnosis.svg'
  },
  8217: {
    name: 'klaytn',
    logo: './assets/klaytn.svg'
  },
  10: {
    name: 'optimism',
    logo: './assets/optimism.svg'
  }
}

export const supportedNetworks = ['ethereum', 'polygon', 'binance']

export const chainIds = [1, 56, 137]

export const getNetworkChainId = (name) => chainIds[supportedNetworks.indexOf(name)]

export const changeNetwork = async (chainId: number) => {
  if (globalThis.walletProvider === 'metamask') {
    let id = toBeHex(chainId).toString()
    if (id.split('0x')[1].startsWith('0')) id = id.replace('0x0', '0x')
    try {
      await globalThis.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: id }] })
    } catch (error) {
      console.log(error)

      console.log(chainId)
      const chainInfo = chainmap[chainId] as ChainInfo
      try {
        await globalThis.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: id,
              blockExplorerUrls: [chainInfo.explorerUrl],
              rpcUrls: chainInfo.rpc,
              chainName: chainInfo.name,
              nativeCurrency: {
                decimals: chainInfo.currency.decimals,
                name: chainInfo.currency.name,
                symbol: chainInfo.currency.symbol
              }
            }
          ]
        })
      } catch (error) {
        console.error(error)
      }
    }
  } else {
    document.dispatchEvent(new CustomEvent('networkChange', { detail: chainId }))
  }
}

export const nativeCoins = {
  1: {
    icon: {
      color: './assets/ethereum.svg'
    },
    name: 'Ethereum',
    symbol: 'ETH'
  },
  56: {
    icon: {
      color: './assets/binance.svg'
    },
    name: 'Binance',
    symbol: 'BNB'
  },
  137: {
    icon: {
      color: './assets/polygon.svg'
    },
    name: 'Polygon',
    symbol: 'MATIC'
  },
  42161: {
    name: 'arbitrum',
    icon: { color: './assets/arbitrum.svg' }
  },
  1313161554: {
    name: 'aurora',
    icon: { color: './assets/aurora.svg' }
  },
  43114: {
    name: 'avalanche',
    icon: { color: './assets/avalanche.svg' }
  },
  8453: {
    name: 'base',
    icon: { color: './assets/base.svg' }
  },
  324: {
    name: 'zkSync',
    icon: { color: './assets/zksync-era.svg' }
  },
  250: {
    name: 'fantom',
    icon: { color: './assets/fantom.svg' }
  },
  100: {
    name: 'gnosis',
    icon: { color: './assets/gnosis.svg' }
  },
  8217: {
    name: 'klaytn',
    icon: { color: './assets/klaytn.svg' }
  },
  10: {
    name: 'optimism',
    icon: { color: './assets/optimism.svg' }
  }
}
export const generateExplorerLink = (chainId, transactionHash) => {
  const chainInfo = chainmap[chainId] as ChainInfo

  return `https://${chainInfo.explorerUrl}/tx/${transactionHash}`
}

export const getNativeCoin = (chainId) => {
  if (!chainIds.includes(chainId)) throw new Error(`nothing found for ${chainId}`)

  const chainInfo = chainmap[chainId] as ChainInfo
  return { address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', ...nativeCoins[chainId], ...chainInfo.currency }
}

export const getRouterAddres = async (chainId) => {
  const response = await fetch(`https://swap.leofcoin.org/routerAddress?chainId=${chainId}`)
  return response.text()
}

export const getBalance = async (owner, tokenAddress, decimals) => {
  let balance = '0'
  if (tokenAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
    balance = formatUnits(await provider.getBalance(owner), decimals)
  } else {
    const contract = new Contract(tokenAddress, ERC20, provider)
    balance = formatUnits(await contract.balanceOf(owner), decimals)
  }
  return balance
}

export const quote = async () => {}

export const swap = async (inputToken: InputToken, outputToken: TokenListToken, chainId, sender, slippage = 5) =>
  new Promise(async (resolve) => {
    try {
      document.dispatchEvent(new CustomEvent('swap-start'))

      if (inputToken.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        document.dispatchEvent(new CustomEvent('swap-allowance-start'))
        const spender = await getRouterAddres(chainId)

        const contract = new Contract(inputToken.address, ERC20, signer)
        const allowance = await contract.allowance(sender, spender)
        console.log(allowance)

        document.dispatchEvent(
          new CustomEvent('swap-allowance-end', { detail: formatUnits(allowance, inputToken.decimals) })
        )
        if (Number(formatUnits(allowance, inputToken.decimals)) < Number(inputToken.amount)) {
          document.dispatchEvent(new CustomEvent('swap-approve-start'))

          const approve = await contract.approve(spender, parseUnits(inputToken.amount, inputToken.decimals))
          console.log(approve)
          await approve.wait()

          globalThis.notificationManager.add({
            title: 'approved swap',
            text: `${inputToken.symbol} -> ${outputToken.symbol}`,
            link: { title: 'open explorer', url: generateExplorerLink(chainId, approve.hash) }
          })
          document.dispatchEvent(new CustomEvent('swap-approve-end', { detail: approve }))
        }
      }
    } catch (error) {
      console.log(error.prototype)

      if (error.message.includes('user rejected action')) document.dispatchEvent(new CustomEvent('swap-cancel'))
    }

    setTimeout(async () => {
      const response = await fetch(
        `https://swap.leofcoin.org/swap?chainId=${chainId}&tokenIn=${inputToken.address}&tokenOut=${
          outputToken.address
        }&amount=${parseUnits(inputToken.amount, inputToken.decimals).toString()}&from=${sender}&slippage=${slippage}`
      )

      const result = await response.json()

      if (Object.keys(result).length !== 0) {
        try {
          const signed = await globalThis.signer.sendTransaction(result.tx)
          await signed.wait()
          globalThis.notificationManager.add({
            title: 'swapped',
            text: `${inputToken.symbol} -> ${outputToken.symbol}`,
            link: { title: 'open explorer', url: generateExplorerLink(chainId, signed.hash) }
          })
          resolve(result)

          document.dispatchEvent(new CustomEvent('swap-end', { detail: result }))
        } catch (error) {
          console.log(error.message)

          if (error.message.includes('user rejected action')) document.dispatchEvent(new CustomEvent('swap-cancel'))
        }
      } else {
        document.dispatchEvent(new CustomEvent('swap-error'))
      }
    }, 1000)
  })
