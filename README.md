# sqlite-to-json

Just a small thought experiment. I have been thinking that it would be
interesting to have a plain text output format as a way to store sqlite data in
Git and show diffs for JSON-friendly data (eg, not blobs). JSON Lines format
could be nice because it is very parseable, and it can be streamed, so that an
application (for example, a backup restore tool), would not need to keep the
whole file in memory. For example, it could parse it line by line and restore
the lines incrementally.

## dump.ts

This script takes a sqlite db and converts it into a normalized JSON lines file.

Basically, each line is a tuple, where the first element is either the table
name or a special keyword such as `_schema`.

Example output at `northwind.jsonl`.

## load.ts

This script takes the JSON lines dump and converts it into a set of SQL
statements that could restore the database.

Example output at `load.sql`.

## Possible applications

It could be interesting for a CMS, where the main data is saved into a sqlite
database and occasionally the changes are synced back to a git repository via
the "dump" tool.

Alternatively, it may be useful for allowing a SQL diff to be generated using
plain text.

Sqlite also has its own sessions/sqldiff tools which could be more appropriate
for this purpose too.

## Known limitations and other ideas

- Not handling hidden/virtual columns/tables and so on.
- Surely missing a lot of string escape rules.
- Limited to data that can be handled in JSON nicely.
- Compatibility with sqlite-utils
  - sqlite-utils seems to expect a plain JSON object for each line instead of a
    tuple
  - Maybe this tool would generate a folder structure, one folder for each
    table, with a `_schema.json` file and a `dump.jsonl` in lines mode
- File for each row
  - Similar to the sqlite-utils compatibility idea, it may be interesting to
    give each entry its own file. This may allow for nicer git diffs because
    each line could be pretty printed.
- Not handling the complexities of restore such as foreign keys, ordering, etc.
