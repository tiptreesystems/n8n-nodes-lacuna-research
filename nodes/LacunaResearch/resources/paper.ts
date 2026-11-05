import type { INodeProperties } from 'n8n-workflow';
import { idFromParameter, itemsFrom, PAPER_ID, resourceListFields, viewOption, viewQuery } from './shared';

const paperId = idFromParameter('paperId', PAPER_ID);
const show = { resource: ['paper'] };

export const paperDescription: INodeProperties[] = [
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
				action: 'Get paper',
				description: 'Get the full paper record, including abstract and metadata',
				routing: { request: { method: 'GET', url: `=/api/v1/papers/{{ ${paperId} }}` } },
			},
			{
				name: 'Get Blog',
				value: 'getBlog',
				action: 'Get paper blog',
				description: 'Get the generated blog-style explainer of a paper',
				routing: { request: { method: 'GET', url: `=/api/v1/papers/{{ ${paperId} }}/blog` } },
			},
			{
				name: 'Get Concepts',
				value: 'getConcepts',
				action: 'Get paper concepts',
				description:
					'Get the extracted concepts of a paper: problems, mechanisms, findings, and limitations',
				routing: {
					request: { method: 'GET', url: `=/api/v1/papers/{{ ${paperId} }}/concepts` },
					output: itemsFrom('concepts'),
				},
			},
			{
				name: 'Get Context',
				value: 'getContext',
				action: 'Get paper context',
				description:
					'Get an agent-oriented summary of a paper with authors, figures, versions, and links',
				routing: {
					request: {
						method: 'GET',
						url: `=/api/v1/context/{{ ${paperId}.startsWith("wrk_") ? "work" : "paper" }}/{{ ${paperId} }}`,
						qs: viewQuery,
					},
				},
			},
			{
				name: 'Get Figures',
				value: 'getFigures',
				action: 'Get paper figures',
				description: 'Get the figures of a paper with captions and image URLs',
				routing: {
					request: { method: 'GET', url: `=/api/v1/papers/{{ ${paperId} }}/figures` },
					output: itemsFrom('figures'),
				},
			},
			{
				name: 'Get Neighbors',
				value: 'getNeighbors',
				action: 'Get paper neighbors',
				description: 'Get papers that share research directions and concepts with a paper',
				routing: {
					request: { method: 'GET', url: `=/api/v1/papers/{{ ${paperId} }}/neighbors` },
					output: itemsFrom('neighbors'),
				},
			},
			{
				name: 'Get Preview',
				value: 'getPreview',
				action: 'Get paper preview',
				description: 'Get a short preview card of a paper',
				routing: { request: { method: 'GET', url: `=/api/v1/papers/{{ ${paperId} }}/preview` } },
			},
			{
				name: 'Get Resources',
				value: 'getResources',
				action: 'Get paper resources',
				description: 'Get the code repositories, datasets, models, and demos linked to a paper',
				routing: {
					request: { method: 'GET', url: `=/api/v1/papers/{{ ${paperId} }}/resources` },
					output: itemsFrom('resources'),
				},
			},
		],
		default: 'getContext',
	},
	{
		displayName: 'Paper ID',
		name: 'paperId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. art_a0bd7b7f576e42a18159cc69b1a42233',
		description: 'Lacuna artifact ID (art_…) or the URL of a Lacuna paper page. Get Context also accepts a work ID (wrk_…).',
		displayOptions: { show },
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...show, operation: ['getContext'] } },
		options: [
			{
				displayName: 'Figure Limit',
				name: 'figureLimit',
				type: 'number',
				default: 3,
				typeOptions: { minValue: 0 },
				description: 'Compact view only: how many figures to include. Use 0 for none.',
				routing: { send: { type: 'query', property: 'figure_limit' } },
			},
			{
				displayName: 'Include Resources',
				name: 'includeResources',
				type: 'boolean',
				default: false,
				description: 'Whether to include linked code, datasets, models, and demos',
				routing: { send: { type: 'query', property: 'include_resources' } },
			},
			viewOption('paper context'),
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...show, operation: ['get'] } },
		options: [
			{
				displayName: 'Include Resources',
				name: 'includeResources',
				type: 'boolean',
				default: false,
				description: 'Whether to include linked code, datasets, models, and demos',
				routing: { send: { type: 'query', property: 'include_resources' } },
			},
		],
	},
	...resourceListFields({ ...show, operation: ['getResources'] }),
];
