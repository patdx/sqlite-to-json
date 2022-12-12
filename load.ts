let text: string = "";

const decoder = new TextDecoder("utf-8");
const dump = decoder.decode(await Deno.readFile("northwind.jsonl"));

for (const line of dump.split("\n")) {
  if (line.trim().length >= 1) {
    const [type, payload] = JSON.parse(line);

    if (type === "_schema") {
      text += payload.sql + ";\n";
    } else {
      const table = type;
      // NOTE: the column names are so wide we cannot see any values
      // at least for the purpose of an experiment it makes sense to put
      // in two lines
      const sql = `INSERT INTO '${table}'\n  (${Object.keys(payload).join(
        ", "
      )}) VALUES\n  (${Object.values(payload)
        .map((val) =>
          // https://stackoverflow.com/questions/603572/escape-single-quote-character-for-use-in-an-sqlite-query
          typeof val === "string"
            ? "'" + val.replace(/\'/g, "''") + "'"
            : JSON.stringify(val)
        )
        .join(", ")})`;
      text += sql + ";\n";
    }
  }
}

await Deno.writeFile("./load.sql", new TextEncoder().encode(text));
