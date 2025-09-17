import type { IExecuteFunctions, INodeType, INodeTypeDescription } from 'n8n-workflow';

import { description } from './actions/node.description';
import { router } from './actions/router';

export class Omnichannel implements INodeType {
	description: INodeTypeDescription = description;

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
