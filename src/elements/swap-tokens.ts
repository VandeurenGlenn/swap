import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/button/filled-button.js'
@customElement('swap-tokens')
export class SwapTokens extends LitElement {
  static styles = [
    css`
      :host {
        margin-top: 12px;
        display: block;
        width: 100%;
      }

      md-filled-button {
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
    `
  ]

  render() {
    return html` <md-filled-button @click=${() => document.querySelector('app-shell').showSwapHero()}
      >swap</md-filled-button
    >`
  }
}
