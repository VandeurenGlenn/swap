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
  if (globalThis.walletProvider === 'metamask') {
    let id = ethers.toBeHex(chainId).toString()
    if (id.split('0x')[1].startsWith('0')) id = id.replace('0x0', '0x')
    try {
      await globalThis.ethereum.send('wallet_switchEthereumChain', [{ chainId: id }])
    } catch (error) {
      console.log(error)

      console.log(chainId)

      if (Number(chainId) === 137) {
        try {
          await globalThis.ethereum.send('wallet_addEthereumChain', [
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
    return `https://etherscan.io?transaction=${transactionHash}`
  } else if (chainId === 56) {
    return `https://bscscan.com?transaction=${transactionHash}`
  } else if (chainId === 137) {
    return `https://polygonscan.com?transaction=${transactionHash}`
  }
}

export const getNativeCoin = (chainId) => {
  if (!chainIds.includes(chainId)) throw new Error(`nothing found for ${chainId}`)
  return nativeCoins[chainId]
}

export const swap = async (inputToken, outputToken, chainId) => {
  if (inputToken.address !== '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
    const response = await fetch(
      `https://swap.leofcoin.org/approve?chainId=${chainId}&tokenAddress=${
        inputToken.address
      }&amount=${ethers.parseUnits(inputToken.amount)}`
    )

    const { tx } = await response.json()
    const signed = await globalThis.signer.sendTransaction(tx)
    await signed.wait()
    globalThis.notificationManager.add({
      title: 'approved swap',
      text: `${inputToken.symbol} -> ${outputToken.symbol}`,
      link: { title: 'open explorer', url: generateExplorerLink(chainId, signed.hash) }
    })
  }

  const response = await fetch(
    `https://swap.leofcoin.org/swap?chainId=${chainId}&tokenIn=${inputToken.address}&tokenOut=${
      outputToken.address
    }&amount=${ethers.parseUnits(inputToken.amount)}&from=${await globalThis.signer.getAddress()}`
  )

  const { tx } = await response.json()
  const signed = await globalThis.signer.sendTransaction(tx)
  await signed.wait()
  globalThis.notificationManager.add({
    title: 'swapped',
    text: `${inputToken.symbol} -> ${outputToken.symbol}`,
    link: { title: 'open explorer', url: generateExplorerLink(chainId, signed.hash) }
  })
}
