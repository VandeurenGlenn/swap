import { BrowserProvider } from 'ethers'

declare global {
  var provider: BrowserProvider
}

export default async (walletProvider = 'metamask') => {
  console.log(walletProvider)

  if (walletProvider === 'walletConnect') {
    if (!globalThis.walletConnect) await import('./wallet-connect.js')
    await globalThis.walletConnect.connect()
  } else if (walletProvider === 'metamask') {
    const ethers = await import('../node_modules/ethers/dist/ethers.js')
    // console.log({importee});
    // const Web3Provider = importee.default.Web3Provider
    const provider = new ethers.BrowserProvider(globalThis.ethereum, 'any')
    // Prompt user for account connections
    const accounts = await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()

    globalThis.connector = signer
    globalThis.provider = provider

    const address = await signer.getAddress()
    globalThis.connector.accounts = accounts

    const chainId = await provider.send('eth_chainId')

    globalThis.ethereum // Or window.ethereum if you don't support EIP-6963.
      .on('chainChanged', (chainId) =>
        document.dispatchEvent(new CustomEvent('networkChange', { detail: Number(chainId) }))
      )

    globalThis.ethereum // Or window.ethereum if you don't support EIP-6963.
      .on('accountsChanged', (accounts) =>
        document.dispatchEvent(new CustomEvent('accountsChange', { detail: accounts }))
      )
    document.dispatchEvent(new CustomEvent('accountsChange', { detail: accounts }))
    document.dispatchEvent(new CustomEvent('networkChange', { detail: Number(chainId) }))
  }
}
