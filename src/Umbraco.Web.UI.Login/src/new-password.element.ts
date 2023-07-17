import type { UUIButtonState } from '@umbraco-ui/uui';
import { UUITextStyles } from '@umbraco-ui/uui-css';
import { CSSResultGroup, LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbAuthMainContext } from './context/auth-main.context';

@customElement('umb-new-password')
export default class UmbNewPasswordElement extends LitElement {
	@state()
	code: string = '';

	@state()
	newCallState: UUIButtonState = undefined;

	#handleResetSubmit = async (e: SubmitEvent) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;

		if (!form) return;
		if (!form.checkValidity()) return;

		const formData = new FormData(form);
		const username = formData.get('email') as string;

		// this.newCallState = 'waiting';
		// const response = await UmbAuthMainContext.Instance.newPassword(username);

		// if (response.status === 200) {
		// 	this.newCallState = 'success';
		// } else {
		// 	this.newCallState = 'failed';
		// }
	};

	#renderResetPage() {
		return html`
			<uui-form>
				<form id="LoginForm" name="login" @submit="${this.#handleResetSubmit}">
					Enter a new password for your account.
					<h2>Create new password</h2>
					<uui-form-layout-item>
						<uui-label id="passwordLabel" for="password" slot="label" required>Password</uui-label>
						<uui-input
							type="password"
							id="password"
							name="password"
							label="Password"
							required
							required-message="Password is required"></uui-input>
					</uui-form-layout-item>

					<uui-form-layout-item>
						<uui-label id="confirmPasswordLabel" for="confirmPassword" slot="label" required>
							Confirm password
						</uui-label>
						<uui-input
							type="password"
							id="confirmPassword"
							name="confirmPassword"
							label="ConfirmPassword"
							required
							required-message="ConfirmPassword is required"></uui-input>
					</uui-form-layout-item>

					<uui-button
						type="submit"
						label="Continue"
						look="primary"
						color="positive"
						.state=${this.newCallState}></uui-button>
				</form>
			</uui-form>
		`;
	}

	#renderConfirmationPage() {
		return html`
			Information about the reset has been sent to your email address. Please follow the instructions in the email to
			reset your password.
		`;
	}

	render() {
		return this.newCallState === 'success' ? this.#renderConfirmationPage() : this.#renderResetPage();
	}

	static styles: CSSResultGroup = [
		UUITextStyles,
		css`
			uui-input {
				width: 100%;
			}
			uui-button {
				margin-left: auto;
				display: flex;
				width: fit-content;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-new-password': UmbNewPasswordElement;
	}
}