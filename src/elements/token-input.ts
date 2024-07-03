import { LitElement, html, css, PropertyValueMap } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('token-input')
export class TokenInput extends LitElement {
  @property({ attribute: true }) action

  @property() selected

  @property({ attribute: 'non-interactive', type: Boolean, reflect: true }) nonInteractive

  @property({ type: Boolean, attribute: 'is-svg', reflect: true }) isSVG

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (this.selected?.icon?.color) {
      this.isSVG = this.selected?.icon?.color.endsWith('.svg')
    }
  }
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

      :host(:hover:not([non-interactive])) {
        background-color: rgb(27 27 27 / 75%);
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

      img {
        height: 32px;
        width: 32px;
      }

      :host([is-svg]) img {
        width: 48px;
        height: 48px;
        margin-right: -8px;
      }

      .row {
        display: flex;
        width: 100%;
        align-items: center;
      }

      :host([non-interactive]) * {
        pointer-events: none;
      }
    `
  ]

  render() {
    return html`
      <md-elevation level="1"></md-elevation>
      <span>${this.action}</span>
      <span class="row">
        <input placeholder="0" />
        ${this.nonInteractive
          ? html`<img src=${this.selected?.icon?.color} />`
          : html`<token-select
              .selected=${this.selected}
              @token-select=${() => this.dispatchEvent(new CustomEvent('token-select'))}></token-select>`}
      </span>
    `
  }
}
