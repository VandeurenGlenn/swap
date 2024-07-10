import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as ethers from './../../../node_modules/ethers/dist/ethers.min.js'
import { map } from 'lit/directives/map.js'
import { consume, createContext } from '@lit/context'

@customElement('swap-info')
export class SwapInfo extends LitElement {
  @consume({ context: createContext('swap-info'), subscribe: true })
  @property()
  swapInfo

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
        ><small><span>gas</span></small> <span class="flex"></span>${this.swapInfo
          ? ethers.formatUnits(this.swapInfo.gas)
          : ''}
      </span>

      <span class="row">
        <small>protocols</small>
        <span class="flex"></span>
        ${map(this.swapInfo?.protocols, (proto) => html`${proto[0][0].name}`)}
      </span>
    `
  }
}
