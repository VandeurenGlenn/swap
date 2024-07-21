import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@vandeurenglenn/lit-elements/icon.js'
import '@material/web/iconbutton/filled-icon-button.js'

@customElement('token-input-swap')
export class TokenInputSwap extends LitElement {
  static styles = [
    css`
      :host {
        display: flex;

        z-index: 1;
        position: relative;
        height: 6px;
        width: 100%;
        justify-content: center;
      }
      .container {
        display: block;
        border-radius: 50%;
        padding: 6px;
        background-color: var(--surface-1);
        margin: -18px auto;
      }

      md-filled-icon-button {
        --md-filled-icon-button-container-color: var(--accent-1);
      }

      custom-icon {
        --custom-icon-color: var(--on-accent-1);
      }
    `
  ]

  render() {
    return html`<span class="container">
      <md-filled-icon-button> <custom-icon icon="swap_vert"></custom-icon></md-filled-icon-button>
    </span>`
  }
}
