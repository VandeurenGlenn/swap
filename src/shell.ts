import { LitElement, html, css, PropertyValueMap } from 'lit'
import { provide, createContext } from '@lit/context'
import { customElement, property, query } from 'lit/decorators.js'
import '@vandeurenglenn/lit-elements/icon-set.js'
import './elements/token-select.js'
import './elements/token-input.js'
import './elements/swap-tokens.js'
import './elements/token-input-swap.js'
import './elements/hero.js'
import './elements/connect-hero.js'
import './elements/swap-hero.js'
import './elements/connect-wallet.js'
import TokenList from './token-list.js'
import { N } from 'ethers'

@customElement('app-shell')
export class AppShell extends LitElement {
  #currentSelectedInput
  babyfox = {
    symbol: 'BABYFOX',
    name: 'babyfox',
    address: '0x8FFfED722C699848d0c0dA9ECfEde20e8ACEf7cE',
    icon: { color: './assets/logo.webp' }
  }

  nativeToken = {
    icon: {
      color: './assets/bsc.svg'
    },
    name: 'Binance',
    address: '0x00',
    symbol: 'BNB'
  }

  #tokenList: TokenList
  @provide({ context: createContext('tokens') })
  tokens

  @property() dex = 'pancakeswap'

  @property() chain = 'binance'

  @provide({ context: createContext('selectedAccount') })
  @property()
  selectedAccount

  @query('connect-hero') connectHero

  @query('swap-hero') swapHero

  @query('token-selector') tokenSelector

  @query('token-input[action="sell"]') tokenInputEl

  @query('token-input[action="buy"]') tokenOutputEl

  tokenSelectorChange({ detail }: CustomEvent) {
    console.log({ detail })
  }

  #accountchange = ({ detail }: CustomEvent) => {
    console.log({ detail })

    if (Array.isArray(detail)) {
      this.selectedAccount = detail[0]
      if (this.connectHero.shown) this.connectHero.shown = false
      localStorage.setItem('wallet-connected', 'true')
    } else {
      this.selectedAccount = undefined
      localStorage.setItem('wallet-connected', 'false')
    }
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    document.addEventListener('token-selector-change', this.tokenSelectorChange)
    document.addEventListener('accountsChange', this.#accountchange)
  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if ((_changedProperties.has('chain') && this.dex) || (_changedProperties.has('dex') && this.chain)) {
      this.updateTokens()
    }
  }

  async updateTokens() {
    this.#tokenList = new TokenList(this.dex, this.chain)
    if (!customElements.get('token-selector')) await import('./elements/token-selector.js')
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
    `
  ]

  async sellTokenSelect() {
    this.#currentSelectedInput = 'sell'
    this.tokenSelector.show()
    this.tokens = { BNB: this.nativeToken, ...(await this.#tokenList.getList()) }
    this.tokenSelector.tokens = this.tokens
    this.tokenSelector.requestUpdate()
  }

  async buyTokenSelect() {
    this.#currentSelectedInput = 'buy'
    this.tokenSelector.show()
    this.tokens = { BNB: this.nativeToken, ...(await this.#tokenList.getList()) }
    this.tokenSelector.tokens = this.tokens
    this.tokenSelector.requestUpdate()
  }

  showConnectHero() {
    this.connectHero.shown = true
  }

  showSwapHero() {
    this.swapHero.inputToken = this.tokenInputEl.selected
    this.swapHero.outputToken = this.tokenOutputEl.selected

    this.swapHero.shown = true
  }

  swapInput() {
    const inputs = this.shadowRoot?.querySelectorAll('token-input')
    const selectedSell = inputs[0].selected
    const selectedBuy = inputs[1].selected
    inputs[0].selected = selectedBuy
    inputs[1].selected = selectedSell
  }

  render() {
    return html`
      <custom-icon-set name="icons">
        <template>
          <span name="swap_vert">@symbol-swap_vert</span>
          <span name="keyboard_arrow_down">@symbol-keyboard_arrow_down</span>
          <span name="cancel">@symbol-cancel</span>
        </template>
      </custom-icon-set>
      <img src="./assets/logo.webp" />
      <h1 class="title">FoxSwap</h1>
      <hero-element>
        <token-input
          .selected=${this.nativeToken}
          action="sell"
          @token-select=${this.sellTokenSelect}></token-input>
        <token-input-swap @click=${this.swapInput}></token-input-swap>
        <token-input
          action="buy"
          @token-select=${this.buyTokenSelect}
          .selected=${this.babyfox}></token-input>
        ${this.selectedAccount ? html`<swap-tokens></swap-tokens>` : html`<connect-wallet></connect-wallet>`}
      </hero-element>
      <token-selector></token-selector>

      <connect-hero></connect-hero>
      <swap-hero></swap-hero>
    `
  }
}
