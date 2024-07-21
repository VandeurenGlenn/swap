import { pubsub } from './preload.js'
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
import './elements/import-hero.js'
import './elements/connect/hero.js'
import './elements/disconnect/hero.js'
import './elements/swap/hero.js'
import './elements/connect/wallet.js'
import './elements/notification/manager.js'
import './elements/notification/pane.js'
import TokenList from './token-list.js'
import * as ethers from './../node_modules/ethers/dist/ethers.min.js'
import { getNativeCoin, getNetworkChainId } from './api.js'
import ERC20 from './ABI/ERC20.js'
import { formatUnits, parseUnits } from 'ethers'

@customElement('app-shell')
export class AppShell extends LitElement {
  #tokenList: TokenList

  babyfox = {
    symbol: 'BABYFOX',
    name: 'babyfox',
    address: '0x8FFfED722C699848d0c0dA9ECfEde20e8ACEf7cE',
    icon: { color: './assets/logo.webp' }
  }

  @property()
  info

  @property()
  slippage = 5

  @provide({ context: createContext('tokens') })
  tokens

  @property() dex = 'pancakeswap'

  _chain

  @provide({ context: createContext('chain') })
  @property({ type: Object })
  chain = { name: 'binance', chainId: 56 }
  set property(value) {
    this._chain = value
    this.selectedNetwork = value.chainId
    pubsub.publish('chain-change', value.chainId ?? undefined)
  }

  get property() {
    return this._chain
  }

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

  @query('import-hero') importHero

  @query('disconnect-hero') disconnectHero

  @query('swap-hero') swapHero

  @query('token-selector') tokenSelector

  @query('token-input[action="sell"]') tokenInputEl

  @query('token-input[action="buy"]') tokenOutputEl

  @query('notification-pane') notificationPane

