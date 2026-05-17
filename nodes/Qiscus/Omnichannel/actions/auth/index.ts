import type { INodeProperties } from 'n8n-workflow';

import * as loginAdmin from './loginAdmin.operation';
import * as getIdentityToken from './getIdentityToken.operation';

export { loginAdmin, getIdentityToken };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		options: [
			{
				name: 'Get Identity Token',
				value: 'getIdentityToken',
				action: 'Get identity token for SDK JWT auth',
			},
			{
				name: 'Login Admin',
				value: 'loginAdmin',
				action: 'Authenticate as admin',
			},
		],
		displayOptions: {
			show: {
				resource: ['auth'],
			},
		},
		default: 'loginAdmin',
	},

	...loginAdmin.description,
	...getIdentityToken.description,
];
