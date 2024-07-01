import { LitElement, html, css, PropertyValueMap } from 'lit'
import { consume, createContext } from '@lit/context'
import { customElement, property } from 'lit/decorators.js'
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

  static styles = [
    css`
      :host {
        position: absolute;
        display: block;
        opacity: 0;
        pointer-events: none;
      }
      .column {
        display: flex;
        flex-direction: row;
        width: 100%;
      }

      :host([shown]) {
        opacity: 1;
        pointer-events: auto;
      }
    `
  ]

  protected willUpdate(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (_changedProperties.has('defaultSelected') && this.defaultSelected) {
      this.selected = this.defaultSelected
    }
  }

  show() {
    this.shown = true
  }

  render() {
    return html`
      <hero-element>
        <array-repeat
          .items=${this.tokens}
          name-space="item">
          <template
            ><span class="column">
              <span class="row">
                <img src="[[item.icon.color]]" />
                <span class="name">[[item.name]]</span>
              </span>
            </span>
          </template>
        </array-repeat>
      </hero-element>
    `
  }
}
