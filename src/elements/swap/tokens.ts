import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/button/filled-button.js'
@customElement('swap-tokens')
export class SwapTokens extends LitElement {
  static styles = [
    css`
      * {
        text-transform: capitalize;
      }
      :host {
        display: block;
      }

      md-filled-button {
        margin-top: 12px;
        width: 100%;
        height: 56px;
        font-size: 20px;
        font-weight: 600;
        border-radius: var(--border-radius);
        --md-filled-button-container-color: var(--special-accent);
        --md-filled-button-label-text-color: var(--on-special-accent);
        --md-filled-button-hover-label-text-color: var(--on-special-accent);
        --md-filled-button-pressed-label-text-color: var(--on-special-accent);
        --md-filled-button-active-label-text-color: var(--on-special-accent);
        --md-filled-button-focus-label-text-color: var(--on-special-accent);
      }

      :host([disabled]) {
        pointer-events: none;
      }

      :host([disabled]) md-filled-button {
        --md-filled-button-container-color: var(--special-accent-disabled);
        --md-filled-button-label-text-color: var(--on-special-accent-disabled);
      }
    `
  ]

  render() {
    return html` <md-filled-button @click=${() => document.querySelector('app-shell').showSwapHero()}
      >swap</md-filled-button
    >`
  }
}
