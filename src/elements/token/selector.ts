import { LitElement, html, css, PropertyValueMap } from 'lit'
import { consume, createContext } from '@lit/context'
import { customElement, property, query } from 'lit/decorators.js'
import './../../array-repeat.js'
import '@material/web/button/filled-tonal-button.js'
import './../hero.js'

@customElement('token-selector')
export class TokenSelector extends LitElement {
  @consume({ context: createContext('tokens'), subscribe: true })
  tokens

  @property() selected
  @property({ reflect: true, type: Boolean }) shown

  @query('input') input
  @query('array-repeat') arrayRepeat

  static styles = [
    css`
      * {
        text-transform: capitalize;
      }
      :host {
        position: absolute;
        display: flex;
        flex-direction: column;
        opacity: 0;
        pointer-events: none;
        inset: 0;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }

      hero-element {
        max-height: 640px;
        height: 100%;
      }

      .item {
        display: flex;
        align-items: center;
        padding: 12px;
        box-sizing: border-box;
        cursor: pointer;
      }

      img,
      .column {
        pointer-events: auto;
      }

      .column {
        display: flex;
        flex-direction: column;
      }

      img {
        height: 32px;
        width: 32px;
        margin-right: 16px;
      }

      :host([shown]) {
        opacity: 1;
        pointer-events: auto;
      }
      ::-webkit-scrollbar {
        width: 8px;
        border-radius: var(--border-radius-extra-large);
        background-color: var(--md-sys-color-surface-container-highest);
      }
      ::-webkit-scrollbar-thumb {
        background: var(--md-sys-color-on-surface-container-highest);
        border-radius: var(--border-radius-extra-large);
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.5) inset;
      }

      .flex {
        flex: 1;
      }

      .header {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 6px 6px 12px 12px;
        border-bottom: 1px solid var(--surface-2);
        font-weight: 700;
        color: var(--on-surface-2);
      }

      h4 {
        margin: 0;
      }

      input {
        background-color: var(--surface-2);
        padding: 12px;
        box-sizing: border-box;
        margin: 24px;
        height: 64px;
        border: 1px solid var(--surface-1);
        border-radius: var(--border-radius);
      }

      custom-icon {
        --custom-icon-color: var(--on-surface-2);
      }

      input {
        color: var(--on-surface-2);
      }
    `
  ]

  #change = () => {
    if (!this.tokensBackup) this.tokensBackup = JSON.parse(JSON.stringify(this.tokens))

    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      const value = this.input.value
      this.arrayRepeat.reset()
      this.tokens = Object.values(this.tokensBackup).filter(
        (token) =>
          token.name.toLowerCase().includes(value) ||
          token.symbol.toLowerCase().includes(value) ||
          token.address.includes(value)
      )
      if (this.tokens.length === 0 && value.startsWith('0x') && value.length === 42) {
        document.querySelector('app-shell').showImportHero(value)
      }
      this.requestUpdate()
    }, 100)
  }

  #click = ({ target }: CustomEvent) => {
    const action = target.dataset.action
    if (action) {
      switch (action) {
        case 'close':
          this.shown = false
          break
        case 'select':
          this.shown = false
          this.dispatchEvent(new CustomEvent('select', { detail: this.tokens[target.dataset.symbol] }))
          break
        default:
          break
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.input.addEventListener('input', this.#change)
    this.shadowRoot.addEventListener('click', this.#click)
  }

  show() {
    this.shown = true
  }

  render() {
    return html`
      <hero-element>
        <span class="header">
          <h4>Select Token</h4>
          <span class="flex"></span>
          <md-icon-button data-action="close"><custom-icon icon="cancel"></custom-icon></md-icon-button>
        </span>
        <input
          type="search"
          placeholder="search/import token"
          autocomplete="on" />
        ${this.tokens
          ? html`<array-repeat
              .items=${this.tokens}
              name-space="item">
              <template
                ><span
                  class="item"
                  data-action="select"
                  data-symbol="[[item.symbol]]">
                  <img
                    style="pointer-events: none;"
                    src="[[item.icon.color]]"
                    loading="lazy" />
                  <span
                    class="column"
                    style="pointer-events: none;">
                    <span class="name">[[item.name]]</span>
                    <span class="symbol">[[item.symbol]]</span>
                  </span>
                </span>
              </template>
            </array-repeat>`
          : ''}
      </hero-element>
    `
  }
}
