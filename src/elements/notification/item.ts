import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('notification-manager')
export class NotificationManager extends LitElement {
  @property() title

  @property() text

  @property() link

  remove() {}

  static styles = [
    css`
      :host {
        display: block;
        overflow-y: auto;
      }
    `
  ]

  render() {
    return html` <slot></slot><custom-icon icon="delete"></custom-icon>`
  }
}
