import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import set from 'lodash.set';

import { updateDisplayOptions, wrapData } from '../../utils';

import { qiscusOmnichannelApiRequest } from '../../transport';

import type { QiscusCredentials } from './../../transport/requestApi';

import descriptions from '../../../common.description';

enum MessageType {
	Text = 'text',
	FileAttachment = 'file_attachment',

	// TODO: support other types
	// Button = 'Button',
	// Carousel = 'Carousel',
	// QuickReply = 'QuickReply',
	// Sticker = 'Sticker',
}

const properties: INodeProperties[] = [
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Text',
				value: MessageType.Text,
			},
			{
				name: 'Attachment',
				value: MessageType.FileAttachment,
			},
		],
		default: 'text',
	},

	descriptions('roomId', {
		displayOptions: {
			show: {
				type: [MessageType.Text, MessageType.FileAttachment],
			},
		},
	}),

	descriptions('message', {
		displayOptions: {
			show: {
				type: [MessageType.Text, MessageType.FileAttachment],
			},
		},
	}),

	descriptions('attachment_url', {
		displayOptions: {
			show: {
				type: [MessageType.FileAttachment],
			},
		},
	}),

	descriptions('caption', {
		displayOptions: {
			show: {
				type: [MessageType.FileAttachment],
			},
		},
	}),
];

const displayOptions = {
	show: {
		resource: ['bot'],
		operation: ['sendMessage'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(
	this: IExecuteFunctions,
	i: number,
	item: INodeExecutionData,
): Promise<INodeExecutionData[]> {
	let responseData: IDataObject | IDataObject[] = [];

	const credentials: QiscusCredentials = await this.getCredentials('qiscusCredentialsApi');

	const type = this.getNodeParameter('type', i) as string;

	const room_id = this.getNodeParameter('roomId', i) as string;
	const message = this.getNodeParameter('message', i) as string;

	const path = `${credentials.appId}/bot`;
	const body: IDataObject = {
		type,
		sender_email: `${credentials.appId}_admin@qismo.com`,
		room_id,
		message,
	};

	if (type === MessageType.FileAttachment) {
		const attachment_url = this.getNodeParameter('attachment_url', i) as string;
		const caption = this.getNodeParameter('caption', i) as string;

		set(body, 'attachment_url', attachment_url);
		set(body, 'caption', caption);
	}

	responseData = await qiscusOmnichannelApiRequest.call(this, credentials, 'POST', path, body);

	const executionData = this.helpers.constructExecutionMetaData(wrapData(responseData), {
		itemData: { item: i },
	});

	return executionData;
}
