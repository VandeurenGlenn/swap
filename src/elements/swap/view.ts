import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { guard } from 'lit/directives/guard.js'
import { getNativeCoin } from '../../api.js'
import { consume, createContext } from '@lit/context'

@customElement('swap-view')
export class SwapView extends LitElement {
  @property() chainId

  @consume({ context: createContext('selected-account'), subscribe: true })
  @property()
  selectedAccount

  @property({ type: Boolean, attribute: 'can-swap' }) canSwap

  static styles = [
    css`
      :host {
        display: block;
      }
    `
  ]

  render() {
    return html`<hero-element data-route="swap">
      ${guard(
        this.chainId,
        () => html`
          <token-input
            .selected=${getNativeCoin(this.chainId)}
            action="sell"
            @token-select=${(detail) =>
              document.dispatchEvent(new CustomEvent('sell-token-select', { detail }))}></token-input>
        `
      )}

      <token-input-swap
        data-action="swapInput"
        @click=${this.swapInput}></token-input-swap>
      ${guard(
        this.babyfox,
        () => html`
          <token-input
            no-input
            action="buy"
            @token-select=${(detail) => document.dispatchEvent(new CustomEvent('buy-token-select', { detail }))}
            .selected=${this.babyfox}></token-input>
        `
      )}
      ${this.selectedAccount
        ? html`<swap-tokens ?disabled=${!this.canSwap}></swap-tokens>`
        : html`<connect-wallet></connect-wallet>`}
    </hero-element> `
  }
}
