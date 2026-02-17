import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { mailatApiRequest, mailatApiRequestAllItems } from './GenericFunctions';
import { emailOperations, emailFields } from './descriptions/EmailDescription';
import { inboxOperations, inboxFields } from './descriptions/InboxDescription';
import { domainOperations, domainFields } from './descriptions/DomainDescription';
import { identityOperations, identityFields } from './descriptions/IdentityDescription';

export class Mailat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mailat',
		name: 'mailat',
		icon: 'file:mailat.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Send emails, manage inbox, and more with Mailat',
		defaults: {
			name: 'Mailat',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'mailatApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Email',
						value: 'email',
						description: 'Send and manage transactional emails',
					},
					{
						name: 'Inbox',
						value: 'inbox',
						description: 'Read and manage inbox emails',
					},
					{
						name: 'Domain',
						value: 'domain',
						description: 'View configured domains',
					},
					{
						name: 'Identity',
						value: 'identity',
						description: 'View email identities',
					},
				],
				default: 'email',
			},
			...emailOperations,
			...emailFields,
			...inboxOperations,
			...inboxFields,
			...domainOperations,
			...domainFields,
			...identityOperations,
			...identityFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				// ── Email ──────────────────────────────
				if (resource === 'email') {
					if (operation === 'send') {
						const from = this.getNodeParameter('from', i) as string;
						const to = this.getNodeParameter('to', i) as string;
						const subject = this.getNodeParameter('subject', i) as string;
						const bodyType = this.getNodeParameter('bodyType', i) as string;
						const body = this.getNodeParameter('body', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							cc?: string;
							bcc?: string;
							replyTo?: string;
							templateId?: string;
							templateVariables?: string;
							tags?: string;
							metadata?: string;
							scheduledFor?: string;
						};

						const emailBody: Record<string, any> = {
							from,
							to: to.split(',').map((e) => e.trim()),
							subject,
						};

						if (bodyType === 'html') {
							emailBody.html = body;
						} else {
							emailBody.text = body;
						}

						if (additionalFields.cc) {
							emailBody.cc = additionalFields.cc.split(',').map((e) => e.trim());
						}
						if (additionalFields.bcc) {
							emailBody.bcc = additionalFields.bcc.split(',').map((e) => e.trim());
						}
						if (additionalFields.replyTo) {
							emailBody.replyTo = additionalFields.replyTo;
						}
						if (additionalFields.templateId) {
							emailBody.templateId = additionalFields.templateId;
						}
						if (additionalFields.templateVariables) {
							emailBody.variables = JSON.parse(additionalFields.templateVariables);
						}
						if (additionalFields.tags) {
							emailBody.tags = additionalFields.tags.split(',').map((t) => t.trim());
						}
						if (additionalFields.metadata) {
							emailBody.metadata = JSON.parse(additionalFields.metadata);
						}
						if (additionalFields.scheduledFor) {
							emailBody.scheduledFor = additionalFields.scheduledFor;
						}

						responseData = await mailatApiRequest.call(this, 'POST', '/emails', emailBody);
					}

					if (operation === 'sendBatch') {
						const emails = JSON.parse(this.getNodeParameter('emails', i) as string);
						responseData = await mailatApiRequest.call(this, 'POST', '/emails/batch', { emails });
					}

					if (operation === 'get') {
						const emailId = this.getNodeParameter('emailId', i) as string;
						responseData = await mailatApiRequest.call(this, 'GET', `/emails/${emailId}`);
					}

					if (operation === 'cancel') {
						const emailId = this.getNodeParameter('emailId', i) as string;
						responseData = await mailatApiRequest.call(this, 'DELETE', `/emails/${emailId}`);
					}
				}

				// ── Inbox ──────────────────────────────
				if (resource === 'inbox') {
					if (operation === 'list') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as {
							mailboxId?: string;
							identityId?: number;
							search?: string;
							unread?: boolean;
							flagged?: boolean;
						};

						const qs: Record<string, any> = {};
						if (filters.mailboxId) qs.mailboxId = filters.mailboxId;
						if (filters.identityId) qs.identityId = filters.identityId;
						if (filters.search) qs.search = filters.search;
						if (filters.unread !== undefined) qs.unread = filters.unread;
						if (filters.flagged !== undefined) qs.flagged = filters.flagged;

						if (returnAll) {
							responseData = await mailatApiRequestAllItems.call(
								this, 'GET', '/inbox', 'emails', qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.pageSize = limit;
							qs.page = 1;
							const data = await mailatApiRequest.call(this, 'GET', '/inbox', undefined, qs);
							responseData = data?.emails || data;
						}
					}

					if (operation === 'get') {
						const emailId = this.getNodeParameter('emailId', i) as string;
						responseData = await mailatApiRequest.call(this, 'GET', `/inbox/emails/${emailId}`);
					}

					if (operation === 'getThread') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						responseData = await mailatApiRequest.call(this, 'GET', `/inbox/threads/${threadId}`);
					}

					if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;
						responseData = await mailatApiRequest.call(this, 'GET', '/inbox/search', undefined, {
							q: query,
							pageSize: limit,
						});
						responseData = responseData?.emails || responseData;
					}

					if (operation === 'reply') {
						const identityId = this.getNodeParameter('identityId', i) as number;
						const inReplyTo = this.getNodeParameter('inReplyTo', i) as string;
						const to = this.getNodeParameter('to', i) as string;
						const subject = this.getNodeParameter('subject', i) as string;
						const bodyType = this.getNodeParameter('bodyType', i) as string;
						const body = this.getNodeParameter('body', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as {
							cc?: string;
							bcc?: string;
						};

						const recipients = to.split(',').map((e) => e.trim()).map((email) => ({
							email,
							name: '',
						}));

						const replyBody: Record<string, any> = {
							identityId,
							to: recipients,
							subject,
							inReplyTo,
							references: [inReplyTo],
						};

						if (bodyType === 'html') {
							replyBody.htmlBody = body;
						} else {
							replyBody.textBody = body;
						}

						if (additionalFields.cc) {
							replyBody.cc = additionalFields.cc.split(',').map((e) => e.trim()).map((email) => ({
								email,
								name: '',
							}));
						}
						if (additionalFields.bcc) {
							replyBody.bcc = additionalFields.bcc.split(',').map((e) => e.trim()).map((email) => ({
								email,
								name: '',
							}));
						}

						responseData = await mailatApiRequest.call(this, 'POST', '/compose/send', replyBody);
					}

					if (operation === 'markRead') {
						const emailIdStr = this.getNodeParameter('emailIds', i) as string;
						const read = this.getNodeParameter('read', i) as boolean;
						responseData = await mailatApiRequest.call(this, 'POST', '/inbox/mark-read', {
							emailIds: emailIdStr.split(',').map((id) => id.trim()),
							read,
						});
					}

					if (operation === 'delete') {
						const emailIdStr = this.getNodeParameter('emailIds', i) as string;
						responseData = await mailatApiRequest.call(this, 'POST', '/inbox/delete', {
							emailIds: emailIdStr.split(',').map((id) => id.trim()),
						});
					}

					if (operation === 'star') {
						const emailIdStr = this.getNodeParameter('emailIds', i) as string;
						const flagged = this.getNodeParameter('flagged', i) as boolean;
						responseData = await mailatApiRequest.call(this, 'POST', '/inbox/toggle-flag', {
							emailIds: emailIdStr.split(',').map((id) => id.trim()),
							flagged,
						});
					}
				}

				// ── Domain ─────────────────────────────
				if (resource === 'domain') {
					if (operation === 'list') {
						responseData = await mailatApiRequest.call(this, 'GET', '/domains');
					}

					if (operation === 'get') {
						const domainUuid = this.getNodeParameter('domainUuid', i) as string;
						responseData = await mailatApiRequest.call(this, 'GET', `/domains/${domainUuid}`);
					}
				}

				// ── Identity ───────────────────────────
				if (resource === 'identity') {
					if (operation === 'list') {
						responseData = await mailatApiRequest.call(this, 'GET', '/identities');
					}

					if (operation === 'get') {
						const identityUuid = this.getNodeParameter('identityUuid', i) as string;
						responseData = await mailatApiRequest.call(this, 'GET', `/identities/${identityUuid}`);
					}
				}

				// Normalize output
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as any),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
