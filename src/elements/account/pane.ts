import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('account-pane')
export class Accountpane extends LitElement {
  @property() accounts

  @property() selectedAccount

  static styles = [
    css`
      :host {
        display: block;
      }
    `
  ]

  render() {
    return html` <img /> `
  }
}
