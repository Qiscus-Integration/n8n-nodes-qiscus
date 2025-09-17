import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions, wrapData } from '../../utils';

import { qiscusSDKApiRequest } from '../../transport';

import type { QiscusCredentials } from '../../transport/requestApi';

import descriptions from '../../../common.description';

const properties: INodeProperties[] = [descriptions('roomId'), descriptions('message')];

const displayOptions = {
	show: {
		resource: ['sdk'],
		operation: ['sendSystemEvent'],
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

	const room_id = this.getNodeParameter('roomId', i) as string;
	const message = this.getNodeParameter('message', i) as string;

	const path = 'api/v2.1/rest/post_system_event_message';
	const body: IDataObject = {
		system_event_type: 'custom',
		room_id,
		message,
	};

	responseData = await qiscusSDKApiRequest.call(this, credentials, 'POST', path, body);

	const executionData = this.helpers.constructExecutionMetaData(wrapData(responseData), {
		itemData: { item: i },
	});

	return executionData;
}
