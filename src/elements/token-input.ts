import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('token-input')
export class TokenInput extends LitElement {
  @property({ attribute: true }) action

  @property() selected

  static styles = [
    css`
      * {
        font-weight: 700;
        line-height: 20px;
      }

      :host {
        display: flex;
        flex-direction: column;
        padding: 24px;
        box-sizing: border-box;
        background-color: var(--surface-2);
        color: var(--on-surface-2);
        border-radius: var(--border-radius);
        position: relative;
      }

      input {
        height: 44px;
        width: 100%;
        border: none;
        outline: none;
        font-size: 32px;
        background-color: transparent;
        color: var(--on-surface-1);
      }

      .row {
        display: flex;
        width: 100%;
        align-items: center;
      }
    `
  ]

  render() {
    return html`
      <md-elevation level="1"></md-elevation>
      <span>${this.action}</span>
      <span class="row">
        <input placeholder="0" />
        <token-select
          .selected=${this.selected}
          @token-select=${() => this.dispatchEvent(new CustomEvent('token-select'))}></token-select>
      </span>
    `
  }
}
