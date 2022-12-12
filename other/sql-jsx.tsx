// sql-jsx.tsx
//
// A mini-mini-experiemnt of using JSX as a templating language for SQL.
// Most sql templating languages for sql in JS suffer from generating extra
// whitespace due to indents. Meanwhile JSX syntax is already designed to
// eliminate these extra whitespaces.
//
// Though, this has other fallbacks compared to template tags, such as
// no automatic way to detect literals that need quotes/escaping or
// way to distinguish static text from text that should be converted
// to variable bindings.

const raw = (text: TemplateStringsArray) => ({ RAW: text.join() });
const literal = (text: TemplateStringsArray) => ({ RAW: `'${text.join()}'` });

const query = (
  <>
    SELECT * FROM {raw`my_table`}
    WHERE test = {5} and test_two = {literal`hi`}
  </>
);

console.log(query);

const renderQuery = (
  el: JSX.Element,
  root = true
): [text: string, vars: any[]] => {
  if (el.RAW) return [el.RAW, []];
  if (typeof el === "string") {
    if (root) {
      return [el, []];
    } else {
      // TODO: this does not actually work to detect string literal
      // as both raw string and {`hi`} get normalized to plain string
      return ["?", [el]];
    }
  }
  if (typeof el === "number") return ["?", [el]];

  const _children = el.props?.children;

  const children =
    typeof _children === "undefined"
      ? []
      : Array.isArray(_children)
      ? _children
      : [_children];

  let out = "";

  const vars = [];

  for (const child of children) {
    const [text, newWars] = renderQuery(child);
    out += " " + text.trim();
    vars.push(...newWars);
  }

  return [out.trim(), vars];
};

console.log(renderQuery(query));
