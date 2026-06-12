import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions, wrapData } from '../../utils';

import { qiscusOmnichannelAdminApiRequest } from '../../transport';

import type { QiscusCredentials } from './../../transport/requestApi';

import descriptions from '../../../common.description';

const properties: INodeProperties[] = [
	descriptions('adminToken'),

	{
		displayName: 'Bot Webhook URL',
		name: 'botWebhookUrl',
		type: 'string',
		default: '',
		required: true,
		description: 'Webhook URL that will receive bot events',
		hint: 'Enter a URL',
	},

	{
		displayName: 'Is Bot Enabled',
		name: 'isBotEnabled',
		type: 'boolean',
		default: true,
		description: 'Whether the bot integration is enabled',
	},
];

const displayOptions = {
	show: {
		resource: ['bot'],
		operation: ['setBotWebhook'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(
	this: IExecuteFunctions,
	i: number,
	item: INodeExecutionData,
): Promise<INodeExecutionData[]> {
	const credentials: QiscusCredentials = await this.getCredentials('qiscusCredentialsApi');

	const adminToken = this.getNodeParameter('adminToken', i) as string;
	const botWebhookUrl = this.getNodeParameter('botWebhookUrl', i) as string;
	const isBotEnabled = this.getNodeParameter('isBotEnabled', i) as boolean;

	const responseData: IDataObject | IDataObject[] = await qiscusOmnichannelAdminApiRequest.call(
		this,
		credentials,
		adminToken,
		'POST',
		'api/v1/app/bot/integrate',
		{},
		{},
		{
			formData: {
				bot_webhook_url: botWebhookUrl,
				is_bot_enabled: String(isBotEnabled),
			},
			json: false,
		},
	);

	return this.helpers.constructExecutionMetaData(wrapData(responseData), {
		itemData: { item: i },
	});
}
