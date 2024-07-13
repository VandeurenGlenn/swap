import { LitElement, html, css, PropertyValueMap } from 'lit'
import { guard } from 'lit/directives/guard.js'
import { provide, createContext } from '@lit/context'
import { customElement, property, query } from 'lit/decorators.js'
import '@vandeurenglenn/lit-elements/icon-set.js'
import './elements/network/select.js'
import './elements/account/element.js'
import './elements/token/select.js'
import './elements/token/input.js'
import './elements/swap/tokens.js'
import './elements/token/input-swap.js'
import './elements/hero.js'
import './elements/connect/hero.js'
import './elements/disconnect/hero.js'
import './elements/swap/hero.js'
import './elements/connect/wallet.js'
import TokenList from './token-list.js'
import * as ethers from './../node_modules/ethers/dist/ethers.min.js'
import { getNativeCoin, getNetworkChainId } from './api.js'
import ERC20 from './ABI/ERC20.js'

@customElement('app-shell')
export class AppShell extends LitElement {
  #currentSelectedInput
  babyfox = {
    symbol: 'BABYFOX',
    name: 'babyfox',
    address: '0x8FFfED722C699848d0c0dA9ECfEde20e8ACEf7cE',
    icon: { color: './assets/logo.webp' }
  }

  #nativeTokens = {
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
        color: './assets/bsc.svg'
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

  getNativeToken(chainId) {
    return this.#nativeTokens[chainId]
  }

  #tokenList: TokenList
  @property()
  info

  @provide({ context: createContext('tokens') })
  tokens

  @property() dex = 'pancakeswap'

  @property({ type: Object }) chain = { name: 'binance', chainId: 56 }

  @provide({ context: createContext('selected-account') })
  @property()
  selectedAccount

  @provide({ context: createContext('swap-info') })
  @property()
  swapInfo

  @provide({ context: createContext('accounts') })
  @property()
  accounts

  @provide({ context: createContext('selected-network') })
  selectedNetwork

  @property() quote

  @query('connect-hero') connectHero

  @query('disconnect-hero') disconnectHero

  @query('swap-hero') swapHero

  @query('token-selector') tokenSelector

  @query('token-input[action="sell"]') tokenInputEl

  @query('token-input[action="buy"]') tokenOutputEl

