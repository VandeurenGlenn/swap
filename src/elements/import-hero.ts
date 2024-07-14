import { LitElement, PropertyValueMap, css, html } from 'lit'
import '@material/web/button/filled-button.js'
import '@material/web/iconbutton/icon-button.js'
import '@vandeurenglenn/lit-elements/icon.js'
import { customElement, property } from 'lit/decorators.js'

@customElement('import-hero')
export default class ImportHero extends LitElement {
  @property({ reflect: true, type: Boolean }) shown

  @property() address

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset: 0;
        background-color: var(--scrim);
        z-index: 2;
        align-items: center;
        justify-content: center;
        pointer-events: none;
        opacity: 0;
      }

      custom-icon {
        --custom-icon-color: var(--on-surface-2);
      }

      hero-element {
        margin: 0;
        background: var(--surface-1);
        padding: 12px;
        box-sizing: border-box;
        max-height: 322px;
        height: 100%;
      }

      h4 {
        margin: 0;
      }
      .header {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 12px 12px 12px 12px;
        border-bottom: 1px solid var(--surface-2);
        margin-bottom: 24px;
        font-weight: 700;
        color: var(--on-surface-2);
      }
      md-filled-button {
        font-weight: 700;
        cursor: pointer;
        --md-filled-button-container-color: var(--surface-2);
        --md-filled-button-label-text-color: var(--on-surface-2);
        --md-filled-button-hover-label-text-color: var(--on-surface-2);
        --md-filled-button-pressed-label-text-color: var(--on-surface-2);
        --md-filled-button-active-label-text-color: var(--on-surface-2);
        --md-filled-button-focus-label-text-color: var(--on-surface-2);
        border-radius: var(--border-radius);
        width: 100%;
        margin-bottom: 12px;
      }

      img {
        height: 40px;
        width: 40px;
      }
      :host([shown]) {
        pointer-events: auto;
        opacity: 1;
      }

      .flex {
        display: flex;
        flex: 1;
      }

      .question {
        font-weight: 500;
        font-size: 18px;
      }
    `
  ]

  render() {
    return html`
      <div style="height: 158px;"></div>
      <hero-element>
        <span class="header">
          <h4>import</h4>
          <span class="flex"></span>
          <md-icon-button data-action="close"><custom-icon icon="cancel"></custom-icon></md-icon-button>
        </span>
        <strong>${this.address}</strong>
        <p class="question">are you sure you want to import above token?</p>

        <span class="flex"></span>
        <small>note: please make sure to do your research!</small>

        <span class="flex"></span>
        <md-filled-button data-action="disconnect">disconnect</md-filled-button>
      </hero-element>
    `
  }
}
