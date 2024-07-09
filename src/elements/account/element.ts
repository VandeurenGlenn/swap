import { LitElement, html, css, PropertyValueMap, PropertyValues } from 'lit'
import { consume, createContext } from '@lit/context'
import { customElement, property } from 'lit/decorators.js'
import '../../array-repeat.js'
import '@material/web/button/filled-button.js'
import '@vandeurenglenn/lit-elements/selector.js'
import '@vandeurenglenn/lit-elements/icon.js'
import './item.js'

@customElement('account-element')
export class AccountElement extends LitElement {
  @consume({ context: createContext('selected-account'), subscribe: true })
  @property()
  selectedAccount

  @property({ reflect: true, type: Boolean }) open

  async change(chainId) {}

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: row;
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

      custom-icon {
        margin-left: 12px;
        --custom-icon-color: var(--on-special-accent);
      }

      .row {
        display: flex;
        align-items: center;
      }

      img {
        height: 36px;
        margin-right: 12px;
      }

      .pane {
        opacity: 0;
        pointer-events: none;
        padding: 6px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 70px;
        right: 12px;
        bottom: 12px;
        width: 240px;
        transform: translateX(100%);
        background-color: var(--surface-1);
        border-radius: var(--border-radius-large);
        transition: transform ease-out 120ms, opacity ease-out 120ms;
        z-index: 3;
      }

      :host([open]) .pane {
        transform: translateX(0);
        opacity: 1;
        pointer-events: auto;
        transition: transform ease-in 120ms, opacity ease-in 260ms;
      }

      .avatar {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }

      .flex {
        flex: 1;
      }

      .item {
      }

      strong {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 132px;
      }

      network-select {
        width: 100%;
      }

      md-filled-button account-item {
        --account-item-max-width: 168px;
        --account-item-text-color: var(--on-special-surface);
      }

      h3 {
        margin-left: 12px;
        color: var(--on-surface-2);
      }
    `
  ]

  render() {
    return html`
      <md-filled-button @click=${() => (this.open = !this.open)}>
        <span class="row">
          ${this.selectedAccount
            ? html` <account-item .account=${this.selectedAccount}></account-item> `
            : html`<strong style="margin-left: 6px;">connect</strong>`}
        </span>
      </md-filled-button>

      <span class="pane">
        <h3>select network</h3>
        <network-select></network-select>
        <span class="flex"></span>
        <md-filled-button>disconnect</md-filled-button>
      </span>
    `
  }
}
