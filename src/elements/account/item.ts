import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import multiavatar from '@multiavatar/multiavatar/esm'

@customElement('account-item')
export class AccountItem extends LitElement {
  @property()
  account

  protected async willUpdate(_changedProperties: PropertyValues) {
    if (_changedProperties.has('account') && this.account && (await this.updateComplete)) {
      const svgCode = multiavatar(this.account)
      this.shadowRoot.querySelector('.avatar').innerHTML = svgCode
    }
  }

  static styles = [
    css`
      :host {
        display: flex;
        align-items: center;
        --account-item-text-color: var(--on-surface-1);
      }

      .avatar {
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }

      strong {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: var(--account-item-text-color);
        max-width: var(--account-item-max-width, 118px);
      }
    `
  ]

  render() {
    return html`
      <div class="avatar"></div>
      ${this.account ? html`<strong title=${this.account}>${this.account}</strong>` : 'loading'}
    `
  }
}
