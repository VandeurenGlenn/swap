import { LitElement, html, css, PropertyValueMap } from 'lit'
import { consume, createContext } from '@lit/context'
import { customElement, property, query } from 'lit/decorators.js'
import '../array-repeat.js'
import '@material/web/button/filled-tonal-button.js'
import './hero.js'

@customElement('token-selector')
export class TokenSelector extends LitElement {
  @consume({ context: createContext('tokens'), subscribe: true })
  tokens

  @property({ attribute: 'default-selected' }) defaultSelected

  @property() selected
  @property({ reflect: true, type: Boolean }) shown

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
    `
  ]

  #change = () => {
    console.log('vl')

    if (!this.tokensBackup) this.tokensBackup = JSON.parse(JSON.stringify(this.tokens))

    if (this.timeout) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.arrayRepeat.reset()
      this.tokens = Object.values(this.tokensBackup).filter(
        (token) =>
          token.name.toLowerCase().includes(this.input.value) ||
          token.symbol.toLowerCase().includes(this.input.value) ||
          token.address.includes(this.input.value)
      )
      if (this.tokens.length === 0) {
        alert('import')
      }
      this.requestUpdate()
    }, 100)
  }

  #click = ({ target }: CustomEvent) => {
    const action = target.dataset.action
    console.log({ action })

    if (action) {
      switch (action) {
        case 'close':
          this.shown = false
          break
        default:
          break
      }
    }
  }

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('defaultSelected') && this.defaultSelected) {
      this.selected = this.defaultSelected
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
