import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

@customElement('notification-pane')
export class NotificationPane extends LitElement {
  @property({ type: Array }) notifications

  @property({ reflect: true, type: Boolean }) open

  add(notification) {
    if (!this.notifications) this.notifications = []
    this.notifications.push(notification)
    this.requestUpdate()
  }

  remove() {}

  static styles = [
    css`
      :host {
        display: flex;
        position: absolute;
        right: 0;
        bottom: 0;
        top: 0;
        pointer-events: none;
        flex-direction: column;
        width: 100%;
        height: 100%;
        max-width: 240px;
        background-color: var(--surface-1);
        color: var(--on-surface-1);
        z-index: 4;
        transform: translateX(105%);
        padding: 6px 12px;
        box-sizing: border-box;
      }

      :host([open]) {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(0);
      }

      small {
        color: var(--on-surface-1);
        font-weight: 500;
      }

      notification-item {
        background-color: var(--surface-2);
        color: var(--on-surface-2);
        margin-bottom: 6px;
      }

      header {
        margin-bottom: 12px;
      }

      custom-icon {
        --custom-icon-color: var(--on-surface-1);
      }
    `
  ]

  render() {
    return html`
      <header>
        <md-icon-button @click=${() => (this.open = false)}
          ><custom-icon icon="menu_open"></custom-icon
        ></md-icon-button>
      </header>
      ${this.notifications
        ? html`${map(
            this.notifications,
            (item, i) =>
              html`
                <notification-item
                  data-id=${item.id}
                  .value=${item}></notification-item>
              `
          )}`
        : html`<small>no activity</small>`}
    `
  }
}
