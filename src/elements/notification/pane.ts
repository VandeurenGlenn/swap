import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { NotificationItem } from './item.js'

@customElement('notification-pane')
export class NotificationPane extends LitElement {
  @property({ type: Array }) notifications

  @property({ reflect: true, type: Boolean }) open

  add(notification) {
    if (!this.notifications) this.notifications = []
    this.notifications.push(notification)
    this.requestUpdate()
  }

  #handlePointerUp = (event: CustomEvent) => {
    const child = event.target as NotificationItem
    const path = event.composedPath()

    if (
      child.localName === 'notification-item' &&
      path[3].localName === 'md-icon-button' &&
      path[3].querySelector('[icon="delete"]')
    ) {
      this.shadowRoot?.querySelector('main').removeChild(child)
      let i = 0
      for (const notification of this.notifications) {
        if (notification.id === child.dataset.id) {
          this.notifications.splice(i, 1)
          this.requestUpdate()
          break
        }
        i += 1
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.shadowRoot?.addEventListener('pointerup', this.#handlePointerUp)
  }

  remove() {}

  static styles = [
    css`
      * {
        text-transform: capitalize;
      }
      :host {
        display: flex;
        position: absolute;
        right: 0;
        bottom: 4px;
        top: 4px;
        pointer-events: none;
        flex-direction: column;
        width: 100%;
        max-width: 240px;
        background-color: var(--surface-1);
        color: var(--on-surface-1);
        z-index: 4;
        transform: translateX(105%);
        padding: 6px 12px;
        border-left: 2px solid var(--surface);
        box-sizing: border-box;
        opacity: 0;
        transition: transform 240ms var(--motion-out), opacity 90ms var(--motion-out);
        border-top-left-radius: var(--border-radius-large);
        border-bottom-left-radius: var(--border-radius-large);
      }

      :host([open]) {
        opacity: 1;
        pointer-events: auto;
        transform: translateX(0);
        transition: transform 180ms var(--motion-in), opacity 60ms var(--motion-in);
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

      [icon='menu_open'] {
        transform: rotate(180deg);
      }

      main {
        overflow-y: auto;
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
      <main>
        ${this.notifications?.length > 0
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
      </main>
    `
  }
}
