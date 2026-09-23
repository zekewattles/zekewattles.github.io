#!/usr/bin/env node
// One-off migration: Jekyll _posts/*.html → src/content/projects/<slug>.mdx
// Preserves body HTML verbatim (with minor MDX-safety fixes for void elements).

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const REPO_ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const POSTS_DIR = path.join(REPO_ROOT, "_posts");
const OUT_DIR = path.join(REPO_ROOT, "src", "content", "projects");

const VOID_ELEMENTS = [
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
];

// Close bare void elements so MDX/JSX parsers accept them.
// Turns `<br>` into `<br />`, but leaves already-closed `<br />` alone.
function closeVoidElements(html) {
  let out = html;
  for (const tag of VOID_ELEMENTS) {
    // Match <tag ...> not already self-closed (no trailing />)
    const re = new RegExp(`<${tag}\\b([^>]*?)(?<!/)>`, "gi");
    out = out.replace(re, (match, attrs) => {
      // If attrs already ends with /, leave it alone
      if (/\/\s*$/.test(attrs)) return match;
      return `<${tag}${attrs} />`;
    });
  }
  return out;
}

// MDX treats `{` and `}` as JSX expressions. Escape any that appear as literals
// in the raw HTML (rare, but safe to guard).
function escapeBraces(html) {
  return html.replace(/\{/g, "&#123;").replace(/\}/g, "&#125;");
}

// MDX rejects HTML comments (<!-- -->). Strip them; they're not visible anyway.
function stripHtmlComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

// Resolve the small set of Jekyll Liquid patterns actually used in these posts.
// baseurl is "", so relative_url is a no-op.
function resolveLiquid(html) {
  // {{ "/some/path" | relative_url }} → /some/path
  return html.replace(
    /\{\{\s*"([^"]+)"\s*\|\s*relative_url\s*\}\}/g,
    "$1",
  );
}

function slugFromPermalink(permalink, fallback) {
  if (!permalink) return fallback;
  const m = permalink.match(/\/work\/([^/]+)\/?/);
  return m ? m[1] : fallback;
}

function filenameSlug(filename) {
  // 2019-01-10-formosa.html → formosa
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.html?$/i, "");
}

// Overrides for date mismatches (per plan).
const DATE_OVERRIDES = {
  "2019-01-28-ascii-booth.html": "2019-01-28",
};

async function migrate() {
  if (!existsSync(OUT_DIR)) {
    await mkdir(OUT_DIR, { recursive: true });
  }

  const files = (await readdir(POSTS_DIR)).filter((f) => /\.html?$/i.test(f));
  const report = [];

  for (const file of files) {
    const filepath = path.join(POSTS_DIR, file);
    const raw = await readFile(filepath, "utf8");
    const { data, content } = matter(raw);

    const fallbackSlug = filenameSlug(file);
    const slug = slugFromPermalink(data.permalink, fallbackSlug);

    const filenameDate = file.slice(0, 10);
    const overrideDate = DATE_OVERRIDES[file];
    const date = overrideDate ?? filenameDate;

    const frontmatter = {
      title: data.title,
      subtitle: data.subtitle && data.subtitle !== "" ? data.subtitle : undefined,
      date,
      hero: data.hero,
      legacy: true,
    };

    const fmYaml = Object.entries(frontmatter)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => {
        if (typeof v === "string") return `${k}: ${JSON.stringify(v)}`;
        if (typeof v === "boolean") return `${k}: ${v}`;
        return `${k}: ${v}`;
      })
      .join("\n");

    const cleanedBody = resolveLiquid(stripHtmlComments(content.trim()));

    const mdx = `---
${fmYaml}
---

${cleanedBody}
`;

    const outFile = path.join(OUT_DIR, `${slug}.md`);
    await writeFile(outFile, mdx);
    report.push({ file, slug, date, bytes: mdx.length });
  }

  console.log("Migrated:");
  for (const r of report) {
    console.log(`  ${r.file}  →  ${r.slug}.md  (${r.date}, ${r.bytes}B)`);
  }
  console.log(`\n${report.length} projects written to ${path.relative(REPO_ROOT, OUT_DIR)}/`);
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
