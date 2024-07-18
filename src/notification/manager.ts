import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('notification-manager')
export class NotificationManager extends LitElement {
  @property() notifications
  add() {}

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
    return html` ${this.notifications ? html : html`<small>no activity</small>`} `
  }
}
