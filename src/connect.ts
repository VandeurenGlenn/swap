import Provider from './provider.js'
import { BrowserProvider, JsonRpcSigner } from 'ethers'

declare global {
  var provider: BrowserProvider
  var signer: JsonRpcSigner
  var connector
  var ethereum: BrowserProvider
}

export default async (walletProvider = 'metamask') => {
  globalThis.walletProvider = walletProvider
  if (walletProvider === 'walletConnect') {
    // @ts-ignore
    if (!globalThis.walletConnect) await import('./wallet-connect.js')

    let session = await globalThis.walletConnect.getSession()
    console.log(session)
    if (!session) {
      // document.dispatchEvent(new CustomEvent('networkChange', { detail: Number(chainId) }))

      session = await globalThis.walletConnect.connect({
        requiredNamespaces: {
          eip155: {
            methods: ['eth_sendTransaction', 'personal_sign'],
            chains: ['eip155:1', 'eip155:56', 'eip155:137'],
            events: ['chainChanged', 'accountsChanged']
          }
        }
      })
    }

    document.dispatchEvent(new CustomEvent('accountsChange', { detail: await globalThis.walletConnect.getAccounts() }))
    document.dispatchEvent(
      new CustomEvent('networkChange', { detail: document.querySelector('app-shell').chain.chainId })
    )

    const provider = new Provider(document.querySelector('app-shell').chain.chainId)
    globalThis.provider = provider

    globalThis.connector = {
      disconnect: () => {
        globalThis.walletConnect.disconnect({ topic: session.topic })
      }
    }
    globalThis.signer = {
      getAddress: () => globalThis.walletConnect.getAccounts(),
      sendTransaction: (tx) => globalThis.walletConnect.sendTransaction(tx)
    }
  } else if (walletProvider === 'metamask') {
    // console.log({importee});
    // const Web3Provider = importee.default.Web3Provider
    const provider = new BrowserProvider(globalThis.ethereum, 'any') as BrowserProvider
    globalThis.provider = new Provider(document.querySelector('app-shell').chain.chainId)
    // Prompt user for account connections

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    const signer = await provider.getSigner()

    globalThis.signer = signer as JsonRpcSigner
    globalThis.connector = signer as JsonRpcSigner

    const address = await signer.getAddress()
    globalThis.connector.accounts = accounts

    const chainId = await ethereum.request({ method: 'eth_chainId' })

    ethereum // Or window.ethereum if you don't support EIP-6963.
      .on('chainChanged', (chainId) =>
        document.dispatchEvent(new CustomEvent('networkChange', { detail: Number(chainId) }))
      )

    ethereum // Or window.ethereum if you don't support EIP-6963.
      .on('accountsChanged', (accounts) =>
        document.dispatchEvent(new CustomEvent('accountsChange', { detail: accounts }))
      )
    document.dispatchEvent(new CustomEvent('accountsChange', { detail: accounts }))
    document.dispatchEvent(new CustomEvent('networkChange', { detail: Number(chainId) }))
  }
}
