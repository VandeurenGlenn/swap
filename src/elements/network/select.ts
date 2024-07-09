import { LitElement, html, css, PropertyValueMap, PropertyValues } from 'lit'
import { consume, createContext } from '@lit/context'
import { customElement, property } from 'lit/decorators.js'
import '../../array-repeat.js'
import '@material/web/button/filled-button.js'
import '@vandeurenglenn/lit-elements/selector.js'
import '@vandeurenglenn/lit-elements/icon.js'
import '@material/web/menu/menu-item.js'
import { map } from 'lit/directives/map.js'
import { changeNetwork, networks, supportedNetworks } from '../../api.js'

@customElement('network-select')
export class NetworkSelect extends LitElement {
  @consume({ context: createContext('selected-network'), subscribe: true })
  @property()
  selectedNetwork

  @property({ reflect: true, type: Boolean }) open

  async change(chainId) {}

  #changeNetwork = ({ detail }) => {
    console.log({ detail })

    changeNetwork(detail)
  }

  static styles = [
    css`
      :host {
        display: flex;
        position: relative;
        flex-direction: column;
      }

      md-filled-button {
        --md-filled-button-container-color: var(--surface-1);
        --md-filled-button-label-text-color: var(--on-special-accent);
        --md-filled-button-hover-label-text-color: var(--on-special-accent);
        --md-filled-button-pressed-label-text-color: var(--on-special-accent);
        --md-filled-button-active-label-text-color: var(--on-special-accent);
        --md-filled-button-focus-label-text-color: var(--on-special-accent);
        --md-filled-button-leading-space: 14px;
        --md-filled-button-trailing-space: 14px;
        --md-filled-button-with-trailing-icon-leading-space: 6px;
        height: 56px;
      }

      strong {
        color: var(--on-special-accent);
      }

      custom-icon {
        margin-left: 12px;
        --custom-icon-color: var(--on-special-accent);
      }

      .row {
        display: flex;
        align-items: center;
        width: 100%;
        width: 194px;
      }

      .flex {
        display: flex;
        flex: 1;
      }

      img {
        height: 36px;
        margin-right: 12px;
      }

      .drop {
        height: 0px;
        opacity: 0;
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: var(--surface-2);
        border-radius: var(--border-radius-large);
        box-sizing: border-box;
      }

      :host([open]) .drop {
        height: auto;
        opacity: 1;
        padding: 12px;
        margin: 12px 0;
      }

      custom-selector {
        width: 100%;
      }

      .item {
        display: flex;
        align-items: center;
        padding: 12px 12px;
        color: var(--on-surface-1);
        cursor: pointer;
      }

      .item:hover {
        border-radius: var(--border-radius-large);
        background: var(--special-accent);
        color: var(--on-special-accent);
      }
    `
  ]

  render() {
    return html`
      <md-filled-button
        @click=${() => (this.open = !this.open)}
        style="width: 100%">
        <span class="row">
          ${this.selectedNetwork
            ? html`
                <img src=${networks[this.selectedNetwork].logo} />
                <strong>${networks[this.selectedNetwork].name}</strong>
              `
            : html`<strong style="margin-left: 6px;">select network</strong>`}
          <span class="flex"></span>
          <custom-icon icon=${this.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}></custom-icon>
        </span>
      </md-filled-button>

      <span class="drop">
        <custom-selector
          @selected=${this.#changeNetwork}
          attr-for-selected="data-chain-id">
          ${map(
            Object.entries(networks),
            ([chainId, network]) =>
              html`<span
                data-chain-id=${chainId}
                class="item"
                ><img src=${network.logo} />${network.name}</span
              >`
          )}
        </custom-selector>
      </span>
    `
  }
}
