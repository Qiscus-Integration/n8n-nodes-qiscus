import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	bot: 'sendMessage';
	sdk: 'sendSystemEvent';
};

export type OmnichannelType = AllEntities<NodeMap>;
