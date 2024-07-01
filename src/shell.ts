import { LitElement, html, css, PropertyValueMap } from 'lit'
import { provide, createContext } from '@lit/context'
import { customElement, property } from 'lit/decorators.js'
import '@vandeurenglenn/lit-elements/icon-set.js'
import './elements/token-select.js'
import './elements/token-input.js'
import './elements/token-input-swap.js'
import './elements/hero.js'
import './elements/connect-wallet.js'
import TokenList from './token-list.js'

@customElement('app-shell')
export class AppShell extends LitElement {
  babyfox = {
    symbol: 'BABYFOX',
    name: 'babyfox',
    address: '0x8FFfED722C699848d0c0dA9ECfEde20e8ACEf7cE',
    icon: { color: './assets/logo.webp' }
  }

  #tokenList: TokenList
  @provide({ context: createContext('tokens') })
  tokens

  @property() dex = 'coingecko'

  @property() chain = 'binance'

  tokenSelectorChange({ detail }: CustomEvent) {
    console.log({ detail })
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    document.addEventListener('token-selector-change', this.tokenSelectorChange)
  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if ((_changedProperties.has('chain') && this.dex) || (_changedProperties.has('dex') && this.chain)) {
      this.updateTokens()
    }
  }

  async updateTokens() {
    this.#tokenList = new TokenList(this.dex, this.chain)
    this.tokens = await this.#tokenList.getList()
    if (!customElements.get('token-selector')) await import('./elements/token-selector.js')
  }

  // async connectedCallback() {
  //   super.connectedCallback()
  //   const response = await fetch('https://tokens.pancakeswap.finance/coingecko.json')
  //   const { tokens } = await response.json()

  //   this.tokens = tokens

  //   await import('./elements/token-selector.js')
  // }
  static styles = [
    css`
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        background: var(--surface);
        color: var(--md-sys-color-on-surface);
      }
    `
  ]

  sellTokenSelect() {
    this.shadowRoot?.querySelector('token-selector').show()
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

      <hero-element>
        <token-input
          action="sell"
          @token-select=${this.sellTokenSelect}></token-input>
        <token-input-swap></token-input-swap>
        <token-input
          action="buy"
          .selected=${this.babyfox}></token-input>
        <connect-wallet></connect-wallet>
      </hero-element>

      <token-selector></token-selector>
    `
  }
}
