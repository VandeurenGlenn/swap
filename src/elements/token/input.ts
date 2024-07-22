import { LitElement, html, css, PropertyValueMap, PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'

@customElement('token-input')
export class TokenInput extends LitElement {
  @property({ attribute: true }) action

  @property() selected

  @property() amount

  @property() balance

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
      document.dispatchEvent(new CustomEvent('token-input-change', { detail: this.amount.replace(',', '.') }))
    }, 300)
  }

  reset() {
    this.errorShown = false
    this.amount = null
    this.input.value = null
  }

  static styles = [
    css`
      * {
        font-weight: 700;
        line-height: 20px;
        text-transform: capitalize;
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
        font-size: 22px;
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

      .error-message,
      .balance {
        align-items: center;
        display: flex;
        bottom: 6px;
        transform: scale(0);
        position: absolute;

        color: var(--error);
      }

      :host([error-shown]) .error-message,
      :host(:not([error-shown])) .balance {
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

      .balance custom-icon {
        --custom-icon-color: var(--on-surface-1);
        height: 20px;
        margin-right: 6px;
      }

      .balance {
        color: var(--on-surface-1);
      }
    `
  ]

  render() {
    return html`
      <md-elevation level="1"></md-elevation>
      <span>${this.action}</span>
      <span class="row">
        <input
          maxlength="19"
          placeholder="0"
          .value=${this.amount ?? ''} />
        ${this.nonInteractive
          ? html`<img src=${this.selected?.icon?.color} />`
          : html`<token-select
              .selected=${this.selected}
              @token-select=${() => this.dispatchEvent(new CustomEvent('token-select'))}></token-select>`}
      </span>
      ${this.errorShown
        ? html`<span class="error-message"><custom-icon icon="error"></custom-icon> ${this.errorMessage} </span>`
        : this.balance
        ? html`<small>${this.balance}</small>`
        : ''}
    `
  }
}
