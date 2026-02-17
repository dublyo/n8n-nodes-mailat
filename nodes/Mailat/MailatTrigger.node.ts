import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { mailatApiRequest } from './GenericFunctions';

export class MailatTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mailat Trigger',
		name: 'mailatTrigger',
		icon: 'file:mailat.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts a workflow when a Mailat event occurs',
		defaults: {
			name: 'Mailat Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'mailatApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The events to listen to',
				options: [
					{
						name: 'Bounce Received',
						value: 'bounce_received',
						description: 'An email bounced',
					},
					{
						name: 'Campaign Sent',
						value: 'campaign_sent',
						description: 'A campaign was sent',
					},
					{
						name: 'Complaint Received',
						value: 'complaint_received',
						description: 'A spam complaint was received',
					},
					{
						name: 'Contact Created',
						value: 'contact_created',
						description: 'A new contact was created',
					},
					{
						name: 'Contact Deleted',
						value: 'contact_deleted',
						description: 'A contact was deleted',
					},
					{
						name: 'Contact Updated',
						value: 'contact_updated',
						description: 'A contact was updated',
					},
					{
						name: 'Email Received',
						value: 'email_received',
						description: 'A new email was received in inbox',
					},
					{
						name: 'Email Sent',
						value: 'email_sent',
						description: 'An email was sent via API',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const webhookData = this.getWorkflowStaticData('node');

				try {
					const triggers = await mailatApiRequest.call(
						this, 'GET', '/webhook-triggers',
					);
					if (Array.isArray(triggers)) {
						// Find triggers matching this webhook URL
						const matching = triggers.filter(
							(t: any) => t.webhookUrl === webhookUrl,
						);

						// Check if all selected events are covered
						const existingTypes = matching.map((t: any) => t.triggerType);
						const allCovered = events.every((e) => existingTypes.includes(e));

						if (allCovered && matching.length > 0) {
							webhookData.triggerIds = matching.map((t: any) => t.id);
							return true;
						}

						// Stale triggers exist — delete them so create() starts fresh
						for (const t of matching) {
							try {
								await mailatApiRequest.call(
									this, 'DELETE', `/webhook-triggers/${t.id}`,
								);
							} catch {
								// best-effort
							}
						}
					}
				} catch {
					// API unreachable or triggers gone
				}

				delete webhookData.triggerIds;
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const webhookData = this.getWorkflowStaticData('node');

				const triggerIds: number[] = [];

				for (const event of events) {
					try {
						const trigger = await mailatApiRequest.call(
							this, 'POST', '/webhook-triggers',
							{
								name: `n8n: ${event}`,
								triggerType: event,
								webhookUrl,
								active: true,
							},
						);
						if (trigger?.id) {
							triggerIds.push(trigger.id);
						}
					} catch {
						// If one fails, continue with others
					}
				}

				if (triggerIds.length === 0) {
					return false;
				}

				webhookData.triggerIds = triggerIds;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const triggerIds = webhookData.triggerIds as number[] | undefined;

				if (!triggerIds || triggerIds.length === 0) {
					return true;
				}

				for (const id of triggerIds) {
					try {
						await mailatApiRequest.call(this, 'DELETE', `/webhook-triggers/${id}`);
					} catch {
						// Best-effort cleanup
					}
				}

				delete webhookData.triggerIds;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = req.body as {
			event?: string;
			timestamp?: string;
			data?: Record<string, any>;
		};

		return {
			workflowData: [
				this.helpers.returnJsonArray({
					event: body.event || 'unknown',
					timestamp: body.timestamp || new Date().toISOString(),
					...body.data,
				}),
			],
		};
	}
}
