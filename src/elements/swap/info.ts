import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as ethers from './../../../node_modules/ethers/dist/ethers.min.js'
import { map } from 'lit/directives/map.js'

@customElement('swap-info')
export class SwapInfo extends LitElement {
  @property({ type: Object }) value

  static styles = [
    css`
      :host {
        display: block;
        margin-top: 12px;
      }
      .row {
        display: flex;
        width: 100%;
      }

      .flex {
        flex: 1;
        display: flex;
      }
    `
  ]

  render() {
    return html`
      <span class="row"
        ><small><span>gas</span></small> <span class="flex"></span>${this.value
          ? ethers.formatUnits(this.value.gas)
          : ''}
      </span>

      <span class="row">
        <small>protocols</small>
        <span class="flex"></span>
        ${map(this.value?.protocols, (proto) => html`${proto[0][0].name}`)}
      </span>
    `
  }
}
