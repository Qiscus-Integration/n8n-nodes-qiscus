import { INodeProperties } from 'n8n-workflow';

const roomId: INodeProperties = {
	displayName: 'Room ID',
	description: 'Input room ID',
	placeholder: '345737961',
	name: 'roomId',
	type: 'string',
	default: '',
	required: true,
};

const message: INodeProperties = {
	displayName: 'Message',
	description: 'The message to send',
	name: 'message',
	type: 'string',
	default: '',
	required: true,
};

export default { roomId, message };
