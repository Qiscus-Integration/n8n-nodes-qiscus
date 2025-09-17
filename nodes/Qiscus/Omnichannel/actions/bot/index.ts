import type { INodeProperties } from 'n8n-workflow';

import * as sendMessage from './sendMessage.operation';

export { sendMessage };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		options: [
			{
				name: 'Send Message',
				value: 'sendMessage',
				action: 'Send a message',
			},
		],
		displayOptions: {
			show: {
				resource: ['bot'],
			},
		},
		default: 'sendMessage',
	},

	...sendMessage.description,
];
