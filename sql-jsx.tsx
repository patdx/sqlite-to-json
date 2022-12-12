const raw = (text: TemplateStringsArray) => ({ _raw: text.join() });

const query = (
  <>
    SELECT * from {raw`my_table`}
    where test = {5}
  </>
);

console.log(query);

const renderQuery = (el: JSX.Element): [text: string, vars: any[]] => {
  if (el._raw) return [el._raw, []];
  if (typeof el === "string") return [el, []];
  if (typeof el === "number") return ["?", [el]];

  const _children = el.props?.children;

  const children =
    typeof _children === "undefined"
      ? []
      : Array.isArray(_children)
      ? _children
      : [_children];

  let out: string = "";
  const vars = [];

  for (const child of children) {
    const [text, newWars] = renderQuery(child);
    out += text;
    vars.push(...newWars);
  }

  return [out, vars];
};

console.log(renderQuery(query));
