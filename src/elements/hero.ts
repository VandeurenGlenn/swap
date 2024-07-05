import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@material/web/elevation/elevation.js'

@customElement('hero-element')
export class HeroElement extends LitElement {
  static styles = [
    css`
      :host {
        position: relative;
        display: flex;
        flex-direction: column;
        max-width: 480px;
        width: calc(100% - 24px);
        height: 100%;
        max-height: 320px;
        border-radius: var(--border-radius);
        background-color: var(--surface-1);
        color: var(--on-surface-1);
        padding: 6px;
        margin: 0 12px;
      }

      md-elevation {
        --md-elevation-level: 1;
      }
    `
  ]

  render() {
    return html`
      <md-elevation level="1"></md-elevation>
      <slot></slot>
    `
  }
}
