import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/progress/circular-progress.js'

@customElement('swap-status')
export class SwapStatus extends LitElement {
  @property({ type: Boolean, reflect: true }) shown

  @property() availableAllowance

  @property({ type: Boolean }) allowanceCheckDone

  @property({ type: Boolean }) needsApprove

  @property({ type: Boolean }) approved

  @property({ type: Boolean }) swapped

  @property({ type: Boolean }) swapError

  static styles = [
    css`
      * {
        text-transform: capitalize;
      }
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset: 0;
        background-color: var(--scrim);
        z-index: 2;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        opacity: 0;
      }

      :host([shown]) {
        pointer-events: auto;
        opacity: 1;
      }
      header {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 0 0 12px 12px;
        font-weight: 700;
        color: var(--on-surface-1);
      }

      .flex {
        display: flex;
        flex: 1;
      }

      .row {
        display: flex;
        width: 100%;
        align-items: center;
        padding-bottom: 12px;
        height: 60px;
      }

      .container {
        padding: 0 12px;
        box-sizing: border-box;
      }

      hero-element {
        margin: 0;
        background: var(--surface-1);
        padding: 6px 12px;
        box-sizing: border-box;
        max-height: 480px;
      }

      h2 {
        margin: 0;
      }

      h3 {
        color: var(--on-surface-2);
      }

      custom-icon {
        --custom-icon-color: var(--on-surface-1);
      }

      md-circular-progress {
        --md-circular-progress-active-indicator-color: var(--special-accent);
      }

      .error {
        margin-bottom: 6px;
        height: auto;
        color: var(--error);
      }
      .error custom-icon {
        margin-right: 6px;
        --custom-icon-color: var(--error);
      }
    `
  ]

  #allowanceCheck = ({ detail }: CustomEvent) => {
    this.shown = true
  }

  #allowanceCheckComplete = ({ detail }: CustomEvent) => {
    if (!isNaN(Number(detail))) {
      this.availableAllowance = detail
    }
    this.allowanceCheckDone = true
  }

  #approve = ({ detail }: CustomEvent) => {
    this.needsApprove = true
  }

  #approveComplete = ({ detail }: CustomEvent) => {
    this.approved = true
  }

  #swapComplete = ({ detail }: CustomEvent) => {
    this.swapped = true

    setTimeout(() => {
      this.reset()
      this.shown = false
    }, 1000)
  }

  reset() {
    this.availableAllowance = undefined
    this.allowanceCheckDone = undefined
    this.needsApprove = undefined
    this.approved = undefined
    this.swapped = undefined
    this.swapError = undefined
  }

  #swapCancel = () => {
    this.shown = false
    this.reset()
  }

  #close = () => {
    this.shown = false
    this.reset()
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    document.addEventListener('swap-allowance-start', this.#allowanceCheck)
    document.addEventListener('swap-allowance-end', this.#allowanceCheckComplete)
    document.addEventListener('swap-approve-start', this.#approve)
    document.addEventListener('swap-approve-end', this.#approveComplete)

    document.addEventListener('swap-end', this.#swapComplete)

    document.addEventListener('swap-cancel', () => this.#swapCancel)
    document.addEventListener('swap-error', () => (this.swapError = true))
  }

  #reset = () => {}

  render() {
    return html`
      <hero-element>
        <header>
          <h2>swapping</h2>
          <span class="flex"></span>
          <md-icon-button
            data-action="close"
            @click=${this.#close}
            ><custom-icon icon="cancel"></custom-icon
          ></md-icon-button>
        </header>
        <div class="container">
          <span class="row">
            <h3>checking allowance</h3>
            <span class="flex"></span>
            ${this.availableAllowance
              ? html`${this.allowanceCheckDone
                  ? html`<custom-icon icon="done"></custom-icon>`
                  : html`${this.availableAllowance}`}`
              : html`<md-circular-progress indeterminate></md-circular-progress>`}
          </span>

          ${this.needsApprove
            ? html`
                <span class="row">
                  <h3>approving</h3>
                  <span class="flex"></span>
                  ${this.approved
                    ? html`<custom-icon icon="done"></custom-icon>`
                    : html`<md-circular-progress indeterminate></md-circular-progress>`}
                </span>
              `
            : ''}

          <span class="row">
            <h3>swapping</h3>
            <span class="flex"></span>
            ${this.swapped
              ? html`<custom-icon icon="done"></custom-icon>`
              : html`<md-circular-progress indeterminate></md-circular-progress>`}
          </span>

          ${this.swapError
            ? html`
                <span class="row error">
                  <custom-icon icon="error"></custom-icon>
                  <h4>error: couldn't swap</h4>
                </span>
                <small>tip: try increasing your slippage</small>
              `
            : html``}
        </div>
      </hero-element>
    `
  }
}
