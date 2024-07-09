import { LitElement, html, css, PropertyValueMap, PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

@customElement('token-input')
export class TokenInput extends LitElement {
  @property({ attribute: true }) action

  @property() selected

  @property() amount

  @property({ attribute: 'non-interactive', type: Boolean, reflect: true }) nonInteractive

  @property({ attribute: 'no-input', type: Boolean, reflect: true }) noInput

  @property({ type: Boolean, attribute: 'error-shown', reflect: true }) errorShown

  @property() errorMessage

  @query('input') input: HTMLInputElement

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('errorMessage')) {
      this.errorShown = true
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    if (!this.nonInteractive) this.shadowRoot?.querySelector('input')?.addEventListener('input', this.#input)
  }

  #input = () => {
    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.errorShown = false
      this.amount = this.shadowRoot?.querySelector('input').value
      document.dispatchEvent(new CustomEvent('token-input-change', { detail: this.amount }))
    }, 300)
  }

  reset() {
    this.input.value = null
    this.errorShown = false
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

      :host(:not([non-interactive]):hover) {
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
      .row {
        display: flex;
        width: 100%;
        align-items: center;
      }

      :host([non-interactive]) * {
        pointer-events: none;
      }

      .error-message custom-icon {
        margin-right: 12px;
        --custom-icon-color: var(--error);
      }

      .error-message {
        align-items: center;
        display: flex;
        bottom: 6px;
        transform: scale(0);
        position: absolute;

        color: var(--error);
      }

      :host([error-shown]) .error-message {
        transform: scale(1);
      }

      :host([no-input]) input {
        pointer-events: none;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      /* Firefox */
      input[type='number'] {
        -moz-appearance: textfield;
      }
    `
  ]

  render() {
    return html`
      <md-elevation level="1"></md-elevation>
      <span>${this.action}</span>
      <span class="row">
        <input placeholder="0" / type="number" value=${this.amount ?? ''}>
        ${this.nonInteractive
          ? html`<img src=${this.selected?.icon?.color} />`
          : html`<token-select
              .selected=${this.selected}
              @token-select=${() => this.dispatchEvent(new CustomEvent('token-select'))}></token-select>`}
      </span>
      <span class="error-message"><custom-icon icon="error"></custom-icon> ${this.errorMessage} </span>
    `
  }
}
