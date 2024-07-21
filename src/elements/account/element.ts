import { LitElement, html, css, PropertyValueMap, PropertyValues } from 'lit'
import { consume, createContext } from '@lit/context'
import { customElement, property } from 'lit/decorators.js'
import '../../array-repeat.js'
import '@material/web/button/filled-button.js'
import '@vandeurenglenn/lit-elements/selector.js'
import '@vandeurenglenn/lit-elements/icon.js'
import './item.js'
import './../notification/manager.js'
import { NotificationManager } from './../notification/manager.js'
declare global {
  var notificationManager: NotificationManager
}
@customElement('account-element')
export class AccountElement extends LitElement {
  @consume({ context: createContext('selected-account'), subscribe: true })
  @property()
  selectedAccount

  @property({ reflect: true, type: Boolean }) open

  protected firstUpdated(_changedProperties: PropertyValues): void {
    globalThis.notificationManager = this.shadowRoot?.querySelector('notification-manager') as NotificationManager
  }

  static styles = [
    css`
      * {
        text-transform: capitalize;
      }
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
        width: 240px;
        transform: translateY(-100%);
        background-color: var(--surface-1);
        border-radius: var(--border-radius-large);
        transition: transform ease-out 240ms, opacity ease-out 60ms;
        z-index: 3;
        max-height: calc(100% - 80px);
      }

      :host([open]) .pane {
        transform: translateY(0);
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

      .hoverable {
        user-select: none;
        border-radius: var(--border-radius);
        box-sizing: border-box;
        padding: 0 6px 12px 6px;
      }

      .hoverable:hover {
        background-color: var(--surface-2);
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
        margin-right: 12px;
        color: var(--on-surface-2);
      }

      custom-icon {
        --custom-icon-color: var(--on-surface-2);
      }

      .activity {
        overflow-y: auto;
        box-sizing: border-box;
        padding: 0 6px 12px 6px;
      }
    `
  ]

  render() {
    return html`
      <md-filled-button
        @click=${() =>
          this.selectedAccount ? (this.open = !this.open) : document.querySelector('app-shell').showConnectHero()}>
        <span class="row">
          ${this.selectedAccount
            ? html` <account-item .account=${this.selectedAccount}></account-item> `
            : html`<strong>connect</strong>`}
        </span>
      </md-filled-button>

      <span class="pane">
        <section class="hoverable">
          <span class="row"
            ><custom-icon icon="cloud"></custom-icon><span class="flex"></span>
            <h3>select network</h3></span
          >
          <network-select></network-select>
        </section>

        <span class="flex"></span>
        <md-filled-button @click=${() => document.querySelector('app-shell').showDisconnectHero()}
          >disconnect</md-filled-button
        >
      </span>
    `
  }
}
