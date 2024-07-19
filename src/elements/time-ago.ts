import { consume, createContext } from '@lit/context'
import { LitElement, html, css, PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

@customElement('time-ago')
export class TimeAgoElement extends LitElement {
  @property() time

  protected firstUpdated(_changedProperties: PropertyValues): void {
    document.addEventListener('epoch', () => this.requestUpdate())
  }
  static styles = [
    css`
      :host {
        display: block;
      }
    `
  ]

  render() {
    return html` ${timeAgo.format(new Date(Number(this.time)), 'mini')} ago`
  }
}
