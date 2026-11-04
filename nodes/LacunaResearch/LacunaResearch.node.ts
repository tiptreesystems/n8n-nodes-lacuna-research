import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { authorDescription } from './resources/author';
import { corpusDescription } from './resources/corpus';
import { directionDescription } from './resources/direction';
import { hypothesisDescription } from './resources/hypothesis';
import { institutionDescription } from './resources/institution';
import { paperDescription } from './resources/paper';
import { resourceDescription } from './resources/resource';
import { searchDescription } from './resources/search';
import { venueDescription } from './resources/venue';

export class LacunaResearch implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lacuna Research',
		name: 'lacunaResearch',
		icon: { light: 'file:lacunaResearch.svg', dark: 'file:lacunaResearch.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Search and read the Lacuna knowledge graph of machine learning and AI research: papers, research directions, authors, venues, institutions, hypotheses, and linked code, datasets, and models',
		defaults: {
			name: 'Lacuna Research',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		requestDefaults: {
			baseURL: 'https://lacuna.tiptreesystems.com',
			headers: {
				Accept: 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Author', value: 'author' },
					{ name: 'Corpus', value: 'corpus' },
					{ name: 'Direction', value: 'direction' },
					{ name: 'Hypothesis', value: 'hypothesis' },
					{ name: 'Institution', value: 'institution' },
					{ name: 'Paper', value: 'paper' },
					{ name: 'Resource', value: 'resource' },
					{ name: 'Search', value: 'search' },
					{ name: 'Venue', value: 'venue' },
				],
				default: 'search',
			},
			...searchDescription,
			...paperDescription,
			...authorDescription,
			...directionDescription,
			...venueDescription,
			...institutionDescription,
			...hypothesisDescription,
			...resourceDescription,
			...corpusDescription,
		],
	};
}
