/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { NodeConnectionType, type INodeTypeDescription } from 'n8n-workflow';

import * as bot from './bot';
import * as sdk from './sdk';

export const description: INodeTypeDescription = {
	displayName: 'Qiscus Omnichannel',
	name: 'qiscusOmnichannel',
	icon: 'file:qiscus.svg',
	group: ['transform'],
	subtitle: '={{$parameter["operation"]}} : {{$parameter["resource"]}}',
	version: 1,
	description: 'Consume Qiscus Omnichannel API',
	defaults: {
		name: 'Qiscus Omnichannel',
	},
	usableAsTool: true,
	inputs: [NodeConnectionType.Main],
	outputs: [NodeConnectionType.Main],
	credentials: [
		{
			name: 'qiscusCredentialsApi',
			required: true,
		},
	],
	properties: [
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			required: true,
			options: [
				{
					name: 'Bot',
					value: 'bot',
				},
				{
					name: 'SDK',
					value: 'sdk',
				},
			],
			default: 'bot',
		},

		...bot.description,
		...sdk.description,
	],
};
