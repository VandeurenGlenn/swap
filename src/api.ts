import { Contract, formatUnits, parseUnits, toBeHex } from 'ethers'
import ERC20 from './ABI/ERC20.js'
import { TokenListToken } from './token-list.js'

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

      if (Number(chainId) === 137) {
        try {
          await globalThis.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
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
            ]
          })
        } catch (error) {
          console.error(error)
        }
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
export const generateExplorerLink = (chainId, transactionHash) => {
  if (chainId === 1) {
    return `https://etherscan.io/tx/${transactionHash}`
  } else if (chainId === 56) {
    return `https://bscscan.com/tx/${transactionHash}`
  } else if (chainId === 137) {
    return `https://polygonscan.com/tx/${transactionHash}`
  }
}

export const getNativeCoin = (chainId) => {
  if (!chainIds.includes(chainId)) throw new Error(`nothing found for ${chainId}`)
  return nativeCoins[chainId]
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
