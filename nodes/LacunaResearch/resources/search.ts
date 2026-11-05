import type { INodeProperties } from 'n8n-workflow';
import { itemsFrom, limitField, resourceKindOption, resourceProviderOption } from './shared';

const show = { resource: ['search'], operation: ['search'] };

export const searchDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['search'] } },
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search corpus',
				description:
					'Search papers, research directions, authors, venues, institutions, hypotheses, and research resources',
				routing: {
					request: { method: 'GET', url: '/api/v1/search' },
					output: itemsFrom('results'),
				},
			},
		],
		default: 'search',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. mixture of experts routing',
		description: 'Free-text search query. Paper searches combine lexical and semantic retrieval by default.',
		displayOptions: { show },
		routing: { send: { type: 'query', property: 'q' } },
	},
	limitField(show, 50),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show },
		options: [
			{
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'string',
				default: '',
				placeholder: 'e.g. 2024 or 2024-06',
				description:
					'Inclusive earliest publication date as YYYY, YYYY-MM, or YYYY-MM-DD (paper searches only)',
				routing: { send: { type: 'query', property: 'date_from' } },
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'string',
				default: '',
				placeholder: 'e.g. 2025 or 2025-12-31',
				description:
					'Inclusive latest publication date as YYYY, YYYY-MM, or YYYY-MM-DD (paper searches only)',
				routing: { send: { type: 'query', property: 'date_to' } },
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'string',
				default: '',
				placeholder: 'e.g. title^4,abstract',
				description: 'Comma-separated lexical fields to match, each with an optional ^weight up to 100: title, abstract, summary, concepts, name, top_names, venue, description, topics, provider_key, paper_titles. Cannot be combined with semantic ranking.',
				routing: { send: { type: 'query', property: 'fields' } },
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				typeOptions: { minValue: 0 },
				description: 'Number of results to skip, for paging',
				routing: { send: { type: 'query', property: 'offset' } },
			},
			{
				...resourceProviderOption,
				description: 'Only return resources hosted by this provider (type Resource or All)',
			},
			{
				displayName: 'Ranking Profile',
				name: 'rankingProfile',
				type: 'options',
				default: 'default',
				description: 'How paper results are ranked',
				options: [
					{
						name: 'Default',
						value: 'default',
						description: 'Production ranking; paper searches blend lexical and semantic retrieval',
					},
					{
						name: 'Lexical',
						value: 'bm25_title_abstract',
						description: 'BM25 matching over paper titles and abstracts only',
					},
					{
						name: 'Semantic',
						value: 'semantic',
						description: 'Conceptual paper retrieval; type Paper or All only',
					},
				],
				routing: { send: { type: 'query', property: 'ranking_profile' } },
			},
			{
				...resourceKindOption,
				displayName: 'Resource Kind',
				description: 'Only return resources of this kind (type Resource or All)',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				default: 'relevance',
				description: 'Result order. Semantic ranking cannot use year sorting.',
				options: [
					{ name: 'Relevance', value: 'relevance' },
					{ name: 'Year (Newest First)', value: 'year_desc' },
					{ name: 'Year (Oldest First)', value: 'year_asc' },
				],
				routing: { send: { type: 'query', property: 'sort' } },
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'all',
				description: 'Which kind of entity to search for',
				options: [
					{ name: 'All', value: 'all', description: 'Every entity type, ranked together' },
					{ name: 'Author', value: 'author' },
					{
						name: 'Direction',
						value: 'cluster',
						description: 'Research directions: clusters of related papers',
					},
					{
						name: 'Hypothesis',
						value: 'hypothesis',
						description: 'Generated novel research proposals',
					},
					{ name: 'Institution', value: 'institution' },
					{ name: 'Paper', value: 'paper' },
					{
						name: 'Resource',
						value: 'resource',
						description: 'Code repositories, datasets, models, and demos linked to papers',
					},
					{ name: 'Venue', value: 'venue' },
				],
				routing: { send: { type: 'query', property: 'type' } },
			},
			{
				displayName: 'Venue',
				name: 'venue',
				type: 'string',
				default: '',
				placeholder: 'e.g. icml',
				description: 'Only return papers from this venue slug, such as icml, neurips, or iclr',
				routing: { send: { type: 'query', property: 'venue' } },
			},
		],
	},
];
