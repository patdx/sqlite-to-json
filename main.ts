import { DB } from "sqlite";

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
    sql: row.sql
      .replace(/\s+/g, " ")
      .replace(/\s*\(\s*/g, " (")
      .replace(/\s*\)\s*/g, ") ")
      .replace(/\s*\]\s*/g, "] ") // probably not a good idea in general, but helps for northwind db visually
      .trim(),
  }));

for (const table of tables) {
  target.push(["_schema", table]);
}

for (const table of tables) {
  // const columns = db
  //   .queryEntries<{ name: string }>(
  //     `select name from pragma_table_info('${table.name}')`
  //   )
  //   .map((col) => col.name);

  const rows = db.queryEntries(`select * from '${table.name}'`);

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
