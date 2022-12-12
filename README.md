# sqlite-to-json

Just a small thought experiment. I have been thinking that it would be interesting to have a plain text output format as a way to store sqlite data in Git and show diffs for JSON-friendly data (eg, not blobs). JSON Lines format could be nice because it is very parseable, and it can be streamed, so that an application (for example, a backup restore tool), would not need to keep the whole file in memory. For example, it could parse it line by line and restore the lines incrementally.
