import { DB } from "sqlite";
import { format } from "sql-formatter";

const target: any[] = [];

// Open a database
const db = new DB("northwind.db", {
  mode: "read",
});

const tables = db
  .queryEntries<{ name: string; sql: string }>(
    `
  SELECT 
      name, sql
  FROM 
      sqlite_schema
  WHERE 
      type ='table' AND 
      name NOT LIKE 'sqlite_%';
`
  )
  .map((row) => ({
    ...row,
    // normalize the create statements
    sql: format(row.sql, {
      language: "sqlite",
      tabWidth: 0,
    })
      .replace(/\s+/g, " ")
      .trim(),
  }));

for (const table of tables) {
  target.push(["_schema", table]);
}

for (const table of tables) {
  const columns = db.queryEntries<{ name: string; type: string }>(
    `select name, type from pragma_table_info('${table.name}')`
  );
  // .map((col) => col.name);

  console.log(columns);

  const rows = db.queryEntries(
    `select ${columns
      // ignore blobs
      // TODO: save blobs to separate files?
      .filter((col) => col.type !== "BLOB")
      .map((col) => col.name)
      .join(", ")} from '${table.name}'`
  );

  for (const row of rows) {
    target.push([table.name, row]);
  }
}

// Close connection
db.close();

let text = "";

for (const line of target) {
  text += JSON.stringify(line) + "\n";
}

const encoder = new TextEncoder();

await Deno.writeFile("./northwind.jsonl", encoder.encode(text));
