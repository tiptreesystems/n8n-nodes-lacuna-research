import type { INodeProperties } from 'n8n-workflow';
import {
	AUTHOR_ID,
	idFromParameter,
	itemsFrom,
	limitField,
	offsetOption,
	resourceListFields,
	viewField,
} from './shared';

const authorId = idFromParameter('authorId', AUTHOR_ID);
const show = { resource: ['author'] };
const pagedOperations = ['getDirections', 'getNeighbors', 'getPapers'];

export const authorDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get author',
				description: 'Get the full author record, including every paper',
				routing: { request: { method: 'GET', url: `=/api/v1/authors/{{ ${authorId} }}` } },
			},
			{
				name: 'Get Context',
				value: 'getContext',
				action: 'Get author context',
				description:
					'Get an agent-oriented profile of an author with recent papers and research directions',
				routing: { request: { method: 'GET', url: `=/api/v1/context/author/{{ ${authorId} }}` } },
			},
			{
				name: 'Get Directions',
				value: 'getDirections',
				action: 'Get author directions',
				description: 'Get the research directions an author has published in',
				routing: {
					request: { method: 'GET', url: `=/api/v1/authors/{{ ${authorId} }}/directions` },
					output: itemsFrom('directions'),
				},
			},
			{
				name: 'Get Impact',
				value: 'getImpact',
				action: 'Get author impact',
				description: 'Get per-direction impact scores for an author',
				routing: {
					request: { method: 'GET', url: `=/api/v1/authors/{{ ${authorId} }}/impact` },
					output: itemsFrom('impact_clusters'),
				},
			},
			{
				name: 'Get Neighbors',
				value: 'getNeighbors',
				action: 'Get author neighbors',
				description: 'Get authors whose work is closest to an author',
				routing: {
					request: { method: 'GET', url: `=/api/v1/authors/{{ ${authorId} }}/neighbors` },
					output: itemsFrom('neighbors'),
				},
			},
			{
				name: 'Get Papers',
				value: 'getPapers',
				action: 'Get author papers',
				description: 'Get the papers of an author, newest first',
				routing: {
					request: { method: 'GET', url: `=/api/v1/authors/{{ ${authorId} }}/papers` },
					output: itemsFrom('papers'),
				},
			},
			{
				name: 'Get Resources',
				value: 'getResources',
				action: 'Get author resources',
				description:
					'Get the code repositories, datasets, models, and demos linked to the papers of an author',
				routing: {
					request: { method: 'GET', url: `=/api/v1/authors/{{ ${authorId} }}/resources` },
					output: itemsFrom('resources'),
				},
			},
			{
				name: 'Resolve',
				value: 'resolve',
				action: 'Resolve author identifier',
				description:
					'Find the Lacuna author matching an ORCID, Google Scholar ID, OpenReview profile, homepage, or other public identifier',
				routing: { request: { method: 'GET', url: '/api/v1/authors/resolve' } },
			},
		],
		default: 'getContext',
	},
	{
		displayName: 'Author ID',
		name: 'authorId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. aut_9a43ce0c12d4446283619cfb922f1e17 or hugo-larochelle',
		description: 'Lacuna author ID (aut_…), author page slug, or the URL of a Lacuna author page',
		displayOptions: { show: { ...show, operation: ['get', 'getContext', 'getImpact', 'getResources', ...pagedOperations] } },
	},
	{
		displayName: 'Identifier Type',
		name: 'identifierType',
		type: 'options',
		default: 'orcid',
		description: 'Which public identifier is being looked up',
		options: [
			{ name: 'DBLP PID', value: 'dblp_pid' },
			{ name: 'GitHub URL', value: 'github_url' },
			{ name: 'Google Scholar ID', value: 'scholar_id' },
			{ name: 'Homepage URL', value: 'homepage_url' },
			{ name: 'Lacuna Author ID', value: 'author_id' },
			{ name: 'LinkedIn URL', value: 'linkedin_url' },
			{ name: 'OpenAlex Author ID', value: 'openalex_author_id' },
			{ name: 'OpenReview Profile ID', value: 'openreview_profile_id' },
			{ name: 'ORCID', value: 'orcid' },
			{ name: 'Semantic Scholar ID', value: 'semantic_scholar_id' },
		],
		displayOptions: { show: { ...show, operation: ['resolve'] } },
		routing: { send: { type: 'query', property: 'identifier_type' } },
	},
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 0000-0002-1825-0097',
		description: 'The identifier value to resolve',
		displayOptions: { show: { ...show, operation: ['resolve'] } },
		routing: { send: { type: 'query', property: 'identifier' } },
	},
	viewField({ ...show, operation: ['getContext'] }, 'author profile'),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...show, operation: ['getContext'] } },
		options: [
			{
				displayName: 'Include Neighbors',
				name: 'includeNeighbors',
				type: 'boolean',
				default: false,
				description: 'Whether to include similar authors. This can add several seconds of latency.',
				routing: { send: { type: 'query', property: 'include_neighbors' } },
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...show, operation: ['resolve'] } },
		options: [
			{
				displayName: 'Include Profile Markdown',
				name: 'includeProfileMarkdown',
				type: 'boolean',
				default: false,
				description: 'Whether to include the Markdown profile of each matched author',
				routing: { send: { type: 'query', property: 'include_profile_markdown' } },
			},
		],
	},
	limitField({ ...show, operation: pagedOperations }, 200),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...show, operation: pagedOperations } },
		options: [offsetOption],
	},
	...resourceListFields({ ...show, operation: ['getResources'] }),
];
