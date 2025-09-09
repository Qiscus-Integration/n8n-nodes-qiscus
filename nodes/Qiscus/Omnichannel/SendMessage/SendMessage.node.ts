import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import fields from '../Omnichannel.fields';

enum MessageType {
	Text = 'Text',
	Attachment = 'Attachment',
	// Button = 'Button',
	// Carousel = 'Carousel',
	// QuickReply = 'QuickReply',
	// Sticker = 'Sticker',
}

export class SendMessage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qiscus Omnichannel Send Message',
		name: 'sendMessage',
		icon: { light: 'file:./../../qiscus.svg', dark: 'file:./../../qiscus.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '=Type: {{ $parameter.type }}',
		description: 'Send message to omnichannel as Bot',
		defaults: {
			name: 'Send Message',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'qiscusCredentialsApi',
				required: true,
			},
		],
		requestDefaults: {
			method: 'POST',
			baseURL: '={{ $credentials.baseUrl }}/{{ $credentials.appId }}/bot',
			body: {
				sender_email: '={{ $credentials.appId }}_admin@qismo.com',
				room_id: '={{ $parameter.roomId }}',
			},
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'Qiscus-App-Id': '={{ $credentials.appId }}',
				'Qiscus-Secret-Key': '={{ $credentials.appSecret }}',
			},
		},
		properties: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Text',
						value: MessageType.Text,
						routing: {
							request: {
								body: {
									type: 'text',
									message: '={{ $parameter.message }}',
								},
							},
						},
					},
					{
						name: 'Attachment',
						value: MessageType.Attachment,
						routing: {
							request: {
								body: {
									type: 'file_attachment',
									message: '={{ $parameter.message }}',
									payload: {
										url: '={{ $parameter.attachment_url }}',
										caption: '={{ $parameter.caption }}',
									},
								},
							},
						},
					},
				],
				default: 'Text',
			},

			{
				...fields.roomId,
				displayOptions: {
					show: {
						type: [MessageType.Text, MessageType.Attachment],
					},
				},
			},
			{
				...fields.message,
				displayOptions: {
					show: {
						type: [MessageType.Text, MessageType.Attachment],
					},
				},
			},

			{
				displayName: 'Attachment Url',
				name: 'attachment_url',
				default: '',
				required: true,
				type: 'string',
				description: 'The URL of the attachment',
				hint: 'Enter a URL',
				displayOptions: {
					show: {
						type: [MessageType.Attachment],
					},
				},
			},
			{
				displayName: 'Caption',
				name: 'caption',
				default: '',
				description: 'The caption to send',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						type: [MessageType.Attachment],
					},
				},
			},
		],
	};
}