  #networkchange = ({ detail }: CustomEvent) => {
    this.selectedNetwork = detail
  }

  #accountchange = ({ detail }: CustomEvent) => {
    if (Array.isArray(detail)) {
      this.selectedAccount = detail[0]
      this.accounts = detail
      if (this.connectHero.shown) this.connectHero.shown = false
      localStorage.setItem('wallet-connected', 'true')
    } else {
      this.selectedAccount = undefined
      this.accounts = undefined
      localStorage.setItem('wallet-connected', 'false')
    }
  }

  resetInputs = () => {
    const inputs = this.shadowRoot?.querySelectorAll('token-input')
    inputs[0].reset()
    inputs[1].reset()
    inputs[0].requestUpdate()
    inputs[1].requestUpdate()
  }

  #tokenInputChange = async ({ detail }: CustomEvent) => {
    if (detail === '') {
      this.swapInfo = undefined
      this.resetInputs()
      return
    } else if (detail === '0' || detail === '0.') {
      return
    }
    const tokenInput = this.tokenInputEl.selected
    const tokenOutput = this.tokenOutputEl.selected
    const amount = detail

    let balance

    if (tokenInput.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      balance = ethers.formatUnits(await provider.send('eth_getBalance', [this.selectedAccount]))
    } else {
      const contract = new ethers.Contract(tokenInput.address, ERC20, await provider.getSigner())

      balance = ethers.formatUnits((await contract.balanceOf(this.selectedAccount)).toString())
    }

    if (Number(balance) < Number(amount)) {
      document.dispatchEvent(new CustomEvent('swap-balance-to-low', { detail: balance }))
    } else {
      const response = await fetch(
        `https://swap.leofcoin.org/quote?tokenIn=${tokenInput.address}&tokenOut=${
          tokenOutput.address
        }&amount=${ethers.parseUnits(amount)}&chainId=${this.selectedNetwork}`
      )
      const quote = await response.json()
      const units = ethers.formatUnits(String(quote.dstAmount))
      if (units < 1) this.tokenOutputEl.amount = units
      else this.tokenOutputEl.amount = Math.round(units * 100) / 100
      this.swapInfo = undefined
      this.swapInfo = quote
    }
  }

  #swapBalanceToLow = () => {
    this.tokenInputEl.errorMessage = 'balance to low'
    this.tokenInputEl.errorShown = true
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    document.addEventListener('token-selector-change', this.tokenSelectorChange)
    document.addEventListener('accountsChange', this.#accountchange)
    document.addEventListener('networkChange', this.#networkchange)
    document.addEventListener('token-input-change', this.#tokenInputChange)
    document.addEventListener('swap-balance-to-low', this.#swapBalanceToLow)
  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if ((_changedProperties.has('chain') && this.dex) || (_changedProperties.has('dex') && this.chain)) {
      this.updateTokens()
    }
  }

  async updateTokens() {
    this.#tokenList = new TokenList(this.dex, this.chain.name)
    if (!customElements.get('token-selector')) await import('./elements/token/selector.js')
  }

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        color: var(--md-sys-color-on-surface);

        background-color: var(--surface);
      }

      .title {
        color: var(--accent);
      }

      .flex {
        display: flex;
        flex: 1;
      }

      header {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 56px;
        padding: 6px 12px;
        box-sizing: border-box;
      }
    `
  ]

  /**
   * add native and babyfox to tokenlist
   */
  #appendTokenList(tokens) {
    const native = getNativeCoin(this.chain.chainId)
    tokens[native.symbol] = native
    tokens[this.babyfox.symbol] = this.babyfox
  }

  async sellTokenSelect() {
    this.#currentSelectedInput = 'sell'
    const tokens = await this.#tokenList.getList()
    const onselect = ({ detail }) => {
      this.tokenInputEl.selected = detail
      this.tokenSelector.removeEventListener('select', onselect)
    }

    this.tokenSelector.addEventListener('select', onselect)
    this.tokenSelector.show()
    this.#appendTokenList(tokens)

    this.tokens = tokens
  }

  async buyTokenSelect() {
    this.#currentSelectedInput = 'buy'
    const tokens = await this.#tokenList.getList()
    const onselect = ({ detail }) => {
      this.tokenOutputEl.selected = detail
      this.tokenSelector.removeEventListener('select', onselect)
    }

    this.tokenSelector.addEventListener('select', onselect)
    this.tokenSelector.show()
    this.#appendTokenList(tokens)
    this.tokens = tokens
  }

  showConnectHero() {
    this.connectHero.shown = true
  }

  disconnect() {
    localStorage.removeItem('selectedWalletProvider')
    localStorage.removeItem('wallet-connected')
    this.accounts = undefined
    this.selectedAccount = undefined
    connector.disconnect()
  }

  showSwapHero() {
    this.swapHero.inputToken = { amount: this.tokenInputEl.amount, ...this.tokenInputEl.selected }
    this.swapHero.outputToken = { amount: this.tokenOutputEl.amount, ...this.tokenOutputEl.selected }
    this.swapHero.shown = true
  }

  showDisconnectHero() {
    this.disconnectHero.shown = true
  }

  swapInput() {
    const inputs = this.shadowRoot?.querySelectorAll('token-input')
    const selectedSell = inputs[0].selected
    const selectedBuy = inputs[1].selected

    this.resetInputs()

    inputs[0].selected = selectedBuy
    inputs[1].selected = selectedSell
  }

  render() {
    return html`
      <custom-icon-set name="icons">
        <template>
          <span name="swap_vert">@symbol-swap_vert</span>
          <span name="keyboard_arrow_down">@symbol-keyboard_arrow_down</span>
          <span name="keyboard_arrow_up">@symbol-keyboard_arrow_up</span>
          <span name="cancel">@symbol-cancel</span>
          <span name="error">@symbol-error</span>
        </template>
      </custom-icon-set>
      <header>
        <span class="flex"></span>
        <account-element></account-element>
      </header>
      <img src="./assets/logo.webp" />
      <h1 class="title">FoxSwap</h1>
      <hero-element>
        ${guard(
          this.chain.chainId,
          () => html`
            <token-input
              .selected=${getNativeCoin(this.chain.chainId)}
              action="sell"
              @token-select=${this.sellTokenSelect}></token-input>
          `
        )}

        <token-input-swap @click=${this.swapInput}></token-input-swap>
        ${guard(
          this.babyfox,
          () => html`
            <token-input
              no-input
              action="buy"
              @token-select=${this.buyTokenSelect}
              .selected=${this.babyfox}></token-input>
          `
        )}
        ${this.selectedAccount
          ? html`<swap-tokens ?disabled=${!this.swapInfo}></swap-tokens>`
          : html`<connect-wallet></connect-wallet>`}
      </hero-element>
      <token-selector></token-selector>

      <connect-hero></connect-hero>
      <disconnect-hero></disconnect-hero>
      <swap-hero></swap-hero>
    `
  }
}
