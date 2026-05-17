import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	bot: 'sendMessage' | 'setBotWebhook';
	sdk: 'sendSystemEvent';
};

export type OmnichannelType = AllEntities<NodeMap>;
