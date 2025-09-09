import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import fields from '../Omnichannel.fields';

export class SendSystemEvent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Qiscus Omnichannel Send System Event',
		name: 'sendSystemEvent',
		icon: { light: 'file:./../../qiscus.svg', dark: 'file:./../../qiscus.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '="{{ $parameter.message }}"',
		description: 'Send system event',
		defaults: {
			name: 'Send System Event',
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
			baseURL: '={{ $credentials.sdkBaseUrl }}/api/v2.1/rest/post_system_event_message',
			body: {
				message: '={{ $parameter.message }} {{ $credentials.appId }}',
				room_id: '={{ $parameter.roomId }}',
				system_event_type: 'custom',
			},
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				QISCUS_SDK_APP_ID: '={{ $credentials.appId }}',
				QISCUS_SDK_SECRET: '={{ $credentials.appSecret }}',
			},
		},

		properties: [fields.roomId, fields.message],
	};
}
