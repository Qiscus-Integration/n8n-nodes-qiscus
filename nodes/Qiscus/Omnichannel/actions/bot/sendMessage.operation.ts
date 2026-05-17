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
	Buttons = 'buttons',
	Carousel = 'carousel',

	// TODO: support other types
	// QuickReply = 'QuickReply',
	// Sticker = 'Sticker',
}

interface ButtonValue {
	label: string;
	type: 'postback' | 'link';
	url: string;
	method?: string;
	postback_text?: string;
}

interface CardValue {
	image: string;
	title: string;
	description: string;
	default_action_url: string;
	default_action_method?: string;
	default_action_postback_text?: string;
	buttons?: { button?: ButtonValue[] };
}

function buildButtonPayload(b: ButtonValue) {
	if (b.type === 'link') {
		return {
			label: b.label,
			type: 'link',
			payload: { url: b.url },
		};
	}
	const out: IDataObject = {
		label: b.label,
		type: 'postback',
		payload: {
			url: b.url,
			method: b.method ?? 'get',
			payload: null,
		},
	};
	if (b.postback_text) {
		out.postback_text = b.postback_text;
	}
	return out;
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
			{
				name: 'Buttons',
				value: MessageType.Buttons,
			},
			{
				name: 'Carousel',
				value: MessageType.Carousel,
			},
		],
		default: 'text',
	},

	descriptions('roomId', {
		displayOptions: {
			show: {
				type: [
					MessageType.Text,
					MessageType.FileAttachment,
					MessageType.Buttons,
					MessageType.Carousel,
				],
			},
		},
	}),

	descriptions('message', {
		displayOptions: {
			show: {
				type: [
					MessageType.Text,
					MessageType.FileAttachment,
					MessageType.Buttons,
					MessageType.Carousel,
				],
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

	{
		displayName: 'Body Text',
		name: 'body_text',
		type: 'string',
		default: '',
		required: true,
		description: 'Text displayed above the buttons',
		displayOptions: {
			show: {
				type: [MessageType.Buttons],
			},
		},
	},

	{
		displayName: 'Buttons',
		name: 'buttons',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		placeholder: 'Add Button',
		displayOptions: {
			show: {
				type: [MessageType.Buttons],
			},
		},
		options: [
			{
				name: 'button',
				displayName: 'Button',
				values: [
					{
						displayName: 'Label',
						name: 'label',
						type: 'string',
						default: '',
						required: true,
						description: 'Button label shown to user',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Postback', value: 'postback' },
							{ name: 'Link', value: 'link' },
						],
						default: 'postback',
					},
					{
						displayName: 'URL',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						description: 'Target URL (postback callback or link destination)',
					},
					{
						displayName: 'Method',
						name: 'method',
						type: 'options',
						options: [
							{ name: 'GET', value: 'get' },
							{ name: 'POST', value: 'post' },
						],
						default: 'get',
						displayOptions: {
							show: {
								type: ['postback'],
							},
						},
					},
				],
			},
		],
	},

	{
		displayName: 'Cards',
		name: 'cards',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		placeholder: 'Add Card',
		displayOptions: {
			show: {
				type: [MessageType.Carousel],
			},
		},
		options: [
			{
				name: 'card',
				displayName: 'Card',
				values: [
					{
						displayName: 'Buttons',
						name: 'buttons',
						type: 'fixedCollection',
						typeOptions: { multipleValues: true },
						default: {},
						placeholder: 'Add Button',
						options: [
							{
								name: 'button',
								displayName: 'Button',
								values: [
									{
										displayName: 'Label',
										name: 'label',
										type: 'string',
										default: '',
										required: true,
									},
									{
										displayName: 'Method',
										name: 'method',
										type: 'options',
										options: [
											{ name: 'GET', value: 'get' },
											{ name: 'POST', value: 'post' },
										],
										default: 'get',
										displayOptions: {
											show: {
												type: ['postback'],
											},
										},
									},
									{
										displayName: 'Postback Text',
										name: 'postback_text',
										type: 'string',
										default: '',
										displayOptions: {
											show: {
												type: ['postback'],
											},
										},
									},
									{
										displayName: 'Type',
										name: 'type',
										type: 'options',
										options: [
											{ name: 'Postback', value: 'postback' },
											{ name: 'Link', value: 'link' },
										],
										default: 'postback',
									},
									{
										displayName: 'URL',
										name: 'url',
										type: 'string',
										default: '',
										required: true,
									},
								],
							},
						],
					},
					{
						displayName: 'Default Action Method',
						name: 'default_action_method',
						type: 'options',
						options: [
							{
								name: 'GET',
								value: 'get',
							},
							{
								name: 'POST',
								value: 'post',
							},
					],
						default: 'get',
					},
					{
						displayName: 'Default Action Postback Text',
						name: 'default_action_postback_text',
						type: 'string',
						default: '',
						description: 'Text shown as user reply on tap',
					},
					{
						displayName: 'Default Action URL',
						name: 'default_action_url',
						type: 'string',
						default: '',
							required:	true,
						description: 'Postback URL triggered when card tapped',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Image URL',
						name: 'image',
						type: 'string',
						default: '',
							required:	true,
						description: 'Card image URL',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
							required:	true,
					},
			],
			},
		],
	},
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

		set(body, 'payload.url', attachment_url);
		set(body, 'payload.caption', caption);
	}

	if (type === MessageType.Buttons) {
		const body_text = this.getNodeParameter('body_text', i) as string;
		const buttonsParam = this.getNodeParameter('buttons.button', i, []) as ButtonValue[];

		set(body, 'payload.text', body_text);
		set(body, 'payload.buttons', buttonsParam.map(buildButtonPayload));
	}

	if (type === MessageType.Carousel) {
		const cardsParam = this.getNodeParameter('cards.card', i, []) as CardValue[];

		const cards = cardsParam.map((c) => {
			const cardButtons = c.buttons?.button ?? [];
			return {
				image: c.image,
				title: c.title,
				description: c.description,
				default_action: {
					type: 'postback',
					postback_text: c.default_action_postback_text ?? '',
					payload: {
						url: c.default_action_url,
						method: c.default_action_method ?? 'get',
						payload: null,
					},
				},
				buttons: cardButtons.map(buildButtonPayload),
			};
		});

		set(body, 'payload.cards', cards);
	}

	responseData = await qiscusOmnichannelApiRequest.call(this, credentials, 'POST', path, body);

	const executionData = this.helpers.constructExecutionMetaData(wrapData(responseData), {
		itemData: { item: i },
	});

	return executionData;
}
