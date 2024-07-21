import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/button/outlined-button.js'
import './../time-ago.js'

@customElement('notification-item')
export class NotificationItem extends LitElement {
  @property() value

  @property({ type: Boolean, reflect: true }) hide

  remove() {}

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
        padding: 8px 12px;
        background-color: var(--surface-1);
        color: var(--on-surface-1);
        border-radius: var(--border-radius);
      }

      custom-icon {
        height: 20px;
        --custom-icon-color: var(--on-surface-1);
      }

      header {
        display: flex;
        row-gap: 100%;
        width: 100%;
        align-items: center;
      }

      h4 {
        margin: 0;
      }

      .flex {
        flex: 1;
      }

      .info {
        margin-top: 6px;
        margin-bottom: 12px;
      }

      md-outlined-button {
        --md-outlined-button-outline-color: var(--special-accent);
        --md-outlined-button-label-text-color: var(--on-special-accent);
        --md-outlined-button-hover-label-text-color: var(--on-special-accent);
        --md-outlined-button-pressed-label-text-color: var(--on-special-accent);
        --md-outlined-button-active-label-text-color: var(--on-special-accent);
        --md-outlined-button-focus-label-text-color: var(--on-special-accent);
        --md-outlined-button-leading-space: 14px;
        --md-outlined-button-trailing-space: 14px;
        --md-outlined-button-with-trailing-icon-leading-space: 6px;
        height: 40px;
      }

      time-ago {
        margin-top: 6px;
      }

      :host([hide]) md-icon-button {
        opacity: 0;
        pointer-events: none;
      }
    `
  ]

  render() {
    return html`
      <header>
        <h4>${this.value?.title}</h4>
        <span class="flex"></span>
        <md-icon-button>
          <custom-icon icon="delete"></custom-icon>
        </md-icon-button>
      </header>
      <span class="info"> ${this.value.text} </span>
      ${this.value.link
        ? html`<md-outlined-button @click=${() => open(this.value.link.url, '')}
            >${this.value.link.title}</md-outlined-button
          >`
        : ''}

      <small><time-ago .time=${this.value.timestamp}></time-ago></small>
    `
  }
}
