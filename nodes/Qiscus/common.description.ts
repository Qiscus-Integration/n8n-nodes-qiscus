import { INodeProperties } from 'n8n-workflow';
import merge from 'lodash/merge';

const properties = {
	roomId: {
		displayName: 'Room ID',
		name: 'roomId',
		type: 'string',
		default: '',
		required: true,
		description: 'Input room ID',
		placeholder: '345737961',
	},

	message: {
		displayName: 'Message',
		name: 'message',
		type: 'string',
		default: '',
		required: true,
		description: 'The message to send',
	},

	attachment_url: {
		displayName: 'Attachment Url',
		name: 'attachment_url',
		type: 'string',
		default: '',
		required: true,
		description: 'The URL of the attachment',
		hint: 'Enter a URL',
	},

	caption: {
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		default: '',
		required: true,
		description: 'The caption to send',
	},
};

const descriptions = (
	name: keyof typeof properties,
	props?: Partial<INodeProperties>,
): INodeProperties => {
	const property = properties[name];

	return merge(property, props);
};

export default descriptions;
