import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions, wrapData } from '../../utils';

import { qiscusOmnichannelAdminApiRequest } from '../../transport';

import type { QiscusCredentials } from './../../transport/requestApi';

const properties: INodeProperties[] = [
	{
		displayName: 'User Token',
		name: 'userToken',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		description: 'User authentication token (e.g. from Login Admin)',
		hint: 'Tip: pipe from a Login Admin node via expression',
	},

	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		placeholder: 'name@email.com',
		description: 'Email of the user identity to authenticate',
	},

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Display name of the user',
	},

	{
		displayName: 'Avatar URL',
		name: 'avatarUrl',
		type: 'string',
		default: '',
		description: 'Avatar image URL of the user',
	},

	{
		displayName: 'Nonce',
		name: 'nonce',
		type: 'string',
		default: '',
		description: 'Nonce value for replay protection',
	},
];

const displayOptions = {
	show: {
		resource: ['auth'],
		operation: ['getIdentityToken'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(
	this: IExecuteFunctions,
	i: number,
	item: INodeExecutionData,
): Promise<INodeExecutionData[]> {
	const credentials: QiscusCredentials = await this.getCredentials('qiscusCredentialsApi');

	const userToken = this.getNodeParameter('userToken', i) as string;
	const email = this.getNodeParameter('email', i) as string;
	const name = this.getNodeParameter('name', i) as string;
	const avatarUrl = this.getNodeParameter('avatarUrl', i) as string;
	const nonce = this.getNodeParameter('nonce', i) as string;

	const formData: IDataObject = { app_id: credentials.appId };
	if (nonce) formData.nonce = nonce;
	if (email) formData.email = email;
	if (avatarUrl) formData.avatar_url = avatarUrl;
	if (name) formData.name = name;

	const responseData: IDataObject | IDataObject[] = await qiscusOmnichannelAdminApiRequest.call(
		this,
		credentials,
		userToken,
		'POST',
		'api/v1/auth/get_identity_token',
		{},
		{},
		{
			formData,
			json: false,
		},
	);

	return this.helpers.constructExecutionMetaData(wrapData(responseData), {
		itemData: { item: i },
	});
}
