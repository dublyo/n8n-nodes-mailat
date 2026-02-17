import { INodeProperties } from 'n8n-workflow';

export const inboxOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['inbox'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List inbox emails',
				action: 'List inbox emails',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific email',
				action: 'Get an email',
			},
			{
				name: 'Get Thread',
				value: 'getThread',
				description: 'Get an email thread',
				action: 'Get an email thread',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search inbox emails',
				action: 'Search inbox emails',
			},
			{
				name: 'Reply',
				value: 'reply',
				description: 'Reply to an email',
				action: 'Reply to an email',
			},
			{
				name: 'Mark Read',
				value: 'markRead',
				description: 'Mark emails as read or unread',
				action: 'Mark emails as read',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete emails',
				action: 'Delete emails',
			},
			{
				name: 'Star',
				value: 'star',
				description: 'Star or unstar emails',
				action: 'Star emails',
			},
		],
		default: 'list',
	},
];

export const inboxFields: INodeProperties[] = [
	// ──────────────────────────────────────
	//         Inbox: List
	// ──────────────────────────────────────
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['list'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['list'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Mailbox ID',
				name: 'mailboxId',
				type: 'string',
				default: '',
				description: 'Filter by mailbox ID',
			},
			{
				displayName: 'Identity ID',
				name: 'identityId',
				type: 'number',
				default: 0,
				description: 'Filter by identity ID',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search within inbox results',
			},
			{
				displayName: 'Unread Only',
				name: 'unread',
				type: 'boolean',
				default: false,
				description: 'Whether to only return unread emails',
			},
			{
				displayName: 'Flagged Only',
				name: 'flagged',
				type: 'boolean',
				default: false,
				description: 'Whether to only return flagged/starred emails',
			},
		],
	},

	// ──────────────────────────────────────
	//         Inbox: Get
	// ──────────────────────────────────────
	{
		displayName: 'Email ID',
		name: 'emailId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the email to retrieve',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['get'],
			},
		},
	},

	// ──────────────────────────────────────
	//         Inbox: Get Thread
	// ──────────────────────────────────────
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		required: true,
		default: '',
		description: 'The ID of the thread to retrieve',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['getThread'],
			},
		},
	},

	// ──────────────────────────────────────
	//         Inbox: Search
	// ──────────────────────────────────────
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		description: 'Search query string',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 20,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['search'],
			},
		},
	},

	// ──────────────────────────────────────
	//         Inbox: Reply
	// ──────────────────────────────────────
	{
		displayName: 'Identity ID',
		name: 'identityId',
		type: 'number',
		required: true,
		default: 0,
		description: 'The ID of the sender identity',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['reply'],
			},
		},
	},
	{
		displayName: 'In Reply To',
		name: 'inReplyTo',
		type: 'string',
		required: true,
		default: '',
		placeholder: '<message-id@domain.com>',
		description: 'The Message-ID header of the email being replied to',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['reply'],
			},
		},
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		required: true,
		default: '',
		description: 'Recipient email address(es)',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['reply'],
			},
		},
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'Re: ...',
		description: 'Email subject line',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['reply'],
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
		description: 'Reply body content type',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['reply'],
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
		description: 'Reply body content',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['reply'],
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
				resource: ['inbox'],
				operation: ['reply'],
			},
		},
		options: [
			{
				displayName: 'CC',
				name: 'cc',
				type: 'string',
				default: '',
				description: 'CC recipients, comma-separated',
			},
			{
				displayName: 'BCC',
				name: 'bcc',
				type: 'string',
				default: '',
				description: 'BCC recipients, comma-separated',
			},
		],
	},

	// ──────────────────────────────────────
	//         Inbox: Mark Read / Delete / Star
	// ──────────────────────────────────────
	{
		displayName: 'Email IDs',
		name: 'emailIds',
		type: 'string',
		required: true,
		default: '',
		description: 'Comma-separated list of email IDs',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['markRead', 'delete', 'star'],
			},
		},
	},
	{
		displayName: 'Read',
		name: 'read',
		type: 'boolean',
		default: true,
		description: 'Whether to mark as read (true) or unread (false)',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['markRead'],
			},
		},
	},
	{
		displayName: 'Flagged',
		name: 'flagged',
		type: 'boolean',
		default: true,
		description: 'Whether to star (true) or unstar (false)',
		displayOptions: {
			show: {
				resource: ['inbox'],
				operation: ['star'],
			},
		},
	},
];
