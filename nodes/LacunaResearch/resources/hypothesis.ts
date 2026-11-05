import type { INodeProperties } from 'n8n-workflow';
import { HYPOTHESIS_ID, idFromParameter, viewOptions, viewQuery } from './shared';

const hypothesisId = idFromParameter('hypothesisId', HYPOTHESIS_ID);
const show = { resource: ['hypothesis'] };

export const hypothesisDescription: INodeProperties[] = [
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
				action: 'Get hypothesis',
				description: 'Get the full hypothesis record with every version of its Markdown',
				routing: { request: { method: 'GET', url: `=/api/v1/hypotheses/{{ ${hypothesisId} }}` } },
			},
			{
				name: 'Get Context',
				value: 'getContext',
				action: 'Get hypothesis context',
				description:
					'Get an agent-oriented summary of a generated research hypothesis with its motivation, approach, experiments, and source directions',
				routing: {
					request: {
						method: 'GET',
						url: `=/api/v1/context/hypothesis/{{ ${hypothesisId} }}`,
						qs: viewQuery,
					},
				},
			},
		],
		default: 'getContext',
	},
	{
		displayName: 'Hypothesis ID',
		name: 'hypothesisId',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. 1f137e828a016983',
		description: 'Lacuna hypothesis ID or the URL of a Lacuna hypothesis page',
		displayOptions: { show },
	},
	viewOptions({ ...show, operation: ['getContext'] }, 'hypothesis context'),
];
