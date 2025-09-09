import { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class QiscusCredentialsApi implements ICredentialType {
	name = 'qiscusCredentialsApi';
	displayName = 'Qiscus Credentials API';

	documentationUrl = 'https://documentation.qiscus.com/omnichannel-chat/authentication#rest-token';

	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
		{
			displayName: 'AppID',
			name: 'appId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Secret Key',
			name: 'appSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Base Url',
			name: 'baseUrl',
			type: 'string',
			default: 'https://omnichannel.qiscus.com',
		},
		{
			displayName: 'SDK Base Url',
			name: 'sdkBaseUrl',
			type: 'string',
			default: 'https://api.qiscus.com',
		},
	];

	// This credential is currently not used by any node directly
	// but the HTTP Request node can use it to make requests.
	// The credential is also testable due to the `test` property below
	// authenticate: IAuthenticateGeneric = {
	// 	type: 'generic',
	// 	properties: {
	// 		headers: {
	// 			'Qiscus-App-Id': '={{ $credentials.appId }}',
	// 			'Qiscus-Secret-Key': '={{ $credentials.appSecret }}',
	// 		},
	// 	},
	// };

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://omnichannel.qiscus.com/',
			url: 'api/v1/admin/get_profile',
			headers: {
				'Qiscus-App-Id': '={{ $credentials.appId }}',
				'Qiscus-Secret-Key': '={{ $credentials.appSecret }}',
			},
		},
	};
}
