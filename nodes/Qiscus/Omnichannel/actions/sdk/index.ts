import type { INodeProperties } from 'n8n-workflow';

import * as sendSystemEvent from './sendSystemEvent.operation';

export { sendSystemEvent };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		required: true,
		options: [
			{
				name: 'Send System Event',
				value: 'sendSystemEvent',
				action: 'Send system event',
			},
		],
		displayOptions: {
			show: {
				resource: ['sdk'],
			},
		},
		default: 'sendSystemEvent',
	},

	...sendSystemEvent.description,
];
