import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions, wrapData } from '../../utils';

import { qiscusOmnichannelPublicApiRequest } from '../../transport';

import type { QiscusCredentials } from './../../transport/requestApi';

const properties: INodeProperties[] = [
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'admin@example.com',
		description: 'Admin email',
	},

	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		required: true,
		description: 'Admin password',
	},
];

const displayOptions = {
	show: {
		resource: ['auth'],
		operation: ['loginAdmin'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(
	this: IExecuteFunctions,
	i: number,
	item: INodeExecutionData,
): Promise<INodeExecutionData[]> {
	const credentials: QiscusCredentials = await this.getCredentials('qiscusCredentialsApi');

	const email = this.getNodeParameter('email', i) as string;
	const password = this.getNodeParameter('password', i) as string;

	const responseData: IDataObject | IDataObject[] = await qiscusOmnichannelPublicApiRequest.call(
		this,
		credentials,
		'POST',
		'api/v1/auth',
		{},
		{},
		{
			formData: {
				email,
				password,
			},
			json: false,
		},
	);

	return this.helpers.constructExecutionMetaData(wrapData(responseData), {
		itemData: { item: i },
	});
}
