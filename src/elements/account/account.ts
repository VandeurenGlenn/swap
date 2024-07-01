import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('account-element')
export class AccountElement extends LitElement {
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
