import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('umb-auth-layout')
export class UmbAuthLayoutElement extends LitElement {
	@property({ type: String, attribute: 'background-image' })
	backgroundImage = 'login.svg';

	@property({ type: String, attribute: 'logo-image' })
	logoImage = 'umbraco_logomark_white.svg';

	render() {
		return html`
			<div id="background"></div>

			<div id="logo"><img src=${this.logoImage} alt="Umbraco" /></div>

			<div id="container">
				<div id="box">
					<slot></slot>
				</div>
			</div>
		`;
	}

	static styles: CSSResultGroup = [
		css`
			#background {
				position: fixed;
				overflow: hidden;
				background-position: 50%;
				background-repeat: no-repeat;
				background-size: cover;
				background-image: url('login.svg');
				width: 100vw;
				height: 100vh;
			}

			#logo {
				position: fixed;
				top: var(--uui-size-space-5);
				left: var(--uui-size-space-5);
				height: 30px;
			}

			#logo img {
				height: 100%;
			}

			#container {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100vw;
				height: 100vh;
			}

			#box {
				width: 500px;
				padding: var(--uui-size-layout-3);
				background-color: var(--uui-color-surface);
				box-sizing: border-box;
				box-shadow: var(--uui-shadow-depth-5);
				border-radius: calc(var(--uui-border-radius) * 2);
			}

			#email,
			#password {
				width: 100%;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-auth-layout': UmbAuthLayoutElement;
	}
}