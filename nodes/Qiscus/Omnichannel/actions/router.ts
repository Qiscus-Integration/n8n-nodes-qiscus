import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import * as bot from './bot';
import * as sdk from './sdk';
import type { OmnichannelType } from './node.type';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];
	const length = items.length;

	const resource = this.getNodeParameter<OmnichannelType>('resource', 0);
	const operation = this.getNodeParameter('operation', 0);

	let executionData: INodeExecutionData[] = [];

	const omnichannelNodeData = {
		resource,
		operation,
	} as OmnichannelType;

	for (let i = 0; i < length; i++) {
		try {
			switch (omnichannelNodeData.resource) {
				case 'bot':
					executionData = await bot[omnichannelNodeData.operation].execute.call(this, i, items[i]);
					break;
				case 'sdk':
					executionData = await sdk[omnichannelNodeData.operation].execute.call(this, i, items[i]);
					break;
				// case 'alert':
				// 	executionData = await alert[omnichannelNodeData.operation].execute.call(
				// 		this,
				// 		i,
				// 		items[i],
				// 	);
				// 	break;
				// case 'case':
				// 	executionData = await case_[omnichannelNodeData.operation].execute.call(
				// 		this,
				// 		i,
				// 		items[i],
				// 	);
				// 	break;
				// case 'comment':
				// 	executionData = await comment[omnichannelNodeData.operation].execute.call(this, i);
				// 	break;
				// case 'log':
				// 	executionData = await log[omnichannelNodeData.operation].execute.call(this, i, items[i]);
				// 	break;
				// case 'observable':
				// 	executionData = await observable[omnichannelNodeData.operation].execute.call(
				// 		this,
				// 		i,
				// 		items[i],
				// 	);
				// 	break;
				// case 'page':
				// 	executionData = await page[omnichannelNodeData.operation].execute.call(this, i);
				// 	break;
				// case 'query':
				// 	executionData = await query[omnichannelNodeData.operation].execute.call(this, i);
				// 	break;
				// case 'task':
				// 	executionData = await task[omnichannelNodeData.operation].execute.call(this, i, items[i]);
				// 	break;
				default:
					throw new NodeOperationError(
						this.getNode(),
						`The operation "${operation}" is not supported!`,
					);
			}
			returnData.push(...executionData);
		} catch (error) {
			if (this.continueOnFail()) {
				executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: error.message }),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
				continue;
			}
			throw error;
		}
	}
	return [returnData];
}
