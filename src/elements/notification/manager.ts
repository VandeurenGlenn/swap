import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import './item.js'

@customElement('notification-manager')
export class NotificationManager extends LitElement {
  @property({ type: Array }) notifications = []

  _currentNotification

  add(notification) {
    if (!notification.timestamp) notification.timestamp = Date.now()
    if (!notification.id) notification.id = crypto.randomUUID()

    if (this.children.length > 4) {
      this.removeChild(this.lastChild)
    }

    const item = document.createElement('notification-item')
    item.value = notification
    item.setAttribute('hide', '')
    item.setAttribute('data-id', notification.id)

    if (this.children.length > 0) {
      this.insertBefore(item, this.firstChild)
    } else {
      this.appendChild(item)
    }
    document.querySelector('app-shell')?.shadowRoot?.querySelector('notification-pane').add(notification)

    setTimeout(() => {
      this.removeChild(this.lastChild)
    }, 5000)
  }

  remove() {}

  protected firstUpdated(_changedProperties: PropertyValues): void {
    globalThis.notificationManager = this
  }

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 240px;
        right: 0;
        height: 100%;
        position: absolute;
        box-sizing: border-box;
        padding: 0 12px;

        top: 70px;
        color: var(--on-surface-1);
      }
    `
  ]

  render() {
    return html` <slot></slot> `
  }
}
