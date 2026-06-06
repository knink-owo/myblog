// Post-build patch for the final JavaScript output.
// Runs AFTER `npx quartz build` to fix issues in the bundled scripts.
// esbuild may rename variables, so we use regex patterns to find targets.

const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = "public";

// Find the built JS file that contains the graph script
function findGraphScript() {
  // Recursively find all JS files in public/
  function walk(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) results.push(...walk(full));
      else if (entry.name.endsWith(".js")) results.push(full);
    }
    return results;
  }
  for (const f of walk(PUBLIC_DIR)) {
    const data = fs.readFileSync(f, "utf8");
    // Graph script uniquely contains "rightclick" (from our patch)
    if (data.includes("rightclick")) return { path: f, content: data };
  }
  return null;
}

const result = findGraphScript();
if (!result) {
  console.error("Could not find graph script in build output");
  process.exit(1);
}

console.log(`Found graph script: ${result.path}`);
let content = result.content;
const graphScriptPath = result.path;
let changed = false;

// ---------------------------------------------------------------
// Fix 1: Node name fallback — use basename instead of full slug
//
// Pattern: data.get(url)?.title||decodeURIComponent(url)
// Replace: data.get(url)?.title||decodeURIComponent(url.split("/").pop())
// ---------------------------------------------------------------
const titlePattern = /\?\.title\|\|decodeURIComponent\([^)]+\)/g;
const matches = content.match(titlePattern);
if (matches && matches.length > 0) {
  for (const fullMatch of matches) {
    const replacement = fullMatch.replace(
      /decodeURIComponent\(([^)]+)\)/,
      'decodeURIComponent($1.split("/").pop())'
    );
    if (fullMatch !== replacement) {
      content = content.replace(fullMatch, replacement);
      console.log("✓ Fix 1: Node names now show basename as fallback");
      changed = true;
    }
  }
} else {
  console.log("- Fix 1: Pattern not found in postscript.js");
}

// ---------------------------------------------------------------
// Fix 2: Navigation URL — don't add production basepath in dev mode
//
// The graph uses resolveBasePath ($u / Nu) which prepends the
// baseUrl from config (e.g., /myblog). In dev mode (localhost),
// the dev server serves at root, so /myblog/slug would 404.
//
// We change the click navigation to use a relative path that
// works regardless of the basepath setting.
// ---------------------------------------------------------------
// Pattern: var X=$u(node.id);window.location.href=X
// We replace with: window.location.href=(Nu()==="."?"/":Nu()+"/")+node.id
const navPattern = /var [a-zA-Z]=\$u\([^)]+\);window\.location\.href=[a-zA-Z]/g;
const navMatches = content.match(navPattern);
if (navMatches && navMatches.length > 0) {
  for (const fullMatch of navMatches) {
    // Extract the node id expression from $u(xxx.id)
    const idMatch = fullMatch.match(/\$u\(([^)]+)\)/);
    if (idMatch) {
      const nodeIdExpr = idMatch[1]; // e.g., "i.subject.id" or "l.simulationData.id"
      const replacement =
        `window.location.href=(Nu()==="."?"/":Nu()+"/")+${nodeIdExpr}`;
      if (fullMatch !== replacement) {
        content = content.replace(fullMatch, replacement);
        console.log(`✓ Fix 2: Navigation fixed (${nodeIdExpr})`);
        changed = true;
      }
    }
  }
} else {
  console.log("- Fix 2: Navigation pattern not found");
}

// ---------------------------------------------------------------
// Write back
// ---------------------------------------------------------------
if (changed) {
  fs.writeFileSync(graphScriptPath, content, "utf8");
  console.log(`\n→ Patched: ${graphScriptPath}`);
} else {
  console.log("\nNo changes made.");
}
