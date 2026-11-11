// Build guard: fail the build if the basics Google relies on break.
// 1. /favicon.ico must be a real icon file (Google's favicon fetcher asks for it).
// 2. No meta description may carry a review count (it goes stale; "91 reviews" sat in Google for weeks).
import fs from "node:fs";

const errors = [];
const ico = "public/favicon.ico";
if (!fs.existsSync(ico)) errors.push(`${ico} is missing`);
else {
  const head = fs.readFileSync(ico).subarray(0, 4);
  if (!(head[0] === 0 && head[1] === 0 && head[2] === 1 && head[3] === 0)) errors.push(`${ico} is not an .ico file`);
}
if (!/<link rel="icon" href="\/favicon\.ico"/.test(fs.readFileSync("index.html", "utf8")))
  errors.push('index.html must link /favicon.ico as an icon');

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(`${d}/${e.name}`) : /\.(jsx?|html)$/.test(e.name) ? [`${d}/${e.name}`] : []);
const desc = /(name="description"|property="(og|twitter):description")\s+content=["'{][^>]*?\d+\s*(Google\s+)?reviews/i;
for (const f of ["index.html", ...walk("src")]) {
  fs.readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    if (desc.test(line)) errors.push(`${f}:${i + 1} meta description contains a review count`);
  });
}

if (errors.length) {
  console.error("SEO basics check failed:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("SEO basics check passed");
