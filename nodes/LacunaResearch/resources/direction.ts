import type { INodeProperties } from 'n8n-workflow';
import { DIRECTION_ID, idFromParameter, itemsFrom, limitField, resourceListFields, viewField } from './shared';

const directionId = idFromParameter('directionId', DIRECTION_ID);
const show = { resource: ['direction'] };

export const directionDescription: INodeProperties[] = [
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
				action: 'Get direction',
				description:
					'Get the full research direction record with its article, sample papers, and concept samples',
				routing: { request: { method: 'GET', url: `=/api/v1/clusters/{{ ${directionId} }}` } },
			},
			{
				name: 'Get Context',
				value: 'getContext',
				action: 'Get direction context',
				description:
					'Get an agent-oriented summary of a research direction with top papers, authors, and related directions',
				routing: {
					request: { method: 'GET', url: `=/api/v1/context/direction/{{ ${directionId} }}` },
				},
			},
			{
				name: 'Get Papers',
				value: 'getPapers',
				action: 'Get direction papers',
				description: 'Get one page of the papers in a research direction',
				routing: {
					request: { method: 'GET', url: `=/api/v1/clusters/{{ ${directionId} }}/papers` },
					output: itemsFrom('papers'),
				},
			},
			{
				name: 'Get Resources',
				value: 'getResources',
				action: 'Get direction resources',
				description:
					'Get the code repositories, datasets, models, and demos linked to papers in a research direction',
				routing: {
					request: { method: 'GET', url: `=/api/v1/directions/{{ ${directionId} }}/resources` },
					output: itemsFrom('resources'),
				},
			},
		],
		default: 'getContext',
	},
	{
		displayName: 'Direction ID',
		name: 'directionId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 12390',
		description: 'Numeric Lacuna direction ID or the URL of a Lacuna direction page',
		displayOptions: { show },
	},
	viewField({ ...show, operation: ['getContext'] }, 'direction context'),
	limitField({ ...show, operation: ['getPapers'] }, 100),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...show, operation: ['getPapers'] } },
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				typeOptions: { minValue: 1 },
				description: 'Which page of papers to return',
				routing: { send: { type: 'query', property: 'page' } },
			},
			{
				displayName: 'View',
				name: 'view',
				type: 'options',
				default: 'compact',
				description: 'How much of each paper to return',
				options: [
					{
						name: 'Compact',
						value: 'compact',
						description: 'Citation-ready fields and an abstract snippet',
					},
					{ name: 'Complete', value: 'complete', description: 'The raw paper record' },
				],
				routing: { send: { type: 'query', property: 'view' } },
			},
		],
	},
	...resourceListFields({ ...show, operation: ['getResources'] }),
];
