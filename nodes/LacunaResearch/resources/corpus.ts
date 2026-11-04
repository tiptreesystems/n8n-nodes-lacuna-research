import type { INodeProperties } from 'n8n-workflow';

export const corpusDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['corpus'] } },
		options: [
			{
				name: 'Get Statistics',
				value: 'getStatistics',
				action: 'Get corpus statistics',
				description:
					'Get how many papers, research directions, authors, venues, institutions, and hypotheses Lacuna currently indexes',
				routing: { request: { method: 'GET', url: '/api/v1/stats/corpus' } },
			},
		],
		default: 'getStatistics',
	},
];
