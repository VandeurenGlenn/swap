export default async (walletProvider = 'metamask') => {
  console.log(walletProvider)

  if (walletProvider === 'walletConnect') {
    if (!globalThis.walletConnect) await import('./wallet-connect.js')
    await walletConnect.connect()
  } else if (walletProvider === 'metamask') {
    const ethers = await import('../node_modules/ethers/dist/ethers.js')
    // console.log({importee});
    // const Web3Provider = importee.default.Web3Provider
    const provider = new ethers.BrowserProvider(globalThis.ethereum, 'any')
    // Prompt user for account connections
    const accounts = await provider.send('eth_requestAccounts', [])
    const signer = await provider.getSigner()
    globalThis.connector = signer
    const address = await signer.getAddress()
    globalThis.connector.accounts = accounts
    document.dispatchEvent(new CustomEvent('accountsChange', { detail: [address] }))
    // document.dispatchEvent(new CustomEvent('networkChange', {detail: chainId}))
  }
}
