import { LitElement, html, css, PropertyValueMap } from 'lit'
import { consume, createContext } from '@lit/context'
import { customElement, property, query } from 'lit/decorators.js'
import './../array-repeat.js'
import '@material/web/button/filled-tonal-button.js'
import './hero.js'

@customElement('token-selector')
export class TokenSelector extends LitElement {
  @consume({ context: createContext('tokens') })
  tokens

  @property({ attribute: 'default-selected' }) defaultSelected

  @property() selected
  @property({ reflect: true }) shown

  @query('input') input
  @query('array-repeat') arrayRepeat

  static styles = [
    css`
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
      }

      .item {
        display: flex;
        align-items: center;
        padding: 12px;
        box-sizing: border-box;
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

      input {
        background-color: var(--surface-2);
        padding: 12px;
        box-sizing: border-box;
        margin: 12px;
        height: 64px;
        border: 1px solid var(--surface-1);
        border-radius: var(--border-radius);
      }
    `
  ]

  #change = () => {
    console.log('vl')

    if (!this.tokensBackup) this.tokensBackup = JSON.parse(JSON.stringify(this.tokens))

    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      console.log(Object.values(this.tokensBackup).filter((token) => token.name.includes(this.input.value)))

      this.arrayRepeat.reset()
      this.tokens = Object.values(this.tokensBackup).filter(
        (token) => token.name.toLowerCase().includes(this.input.value) || token.address.includes(this.input.value)
      )
      if (this.tokens.length === 0) {
        alert('import')
      }
      this.requestUpdate()
    }, 100)
  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('defaultSelected') && this.defaultSelected) {
      this.selected = this.defaultSelected
    }
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    this.input.addEventListener('input', this.#change)
  }

  show() {
    this.shown = true
  }

  render() {
    return html`
      <hero-element>
        <input
          type="search"
          placeholder="search/import token"
          autocomplete="on" />
        ${this.tokens
          ? html`<array-repeat
              .items=${this.tokens}
              name-space="item">
              <template
                ><span class="item">
                  <img
                    src="[[item.icon.color]]"
                    loading="lazy" />
                  <span class="column">
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
