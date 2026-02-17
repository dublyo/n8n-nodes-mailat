import { INodeProperties } from 'n8n-workflow';

export const emailOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['email'],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
				description: 'Send a transactional email',
				action: 'Send a transactional email',
			},
			{
				name: 'Send Batch',
				value: 'sendBatch',
				description: 'Send multiple transactional emails',
				action: 'Send batch transactional emails',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get email status and details',
				action: 'Get email status',
			},
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a scheduled email',
				action: 'Cancel a scheduled email',
			},
		],
		default: 'send',
	},
];

export const emailFields: INodeProperties[] = [
	// ──────────────────────────────────────
	//         Email: Send
	// ──────────────────────────────────────
	{
		displayName: 'From',
		name: 'from',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'hello@yourdomain.com',
		description: 'Sender email address (must be a verified identity)',
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['send'],
			},
		},
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'user@example.com',
		description: 'Recipient email address(es), comma-separated',
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['send'],
			},
		},
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		default: '',
		description: 'Email subject line',
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['send'],
			},
		},
	},
	{
		displayName: 'Body Type',
		name: 'bodyType',
		type: 'options',
		options: [
			{ name: 'HTML', value: 'html' },
			{ name: 'Plain Text', value: 'text' },
		],
		default: 'html',
		description: 'Email body content type',
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['send'],
			},
		},
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		required: true,
		default: '',
		description: 'Email body content',
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['send'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'CC',
				name: 'cc',
				type: 'string',
				default: '',
				description: 'CC recipient email(s), comma-separated',
			},
			{
				displayName: 'BCC',
				name: 'bcc',
				type: 'string',
				default: '',
				description: 'BCC recipient email(s), comma-separated',
			},
			{
				displayName: 'Reply-To',
				name: 'replyTo',
				type: 'string',
				default: '',
				description: 'Reply-to email address',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				default: '',
				description: 'Use a Mailat template UUID instead of body content',
			},
			{
				displayName: 'Template Variables',
				name: 'templateVariables',
				type: 'json',
				default: '{}',
				description: 'Key-value pairs for template merge fields',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tags for tracking',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata key-value pairs',
			},
			{
				displayName: 'Schedule At',
				name: 'scheduledFor',
				type: 'dateTime',
				default: '',
				description: 'Schedule email for later delivery (ISO 8601)',
			},
		],
	},

	// ──────────────────────────────────────
	//         Email: Send Batch
	// ──────────────────────────────────────
	{
		displayName: 'Emails (JSON)',
		name: 'emails',
		type: 'json',
		required: true,
		default: '[]',
		description: 'Array of email objects, each with from, to, subject, html/text fields',
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['sendBatch'],
			},
		},
	},

	// ──────────────────────────────────────
	//         Email: Get / Cancel
	// ──────────────────────────────────────
	{
		displayName: 'Email ID',
		name: 'emailId',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the transactional email',
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['get', 'cancel'],
			},
		},
	},
];
