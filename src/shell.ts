import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/textfield/outlined-text-field.js'

@customElement('app-shell')
export class AppShell extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
      }

      .hero {
        display: flex;
        flex-direction: column;
        max-width: 320px;
        width: 100%;
        height: 420px;
      }
    `
  ]

  render() {
    return html`
      <span class="hero">
        <md-outlined-text-field name="amount"></md-outlined-text-field>
      </span>
    `
  }
}
