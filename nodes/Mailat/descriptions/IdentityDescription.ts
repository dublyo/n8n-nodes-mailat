import { INodeProperties } from 'n8n-workflow';

export const identityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['identity'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all identities',
				action: 'List all identities',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get identity details',
				action: 'Get identity details',
			},
		],
		default: 'list',
	},
];

export const identityFields: INodeProperties[] = [
	{
		displayName: 'Identity UUID',
		name: 'identityUuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the identity',
		displayOptions: {
			show: {
				resource: ['identity'],
				operation: ['get'],
			},
		},
	},
];
