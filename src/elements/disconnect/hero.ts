import { LitElement, PropertyValueMap, css, html } from 'lit'
import '@material/web/button/filled-button.js'
import '@material/web/iconbutton/icon-button.js'
import '@vandeurenglenn/lit-elements/icon.js'
import { customElement, property } from 'lit/decorators.js'

@customElement('disconnect-hero')
export default class DisconnectHero extends LitElement {
  selectedWalletProvider
  walletConnected

  @property({ reflect: true, type: Boolean }) shown

  async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    this.shadowRoot.addEventListener('click', this.#click.bind(this))
    this.selectedWalletProvider = localStorage.getItem('selectedWalletProvider')
    this.walletConnected = localStorage.getItem('wallet-connected')
    const els = this.shadowRoot?.querySelectorAll('md-filled-button')

    const sheet = new CSSStyleSheet()
    for (const el of els) {
      const elemStyleSheets = el.shadowRoot.adoptedStyleSheets
      sheet.replaceSync('.button {display: flex;} .label {width: 100%;}')
      el.shadowRoot.adoptedStyleSheets = [...elemStyleSheets, sheet]
    }
  }

  async #click(event) {
    console.log(event.target)

    if (event.target.dataset.action === 'close') this.shown = false
    else if (event.target.dataset.action === 'disconnect') {
      this.shown = false
      document.querySelector('app-shell').disconnect()
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
        max-height: 322px;
        height: 100%;
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

      .question {
        font-weight: 500;
        font-size: 18px;
      }
    `
  ]

  render() {
    return html`
      <div style="height: 181px;"></div>
      <hero-element>
        <span class="header">
          <h4>Disconnect</h4>
          <span class="flex"></span>
          <md-icon-button data-action="close"><custom-icon icon="cancel"></custom-icon></md-icon-button>
        </span>
        <p class="question">are you sure you want to disconnect?</p>
        <span class="flex"></span>
        <small>note that when connected using metamask to fully disconnect you need todo that in the ui</small>

        <span class="flex"></span>
        <md-filled-button data-action="disconnect">disconnect</md-filled-button>
      </hero-element>
    `
  }
}
