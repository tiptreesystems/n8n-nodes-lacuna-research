# n8n-nodes-lacuna-research

This is an n8n community node. It lets you use [Lacuna Research](https://lacuna.tiptreesystems.com) in your n8n workflows.

Lacuna is a knowledge graph of machine learning and AI research. It organizes more than two million papers into tens of thousands of named research directions, links them to authors, venues, and institutions, generates research hypotheses, and tracks the code repositories, datasets, models, and demos that papers publish. This node calls Lacuna's public read-only API, so it needs no account or API key.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. The npm package name is `n8n-nodes-lacuna-research`.

## Operations

Every operation is a GET request against `https://lacuna.tiptreesystems.com/api/v1`. Operations that return lists emit one n8n item per element; the others emit one item.

| Resource | Operation | What it returns |
| --- | --- | --- |
| Search | Search | Ranked matches for a free-text query across all entity types, or one type (paper, direction, author, venue, institution, hypothesis, resource). Filters for dates, venue, sort order, ranking profile, lexical fields, resource kind, and provider. |
| Paper | Get | The full paper record with abstract and metadata |
| Paper | Get Blog | The generated blog-style explainer |
| Paper | Get Concepts | Extracted problems, mechanisms, findings, and limitations |
| Paper | Get Context | An agent-oriented summary with authors, figures, versions, and links (compact or complete view) |
| Paper | Get Figures | Figures with captions and image URLs |
| Paper | Get Neighbors | Papers sharing research directions and concepts |
| Paper | Get Preview | A short preview card |
| Paper | Get Resources | Linked code, datasets, models, and demos |
| Author | Get | The full author record |
| Author | Get Context | An agent-oriented profile with recent papers and research directions |
| Author | Get Directions | Research directions the author has published in |
| Author | Get Impact | Per-direction impact scores |
| Author | Get Neighbors | Authors whose work is closest |
| Author | Get Papers | The author's papers, newest first |
| Author | Get Resources | Resources linked to the author's papers |
| Author | Resolve | The Lacuna author matching an ORCID, Google Scholar ID, OpenReview profile, DBLP PID, OpenAlex ID, Semantic Scholar ID, homepage, GitHub, or LinkedIn URL |
| Direction | Get | The full research direction record with its article and samples |
| Direction | Get Context | An agent-oriented summary with top papers, authors, and related directions |
| Direction | Get Papers | The papers in the direction |
| Direction | Get Resources | Resources linked to papers in the direction |
| Venue | Get Context | A venue summary with top directions, authors, representative papers, and activity by year, optionally for one edition year |
| Institution | Get Authors | Authors affiliated with the institution |
| Institution | Get Context | An institution summary with its most active authors |
| Hypothesis | Get | The full generated hypothesis with every version |
| Hypothesis | Get Context | A summary with motivation, approach, experiments, and source directions |
| Resource | Get | One code repository, dataset, model, or demo with its linked papers |
| Resource | Get Many | Resources filtered by query, kind, provider, paper, author, direction, stars, downloads, and update date |
| Corpus | Get Statistics | How many papers, directions, authors, venues, institutions, and hypotheses are indexed |

## Credentials

None. The Lacuna API is public and read-only. Please keep automated traffic reasonable: search calls run a semantic ranking step and take a few seconds each, and the service answers `Service temporarily busy` when it is overloaded. Use the Retry On Fail setting of the node for scheduled workflows.

## Compatibility

Built with `@n8n/node-cli` and tested against the current n8n release. The node has no runtime dependencies.

## Usage

**Identifiers or URLs.** Every ID field also accepts the URL of the matching Lacuna page. For example, the Paper ID field takes `art_a0bd7b7f576e42a18159cc69b1a42233` or `https://lacuna.tiptreesystems.com/work/mixture-of-experts-with-expert-choice-routing/version/art_a0bd7b7f576e42a18159cc69b1a42233`. Author fields also take the page slug such as `hugo-larochelle`. Venue fields take the slug such as `icml`.

**Finding IDs.** Run a Search first. Each result carries its `id` and Lacuna `url`, which you can pass to the Get operations of the matching resource.

**Views.** Context operations and Direction Get Papers return the compact view, which is sized for AI agents and summaries. Add View under Options and pick Complete for raw records and full lists.

**AI agents.** The node is marked as usable as a tool, so it can be attached to an AI Agent node. A typical setup is one tool instance for `Search → Search` with the Query field set to be filled by the model, and one for `Paper → Get Context`.

**Paging.** List operations have a Return All switch that fetches every page for you, and a Limit when it is off. Search and Get Neighbors return ranked top results, so they take a Limit only. Search returns at most 50 results per call, with an Offset under Additional Fields.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Lacuna Research](https://lacuna.tiptreesystems.com)
* [Lacuna API reference](https://lacuna.tiptreesystems.com/docs)
* [Lacuna for AI assistants (MCP)](https://lacuna.tiptreesystems.com/mcp)

## Version history

* 0.1.0: initial release.
