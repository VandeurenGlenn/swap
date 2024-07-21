import { LitElement, PropertyValueMap, css, html } from 'lit'
import '@material/web/button/filled-button.js'
import '@material/web/iconbutton/icon-button.js'
import '@vandeurenglenn/lit-elements/icon.js'
import { customElement, property } from 'lit/decorators.js'

@customElement('connect-hero')
export default class ConnectHero extends LitElement {
  selectedWalletProvider
  walletConnected

  @property({ reflect: true, type: Boolean }) shown

  async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    this.shadowRoot.addEventListener('click', this.#click.bind(this))
    this.selectedWalletProvider = localStorage.getItem('selectedWalletProvider')
    this.walletConnected = localStorage.getItem('wallet-connected')

    if (this.walletConnected === 'true' && this.selectedWalletProvider !== undefined) {
      await this.#connect()
    }
    const els = this.shadowRoot?.querySelectorAll('md-filled-button')

    const sheet = new CSSStyleSheet()
    for (const el of els) {
      const elemStyleSheets = el.shadowRoot.adoptedStyleSheets
      sheet.replaceSync('.button {display: flex;} .label {width: 100%;}')
      el.shadowRoot.adoptedStyleSheets = [...elemStyleSheets, sheet]
    }
  }

  async #connect() {
    const importee = await import('./../../connect.js')
    return importee.default(this.selectedWalletProvider)
  }

  async #click(event) {
    console.log(event.target)
    if (event.target.dataset.action === 'close') this.shown = false
    else if (event.target.dataset.provider) {
      this.selectedWalletProvider = event.target.dataset.provider
      localStorage.setItem('selectedWalletProvider', this.selectedWalletProvider)
      await this.#connect()
    }
  }

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset: 0;
        background-color: var(--scrim);
        z-index: 2;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        opacity: 0;
      }

      custom-icon {
        --custom-icon-color: var(--on-surface-2);
      }

      hero-element {
        margin: 0;
        background: var(--surface-1);
        padding: 12px;
        box-sizing: border-box;
      }

      h4 {
        margin: 0;
      }
      .header {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 12px 12px 12px 12px;
        border-bottom: 1px solid var(--surface-2);
        margin-bottom: 24px;
        font-weight: 700;
        color: var(--on-surface-2);
      }
      md-filled-button {
        font-weight: 700;
        cursor: pointer;
        --md-filled-button-container-color: var(--surface-2);
        --md-filled-button-label-text-color: var(--on-surface-2);
        --md-filled-button-hover-label-text-color: var(--on-surface-2);
        --md-filled-button-pressed-label-text-color: var(--on-surface-2);
        --md-filled-button-active-label-text-color: var(--on-surface-2);
        --md-filled-button-focus-label-text-color: var(--on-surface-2);
        border-radius: var(--border-radius);
        width: 100%;
        margin-bottom: 12px;
      }

      img {
        height: 40px;
        width: 40px;
      }
      :host([shown]) {
        pointer-events: auto;
        opacity: 1;
      }

      .flex {
        display: flex;
        flex: 1;
      }
      .wrapper {
        align-items: center;
        display: flex;
      }
    `
  ]

  render() {
    return html`
      <hero-element>
        <span class="header">
          <h4>Select Wallet Provider</h4>
          <span class="flex"></span>
          <md-icon-button data-action="close"><custom-icon icon="cancel"></custom-icon></md-icon-button>
        </span>
        <span class="flex"></span>
        <md-filled-button
          data-provider="walletConnect"
          class="walletConnect">
          <span class="wrapper">
            <img src="./assets/walletconnect.svg" />

            <span class="flex"></span>
            <strong>walletConnect</strong>
          </span>
        </md-filled-button>

        <md-filled-button
          data-provider="metamask"
          class="metamask">
          <span class="wrapper">
            <img src="./assets/MetaMask_Fox.svg" />
            <span class="flex"></span>
            metamask
          </span>
        </md-filled-button>
        <span class="flex"></span>
      </hero-element>
    `
  }
}
