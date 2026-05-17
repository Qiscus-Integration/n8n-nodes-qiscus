import type { INodeProperties } from 'n8n-workflow';

import * as loginAdmin from './loginAdmin.operation';

export { loginAdmin };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		options: [
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
];
