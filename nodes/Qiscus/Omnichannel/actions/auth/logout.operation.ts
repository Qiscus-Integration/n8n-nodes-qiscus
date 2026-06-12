import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';

import { updateDisplayOptions, wrapData } from '../../utils';

import { qiscusOmnichannelApiRequest } from '../../transport';

import type { QiscusCredentials } from './../../transport/requestApi';

const properties: INodeProperties[] = [];

const displayOptions = {
	show: {
		resource: ['auth'],
		operation: ['logout'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(
	this: IExecuteFunctions,
	i: number,
	item: INodeExecutionData,
): Promise<INodeExecutionData[]> {
	const credentials: QiscusCredentials = await this.getCredentials('qiscusCredentialsApi');

	const responseData: IDataObject | IDataObject[] = await qiscusOmnichannelApiRequest.call(
		this,
		credentials,
		'POST',
		'api/v1/auth/logout',
	);

	return this.helpers.constructExecutionMetaData(wrapData(responseData), {
		itemData: { item: i },
	});
}
