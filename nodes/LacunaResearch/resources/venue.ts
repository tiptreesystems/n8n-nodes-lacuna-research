import type { INodeProperties } from 'n8n-workflow';
import { idFromParameter, viewField } from './shared';

const venueKey = idFromParameter('venue');
const show = { resource: ['venue'] };

export const venueDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Get Context',
				value: 'getContext',
				action: 'Get venue context',
				description:
					'Get an agent-oriented summary of a venue with top directions, authors, representative papers, and activity by year',
				routing: {
					request: {
						method: 'GET',
						url: `=/api/v1/context/venue/{{ ${venueKey} }}{{ $parameter["year"] ? "/" + $parameter["year"] : "" }}`,
					},
				},
			},
		],
		default: 'getContext',
	},
	{
		displayName: 'Venue',
		name: 'venue',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. icml',
		description: 'Venue slug such as icml, neurips, or iclr, or the URL of a Lacuna venue page',
		displayOptions: { show },
	},
	{
		displayName: 'Year',
		name: 'year',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Restrict the summary to one edition year. Use 0 for all years.',
		displayOptions: { show },
	},
	viewField({ ...show, operation: ['getContext'] }, 'venue context'),
];
