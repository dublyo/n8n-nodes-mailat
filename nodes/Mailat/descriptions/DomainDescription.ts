import { INodeProperties } from 'n8n-workflow';

export const domainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['domain'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all domains',
				action: 'List all domains',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get domain details',
				action: 'Get domain details',
			},
		],
		default: 'list',
	},
];

export const domainFields: INodeProperties[] = [
	{
		displayName: 'Domain UUID',
		name: 'domainUuid',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the domain',
		displayOptions: {
			show: {
				resource: ['domain'],
				operation: ['get'],
			},
		},
	},
];
