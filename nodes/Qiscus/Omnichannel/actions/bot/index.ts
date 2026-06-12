import type { INodeProperties } from 'n8n-workflow';

import * as sendMessage from './sendMessage.operation';
import * as setBotWebhook from './setBotWebhook.operation';

export { sendMessage, setBotWebhook };

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
			{
				name: 'Set Bot Webhook',
				value: 'setBotWebhook',
				action: 'Set bot webhook',
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
	...setBotWebhook.description,
];
