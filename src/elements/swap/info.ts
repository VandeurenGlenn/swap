import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('swap-info')
export class SwapInfo extends LitElement {
  @property({ type: Object }) value

  static styles = [
    css`
      :host {
        display: block;
      }
      .row {
        display: flex;
        width: 100%;
      }
    `
  ]

  render() {
    return html` <span class="row"> </span> `
  }
}
