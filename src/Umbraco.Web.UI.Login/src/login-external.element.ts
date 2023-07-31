import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('umb-login-external')
export class UmbLoginExternalElement extends LitElement {
	@property({ attribute: 'custom-view' }) //PATH to ESModule
	customView?: any; // LOOK AT EXTENSION API IN NEW BACKOFFICE

	@property({ attribute: 'name' })
	name = '';

	@property({ attribute: 'external-login-url' })
	externalLoginUrl = '';

	@property({ attribute: 'icon' })
	icon = '';

	#onProviderClicked() {}

	render() {
		return html`
			<uui-icon-registry-essential>
				<form method="post" action="${this.externalLoginUrl}">
					<button><uui-icon name=${this.icon}></uui-icon> Continue with ${this.name}</button>
				</form>
			</uui-icon-registry-essential>
		`;
	}

	static styles: CSSResultGroup = [
		css`
			button {
				font-size: var(--uui-button-font-size);
				border: 1px solid var(--uui-color-border);
				border-radius: var(--uui-border-radius);
				width: 100%;
				padding: 9px;
				text-align: left;
				background-color: var(--uui-color-surface);
				cursor: pointer;
				display: flex;
				align-items: center;
				gap: var(--uui-size-space-2);
				box-sizing: border-box;

				line-height: 1.1; /* makes the text vertically centered */
				color: var(--uui-color-interactive);
			}

			button:hover {
				color: var(--uui-color-interactive-emphasis);
				border-color: var(--uui-color-border-standalone);
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-login-external': UmbLoginExternalElement;
	}
}
