import type { INodeProperties } from 'n8n-workflow';
import { idFromParameter, itemsFrom, listFields, viewOptions, viewQuery } from './shared';

const institutionKey = idFromParameter('institution');
const show = { resource: ['institution'] };

export const institutionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show },
		options: [
			{
				name: 'Get Authors',
				value: 'getAuthors',
				action: 'Get institution authors',
				description: 'Get the authors affiliated with an institution',
				routing: {
					request: { method: 'GET', url: `=/api/v1/institutions/{{ ${institutionKey} }}/authors` },
					output: itemsFrom('authors'),
				},
			},
			{
				name: 'Get Context',
				value: 'getContext',
				action: 'Get institution context',
				description: 'Get an agent-oriented summary of an institution with its most active authors',
				routing: {
					request: {
						method: 'GET',
						url: `=/api/v1/context/institution/{{ ${institutionKey} }}`,
						qs: viewQuery,
					},
				},
			},
		],
		default: 'getContext',
	},
	{
		displayName: 'Institution',
		name: 'institution',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 4dcec9f61a19',
		description: 'Lacuna institution key or the URL of a Lacuna institution page',
		displayOptions: { show },
	},
	viewOptions({ ...show, operation: ['getContext'] }, 'institution context'),
	...listFields({ ...show, operation: ['getAuthors'] }, 200),
];
