import { UUITextStyles } from '@umbraco-ui/uui-css';
import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { UmbAuthMainContext } from './context/auth-main.context.js';
import { UUIIconRegistryEssential } from '@umbraco-ui/uui';
import { UmbIconRegistry } from './icon.registry.js';
import UmbRouter from './umb-router.js';

@customElement('umb-auth')
export default class UmbAuthElement extends LitElement {
	#returnPath = '';

	@property({ type: Boolean, attribute: 'is-legacy' })
	isLegacy = false;

	/**
	 * Disables the local login form and only allows external login providers.
	 *
	 * @attr disable-local-login
	 */
	@property({ type: Boolean, attribute: 'disable-local-login' })
	set disableLocalLogin(value: boolean) {
		UmbAuthMainContext.Instance.disableLocalLogin = value;
	}

	@property({ type: String, attribute: 'background-image' })
	backgroundImage = '';

	@property({ type: String, attribute: 'logo-image' })
	logoImage = '';

	@property({ type: Boolean, attribute: 'username-is-email' })
	usernameIsEmail = false;

	@property({ type: Boolean, attribute: 'allow-password-reset' })
	allowPasswordReset = false;

	@property({ type: Boolean, attribute: 'allow-user-invite' })
	allowUserInvite = false;

	@property({ type: String, attribute: 'return-url' })
	set returnPath(value: string) {
		this.#returnPath = value;
		UmbAuthMainContext.Instance.returnPath = this.returnPath;
	}
	get returnPath() {
		// Check if there is a ?redir querystring or else return the returnUrl attribute
		return new URLSearchParams(window.location.search).get('returnPath') || this.#returnPath;
	}

	constructor() {
		super();

		new UUIIconRegistryEssential().attach(this);
		new UmbIconRegistry().attach(this);
	}

	@state()
	router?: UmbRouter;

	async firstUpdated(): Promise<void> {
		this.router = new UmbRouter(this, [
			{
				path: 'login',
				component: () => {
					const searchParams = new URLSearchParams(window.location.search);
					const flow = searchParams.get('flow');
					switch (flow) {
						case 'mfa':
							return html`<umb-mfa-page></umb-mfa-page>`;
						case 'reset-password':
							return html`<umb-new-password-page></umb-new-password-page>`;
						case 'invite-user':
							return html`<umb-invite-page></umb-invite-page>`;

						default:
							return html`<umb-login-page
								?allow-password-reset=${this.allowPasswordReset}
								?username-is-email=${this.usernameIsEmail}>
								<slot name="external" slot="external"></slot>
							</umb-login-page>`;
					}
				},
				default: true,
				action: this.#checkForParams,
			},
			{
				path: 'login/reset',
				component: html`<umb-reset-password-page></umb-reset-password-page>`,
				action: () => (this.allowPasswordReset && !this.disableLocalLogin ? null : 'login'),
			},
		]);

		this.router.subscribe();
	}

	#checkForParams(_path: string, search: string) {
		const searchParams = new URLSearchParams(search);
		const flow = searchParams.get('flow');

		if (flow === 'reset-password') {
			const resetId = searchParams.get('userId');
			const resetCode = searchParams.get('resetCode');
			if (resetId && resetCode) {
				return 'login/new';
			}
		}

		if (flow === 'invite-user') {
			return 'login/invite';
		}

		return null;
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.router?.unsubscribe();
	}

	render() {
		return html`
			<umb-auth-layout backgroundImage=${ifDefined(this.backgroundImage)} logoImage=${ifDefined(this.logoImage)}>
				<button @click=${() => UmbRouter.redirect('?flow=mfa')}>MFA</button>
				<button @click=${() => UmbRouter.redirect('?flow=reset-password')}>RESET</button>
				${this.router?.render()}
			</umb-auth-layout>
		`;
	}

	static styles: CSSResultGroup = [UUITextStyles, css``];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-auth': UmbAuthElement;
	}
}
