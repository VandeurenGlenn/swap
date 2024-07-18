import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

@customElement('notification-manager')
export class NotificationManager extends LitElement {
  @property() notifications

  add() {}

  remove() {}

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        width: 100%;
        height: 100%;
      }

      small {
        color: var(--on-surface-1);
        font-weight: 500;
      }
    `
  ]

  render() {
    return html`
      ${this.notifications
        ? html`${map(this.notifications, (item, i) => html` <notification-item></notification-item> `)}`
        : html`<small>no activity</small>`}
    `
  }
}
