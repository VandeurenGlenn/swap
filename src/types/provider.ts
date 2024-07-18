export type CurrencyInfo = {
  name: string
  symbol: string
  decimals: number
  iconUrl?: string
}

export type ChainInfo = {
  name: string
  chainId: number
  rpc: string[]
  currency: CurrencyInfo
  explorerUrl?: string
  iconUrl?: string
}
