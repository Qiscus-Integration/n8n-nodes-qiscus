import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	auth: 'loginAdmin' | 'getIdentityToken';
	bot: 'sendMessage' | 'setBotWebhook';
	sdk: 'sendSystemEvent';
};

export type OmnichannelType = AllEntities<NodeMap>;