  #networkchange = ({ detail }: CustomEvent) => {
    this.selectedNetwork = detail
    if (globalThis.provider && detail > 0) {
      this.#tokenInputChange({ detail: this.shadowRoot.querySelector('token-input').amount })
    }
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
    } else if (detail === '0' || detail === '0.' || Number(detail) === 0 || isNaN(Number(detail))) {
      return
    }
    const tokenInput = this.tokenInputEl.selected
    const tokenOutput = this.tokenOutputEl.selected
    const amount = detail

    let balance

    if (tokenInput.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      balance = ethers.formatUnits(await provider.getBalance(this.selectedAccount))
    } else {
      const contract = new ethers.Contract(tokenInput.address, ERC20, provider)

      balance = formatUnits(await contract.balanceOf(this.selectedAccount))
    }

    if (Number(balance) < Number(amount)) {
      document.dispatchEvent(new CustomEvent('swap-balance-to-low', { detail: balance }))
    } else {
      const response = await fetch(
        `https://swap.leofcoin.org/quote?tokenIn=${tokenInput.address}&tokenOut=${
          tokenOutput.address
        }&amount=${parseUnits(amount, 18)}&chainId=${this.chain.chainId}`
      )
      const quote = await response.json()
      console.log(quote)

      const units = formatUnits(quote.dstAmount)
      console.log(units)

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

  #epochTimeout = () => {
    document.dispatchEvent(new CustomEvent('epoch', { detail: Date.now() }))
    setTimeout(() => {
      this.#epochTimeout()
    }, 1000)
  }

  #slippageInput = () => {
    this.slippage = this.shadowRoot?.querySelector('md-slider').value
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    document.addEventListener('token-selector-change', this.tokenSelectorChange)
    document.addEventListener('accountsChange', this.#accountchange)
    document.addEventListener('networkChange', this.#networkchange)
    document.addEventListener('token-input-change', this.#tokenInputChange)
    document.addEventListener('swap-balance-to-low', this.#swapBalanceToLow)
    this.shadowRoot?.querySelector('md-slider').addEventListener('input', this.#slippageInput)
    this.#epochTimeout()
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
        overflow: hidden;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        color: var(--md-sys-color-on-surface);
        position: absolute;
      }

      custom-icon {
        --custom-icon-color: var(--on-surface-1);
      }

      .title {
        color: var(--accent);
      }

      .flex {
        display: flex;
        flex: 1;
      }
      .row {
        align-items: center;
        display: flex;
        width: 100%;
      }

      md-slider {
        margin: 8px 0;
        --md-slider-active-track-color: var(--special-accent);
        --md-slider-pressed-handle-color: var(--accent);
        --md-slider-handle-color: var(--accent);
        --md-slider-label-container-color: var(--accent);
        --md-slider-focus-handle-color: var(--on-accent);

        --md-slider-hover-handle-color: var(--accent);
        --md-slider-pressed-state-layer-color: var(--accent);
        --md-slider-hover-state-layer-color: var(--accent);
        width: 100%;
      }

      img {
        height: 48px;
        border-radius: var(--border-radius-extra-large);
      }
      header {
        display: flex;
        position: absolute;
        top: 0;
        height: 56px;
        padding: 6px 12px;
        box-sizing: border-box;
        width: 100%;
        max-width: 1200px;
        align-items: center;
        height: 64px;
      }
      .slippage-input {
        width: fit-content;
        max-width: 28px;
        background-color: transparent;
        border: none;
        color: var(--on-surface-1);
      }
      .slippage {
        margin-top: 6px;
        display: flex;
        flex-direction: column;
        padding: 24px;
        box-sizing: border-box;
        background-color: var(--surface-2);
        color: var(--on-surface-2);
        border-radius: var(--border-radius);
      }
      h4 {
        margin: 0;
        color: var(--on-surface-1);
      }
      input {
        color: var(--on-surface);
      }
      @media (max-width: 959px) {
        swap-tokens,
        connect-wallet {
          position: fixed;
          bottom: 12px;
          right: 12px;
          left: 12px;
          box-sizing: border-box;
          width: -webkit-fill-available;
        }
      }
    `
  ]

  /**
   * add native, babyfox and imported tokens to tokenlist
   */
  #appendTokenList(tokens) {
    const native = getNativeCoin(this.chain.chainId)
    tokens[native.symbol] = native
    tokens[this.babyfox.symbol] = this.babyfox

    const imported = localStorage.getItem('imported-tokens')
    if (imported) {
      const importedTokens = JSON.parse(imported)
      for (const token of Object.values(importedTokens)) {
        tokens[token.symbol] = token
      }
    }
  }

  async sellTokenSelect() {
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
    const tokens = await this.#tokenList.getList()
    const onselect = async ({ detail }) => {
      let balance
      if (detail.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
        balance = ethers.formatUnits(await provider.getBalance(this.selectedAccount))
      } else {
        const contract = new ethers.Contract(detail.address, ERC20, provider)

        balance = ethers.formatUnits((await contract.balanceOf(this.selectedAccount)).toString())
      }
      this.tokenOutputEl.balance = balance
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

  showImportHero(address) {
    this.importHero.address = address
    this.importHero.shown = true
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
    this.swapHero.slippage = this.slippage
    this.swapHero.info = this.swapInfo
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
          <span name="account_balance">@symbol-account_balance</span>
          <span name="cloud">@symbol-cloud</span>
          <span name="delete">@symbol-delete</span>
          <span name="swap_vert">@symbol-swap_vert</span>
          <span name="keyboard_arrow_down">@symbol-keyboard_arrow_down</span>
          <span name="keyboard_arrow_up">@symbol-keyboard_arrow_up</span>
          <span name="cancel">@symbol-cancel</span>
          <span name="error">@symbol-error</span>
          <span name="menu_open">@symbol-menu_open</span>
          <span name="notifications">@symbol-notifications</span>
        </template>
      </custom-icon-set>
      <header>
        <img src="./assets/logo.webp" />
        <span class="flex"></span>
        <account-element></account-element>
        <md-icon-button
          data-action="toggle-notification-pane"
          @click=${() => {
            this.notificationPane.open = !this.notificationPane.open
          }}
          ><custom-icon icon="notifications"></custom-icon
        ></md-icon-button>
      </header>
      <!--
      <img src="./assets/babyfox.webp" />
      <img src="./assets/FoxSwap.png" />
      -->

      <token-selector></token-selector>
      <import-hero></import-hero>
      <connect-hero></connect-hero>
      <notification-manager></notification-manager>
      <notification-pane></notification-pane>
      <disconnect-hero></disconnect-hero>
      <swap-hero></swap-hero>

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

        <section class="slippage">
          <h4>slippage</h4>
          <span class="row">
            <md-slider
              ticks
              max="50"
              min="1"
              value=${this.slippage}
              labeled
              step="0.5"></md-slider>
            <input
              class="slippage-input"
              value=${this.slippage} />
            %
          </span>
        </section>

        ${this.selectedAccount
          ? html`<swap-tokens ?disabled=${!this.swapInfo}></swap-tokens>`
          : html`<connect-wallet></connect-wallet>`}
      </hero-element>
    `
  }
}
