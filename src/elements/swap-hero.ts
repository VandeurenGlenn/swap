import { LitElement, PropertyValueMap, css, html } from 'lit'
import '@material/web/button/filled-button.js'
import '@material/web/iconbutton/icon-button.js'
import '@vandeurenglenn/lit-elements/icon.js'
import { customElement, property } from 'lit/decorators.js'
import './token-input.js'

@customElement('swap-hero')
export default class SwapHero extends LitElement {
  @property() inputToken

  @property() outputToken

  @property({ reflect: true, type: Boolean }) shown

  async firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>) {
    this.shadowRoot.addEventListener('click', this.#click.bind(this))
  }

  async #click(event) {
    console.log(event.target)
    if (event.target.dataset.action === 'close') this.shown = false
  }

  static styles = [
    css`
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

      custom-icon {
        --custom-icon-color: var(--on-surface-2);
      }

      hero-element {
        margin: 0;
        background: var(--surface-1);
        padding: 12px;
        box-sizing: border-box;
        max-height: 480px;
      }

      h4 {
        margin: 0;
      }

      .header {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 12px 12px 12px 12px;
        border-bottom: 1px solid var(--surface-2);
        margin-bottom: 24px;
        font-weight: 700;
        color: var(--on-surface-2);
      }

      md-filled-button {
        font-weight: 700;
        height: 56px;
        cursor: pointer;
        --md-filled-button-container-color: var(--accent);
        --md-filled-button-label-text-color: var(--on-accent);
        --md-filled-button-hover-label-text-color: var(--on-accent);
        --md-filled-button-pressed-label-text-color: var(--on-accent);
        --md-filled-button-active-label-text-color: var(--on-accent);
        --md-filled-button-focus-label-text-color: var(--on-accent);
        border-radius: var(--border-radius);
        width: 100%;
      }

      :host([shown]) {
        pointer-events: auto;
        opacity: 1;
      }

      .flex {
        display: flex;
        flex: 1;
      }

      token-input[action='sell'] {
        margin-bottom: 10px;
      }
    `
  ]

  render() {
    return html`
      <div style="height: 181px;"></div>
      <hero-element>
        <span class="header">
          <h4>swap quote</h4>
          <span class="flex"></span>
          <md-icon-button data-action="close"><custom-icon icon="cancel"></custom-icon></md-icon-button>
        </span>
        <token-input
          action="sell"
          .selected=${this.inputToken}
          non-interactive></token-input>
        <token-input
          action="buy"
          .selected=${this.outputToken}
          non-interactive></token-input>
        <span class="flex"></span>
        <md-filled-button>confirm</md-filled-button>
      </hero-element>
    `
  }
}
