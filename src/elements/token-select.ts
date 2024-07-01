import { LitElement, html, css, PropertyValueMap } from 'lit'
import { consume, createContext } from '@lit/context'
import { customElement, property } from 'lit/decorators.js'
import '../array-repeat.js'
import '@material/web/button/filled-button.js'

import '@vandeurenglenn/lit-elements/icon.js'

@customElement('token-select')
export class TokenSelect extends LitElement {
  @property() selected

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
    `
  ]

  render() {
    return html`
      <md-filled-button @click=${() => this.dispatchEvent(new CustomEvent('token-select'))}>
        <span class="row">
          ${this.selected
            ? html`
                <img
                  src=${this.selected.icon.color}
                  slot="icon" />
                <strong>${this.selected.symbol}</strong>
              `
            : html`<strong style="margin-left: 6px;">select token</strong>`}
          <custom-icon icon="keyboard_arrow_down"></custom-icon>
        </span>
      </md-filled-button>
    `
  }
}
