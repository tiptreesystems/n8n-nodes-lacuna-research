# Changelog

## 0.2.0

- List operations now have Return All plus a Limit, and the node fetches the pages itself. The Offset and Page fields are gone from those operations and from Get Neighbors.
- View on the context operations, Year on Venue Get Context, and Type on Search moved into the Options or Additional Fields collections.
- Direction Get Papers now returns the compact view unless Complete is chosen.
- Identifier Type on Author Resolve is now required.

## 0.1.0

- Initial release: Search, Paper, Author, Direction, Venue, Institution, Hypothesis, Resource, and Corpus operations over the public Lacuna API.
