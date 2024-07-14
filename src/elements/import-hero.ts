import { LitElement, PropertyValueMap, PropertyValues, css, html } from 'lit'
import '@material/web/button/filled-button.js'
import '@material/web/iconbutton/icon-button.js'
import '@vandeurenglenn/lit-elements/icon.js'
import { customElement, property } from 'lit/decorators.js'
import * as ethers from './../../node_modules/ethers/dist/ethers.min.js'
import ERC20 from '../ABI/ERC20.js'

@customElement('import-hero')
export default class ImportHero extends LitElement {
  @property({ reflect: true, type: Boolean }) shown

  @property() address
  @property() name
  @property() symbol
  @property() logo

  #click = ({ target }: CustomEvent) => {
    const action = target.dataset.action
    if (action === 'close') this.shown = false
    else if (action === 'import') {
      const imported = localStorage.getItem('imported-tokens')
      if (imported) {
        const importedTokens = JSON.parse(imported)
        importedTokens[this.symbol] = {
          address: this.address,
          symbol: this.symbol,
          name: this.name,
          icon: {
            color: 'https://raw.githubusercontent.com/CoinsSwap/token-list/main/build/icons/color/generic.svg'
          }
        }
      } else {
        const imported = {}
        imported[this.symbol] = {
          address: this.address,
          symbol: this.symbol,
          name: this.name,
          icon: {
            color: 'https://raw.githubusercontent.com/CoinsSwap/token-list/main/build/icons/color/generic.svg'
          }
        }

        localStorage.setItem('imported-tokens', JSON.stringify(imported))
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.shadowRoot?.addEventListener('click', this.#click)
  }

  protected async willUpdate(_changedProperties: PropertyValues) {
    if (_changedProperties.has('address')) {
      const contract = new ethers.Contract(this.address, ERC20, await provider.getSigner())
      this.symbol = await contract.symbol()
      this.name = await contract.name()
      this.logo = 'https://raw.githubusercontent.com/CoinsSwap/token-list/main/build/icons/color/generic.svg'
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
        max-height: 520px;
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

      .container {
        box-sizing: border-box;
        padding: 12px;
      }

      small {
        margin-bottom: 24px;
        margin-left: 12px;
      }
    `
  ]

  render() {
    return html`
      <hero-element>
        <span class="header">
          <h4>import</h4>
          <span class="flex"></span>
          <md-icon-button data-action="close"><custom-icon icon="cancel"></custom-icon></md-icon-button>
        </span>
        <div class="container">
        <img src=${this.logo}></img>
          <h3>contract</h3>

          <strong>${this.address}</strong>

          <h3>name</h3>

          <strong>${this.name}</strong>

          <h3>symbol</h3>

          <strong>${this.symbol}</strong>
        </div>

        <span class="flex"></span>
        <small>note: please make sure to do your research!</small>
        <md-filled-button data-action="import">import</md-filled-button>
      </hero-element>
    `
  }
}
