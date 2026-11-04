import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

/** Regular-expression fragments that pick a Lacuna identifier out of an ID or a page URL. */
export const PAPER_ID = '(art|wrk)_[0-9a-f]{32}';
export const AUTHOR_ID = 'aut_[0-9a-f]{32}';
export const RESOURCE_ID = 'art_[0-9a-f]{32}';
export const DIRECTION_ID = '[0-9]+$';
export const HYPOTHESIS_ID = '[0-9a-f]{16}$';

/**
 * Builds an n8n expression fragment that turns a parameter holding either a bare Lacuna
 * identifier or a Lacuna page URL into the identifier the API expects. When the pattern
 * does not match, the last path segment is used (slugs such as "hugo-larochelle" or "icml").
 */
export function idFromParameter(parameter: string, pattern?: string): string {
	const clean = `String($parameter["${parameter}"]).trim().replace(/[?#].*$/, "").replace(/\\/+$/, "")`;
	const lastSegment = `(${clean}).split("/").pop()`;
	if (!pattern) return lastSegment;
	return `((${clean}).match(/${pattern}/) || [${lastSegment}])[0]`;
}

/** Returns one item per element of the named array in the response. */
export function itemsFrom(property: string) {
	return {
		postReceive: [{ type: 'rootProperty' as const, properties: { property } }],
	};
}

export function limitField(show: IDisplayOptions['show'], maxValue: number): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1, maxValue },
		description: 'Max number of results to return',
		displayOptions: { show },
		routing: { send: { type: 'query', property: 'limit' } },
	};
}

export const offsetOption: INodeProperties = {
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	typeOptions: { minValue: 0 },
	description: 'Number of results to skip, for paging through long lists',
	routing: { send: { type: 'query', property: 'offset' } },
};

export function viewField(show: IDisplayOptions['show'], what: string): INodeProperties {
	return {
		displayName: 'View',
		name: 'view',
		type: 'options',
		default: 'compact',
		description: `How much of the ${what} to return`,
		options: [
			{
				name: 'Compact',
				value: 'compact',
				description: 'Summary plus capped lists; best for AI agents and quick lookups',
			},
			{
				name: 'Complete',
				value: 'complete',
				description: 'Everything, including the raw record and full lists',
			},
		],
		displayOptions: { show },
		routing: { send: { type: 'query', property: 'view' } },
	};
}

export const resourceKindOption: INodeProperties = {
	displayName: 'Kind',
	name: 'kind',
	type: 'options',
	default: 'codebase',
	description: 'Only return resources of this kind',
	options: [
		{ name: 'Codebase', value: 'codebase' },
		{ name: 'Dataset', value: 'dataset' },
		{ name: 'Demo', value: 'demo' },
		{ name: 'Model', value: 'model' },
	],
	routing: { send: { type: 'query', property: 'kind' } },
};

export const resourceProviderOption: INodeProperties = {
	displayName: 'Provider',
	name: 'provider',
	type: 'options',
	default: 'github',
	description: 'Only return resources hosted by this provider',
	options: [
		{ name: 'GitHub', value: 'github' },
		{ name: 'Hugging Face', value: 'huggingface' },
		{ name: 'Zenodo', value: 'zenodo' },
	],
	routing: { send: { type: 'query', property: 'provider' } },
};

export const resourceSortOption: INodeProperties = {
	displayName: 'Sort',
	name: 'sort',
	type: 'options',
	default: 'relevance',
	description: 'Order of the resource list',
	options: [
		{ name: 'Linked Papers', value: 'linked', description: 'Most linked papers first' },
		{ name: 'Popular', value: 'popular', description: 'Most stars, downloads, or likes first' },
		{ name: 'Relevance', value: 'relevance' },
		{ name: 'Updated', value: 'updated', description: 'Most recently updated first' },
	],
	routing: { send: { type: 'query', property: 'sort' } },
};

/** Query, kind, provider, sort, and paging controls shared by every "Get Resources" operation. */
export function resourceListFields(show: IDisplayOptions['show']): INodeProperties[] {
	return [
		limitField(show, 200),
		{
			displayName: 'Filters',
			name: 'filters',
			type: 'collection',
			placeholder: 'Add Filter',
			default: {},
			displayOptions: { show },
			options: [
				resourceKindOption,
				offsetOption,
				resourceProviderOption,
				{
					displayName: 'Query',
					name: 'query',
					type: 'string',
					default: '',
					placeholder: 'e.g. pytorch implementation',
					description: 'Free-text filter over resource names, descriptions, topics, and README text',
					routing: { send: { type: 'query', property: 'q' } },
				},
				resourceSortOption,
			],
		},
	];
}
