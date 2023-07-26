import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, CSSResultGroup, html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import type { UUIButtonState } from '@umbraco-ui/uui';
import { UmbAuthMainContext } from '../context/auth-main.context.js';

import '../auth-layout.element.js';
import './reset-password.element.js';
import './new-password.element.js';

@customElement('umb-login')
export default class UmbLoginElement extends LitElement {
	#authContext = UmbAuthMainContext.Instance;

	@state()
	private _loginState: UUIButtonState = undefined;

	@state()
	private _loginError = '';

	@state()
	private _allowPasswordReset = true; // GET FROM CONTEXT

	#handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		if (!form) return;

		if (!form.checkValidity()) return;

		const formData = new FormData(form);

		const username = formData.get('email') as string;
		const password = formData.get('password') as string;
		const persist = formData.has('persist');

		this._loginState = 'waiting';

		const response = await this.#authContext.login({
			username,
			password,
			persist,
		});

		this._loginError = response.error || '';
		this._loginState = response.error ? 'failed' : 'success';

		if (response.error) return;

		const returnPath = this.#authContext.returnPath;

		if (returnPath) {
			location.href = returnPath;
		}

		this.dispatchEvent(new CustomEvent('login-success', { bubbles: true, composed: true }));
	};

	get #greeting() {
		return [
			'Happy super Sunday',
			'Happy marvelous Monday',
			'Happy tubular Tuesday',
			'Happy wonderful Wednesday',
			'Happy thunderous Thursday',
			'Happy funky Friday',
			'Happy Saturday',
		][new Date().getDay()];
	}

	render() {
		return html`
			<h1 id="greeting" class="uui-h3">${this.#greeting}</h1>
			<uui-form>
				<form id="LoginForm" name="login" @submit="${this.#handleSubmit}">
					<uui-form-layout-item>
						<uui-label id="emailLabel" for="email" slot="label" required>
							<umb-localize key="user_email">Email</umb-localize>
						</uui-label>
						<uui-input
							type="email"
							id="email"
							name="email"
							label="Email"
							required
							required-message="Email is required"></uui-input>
					</uui-form-layout-item>

					<uui-form-layout-item>
						<uui-label id="passwordLabel" for="password" slot="label" required>
							<umb-localize key="user_password">Password</umb-localize>
						</uui-label>
						<uui-input-password
							id="password"
							name="password"
							label="Password"
							required
							required-message="Password is required"></uui-input-password>
					</uui-form-layout-item>

					<div id="secondary-actions">
						${when(
							this.#authContext.supportsPersistLogin,
							() => html`<uui-form-layout-item>
								<uui-checkbox name="persist" label="Remember me">
									<umb-localize ="user_rememberMe">Remember me</umb-localize>
								</uui-checkbox>
							</uui-form-layout-item>`
						)}
						${when(
							this._allowPasswordReset,
							() =>
								html`<a id="forgot-password" href="reset"
									><umb-localize key="user_forgotPassword">Forgot password?</umb-localize></a
								>`
						)}
					</div>

					${this.#renderErrorMessage()}

					<uui-button
						type="submit"
						id="login-button"
						look="primary"
						label="Login"
						color="default"
						.state=${this._loginState}>
						<umb-localize key="general_login">Login</umb-localize>
					</uui-button>
				</form>
			</uui-form>
		`;
	}

	#renderErrorMessage() {
		if (!this._loginError || this._loginState !== 'failed') return nothing;

		return html`<span class="text-danger">${this._loginError}</span>`;
	}

	static styles: CSSResultGroup = [
		UUITextStyles,
		css`
			:host {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-6);
			}
			#greeting {
				text-align: center;
				margin: 0px;
				font-weight: 600;
				font-size: 1.4rem;
			}
			form {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-5);
			}
			uui-form-layout-item {
				margin: 0;
			}
			uui-input,
			uui-input-password {
				width: 100%;
				border-radius: var(--uui-border-radius);
			}
			#login-button {
				width: 100%;
				margin-top: var(--uui-size-space-5);
				--uui-button-padding-top-factor: 1.5;
				--uui-button-padding-bottom-factor: 1.5;
			}
			#forgot-password {
				color: var(--uui-color-interactive);
				text-decoration: none;
			}
			#forgot-password:hover {
				color: var(--uui-color-interactive-emphasis);
			}
			.text-danger {
				color: var(--uui-color-danger-standalone);
			}
			#secondary-actions {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-login': UmbLoginElement;
	}
}