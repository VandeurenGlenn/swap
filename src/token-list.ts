export type TokenListToken = {
  symbol: string
  name: string
  address: string
  icon: string
  decimals: 9
}

export default class TokenList {
  dex: 'uniswap' | 'pancakeswap' | '1inch' | 'coingecko'
  chain: 'mainnet' | 'kovan' | 'binance'
  /**
   * @param {String} chain
   * @param {String} dex
   * @param {String} dex
   */
  constructor(chain, dex, iconPrefix?) {
    if (!chain) chain = 'uniswap'
    if (!dex) dex = 'mainnet'
    if (!iconPrefix) iconPrefix = 'https://raw.githubusercontent.com/CoinsSwap/token-list/main/build/icons'

    this.dex = dex
    this.chain = chain
    this.iconPrefix = iconPrefix
  }

  transformTokens(tokens) {
    for (const key of Object.keys(tokens)) {
      if (!tokens[key].icon)
        tokens[key].icon = {
          black: `${this.iconPrefix}/black/generic.svg`,
          color: `${this.iconPrefix}/color/generic.svg`,
          white: `${this.iconPrefix}/white/generic.svg`
        }
      else if (!tokens[key].icon.includes('https://') && !tokens[key].icon.includes('ipfs://'))
        tokens[key].icon = {
          black: `${this.iconPrefix}/black/${tokens[key].icon}`,
          color: `${this.iconPrefix}/color/${tokens[key].icon}`,
          white: `${this.iconPrefix}/white/${tokens[key].icon}`
        }
      else tokens[key].icon = { color: tokens[key].icon }
    }

    return tokens
  }

  async getList(chain?, dex?, prefix?): Promise<{ [symbol: string]: TokenListToken }> {
    if (!chain) chain = this.chain
    if (!dex) dex = this.dex
    prefix = prefix || 'https://raw.githubusercontent.com/CoinsSwap/token-list/main/build/tokens'
    const response = await fetch(`${prefix}/${dex}/${chain}.json`)
    return this.transformTokens(await response.json())
  }
}
