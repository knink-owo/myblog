// Patch the graph plugin dist files to fix Chinese node names
// and add left-click navigation + right-click expand behavior.
//
// Run after `npx quartz plugin install` in CI or locally.

const fs = require("fs");
const path = require("path");

const DIST_FILES = [
  ".quartz/plugins/graph/dist/components/index.js",
  ".quartz/plugins/graph/dist/index.js",
];

const REPLACEMENTS = [
  // 1. Fix URL-encoded Chinese node names via decodeURIComponent fallback
  {
    from: "eu.get(i)?.title||i",
    to: "eu.get(i)?.title||decodeURIComponent(i)",
  },

  // 2. Add expandedNodeIds tracking variable (xp = new Set)
  {
    from: "var _=[],r=[],E=0;",
    to: "var _=[],r=[],E=0,xp=new Set;",
  },

  // 3. Add if-block braces + BFS neighbour expansion for clicked nodes
  // (wrap for-loop inside if-block and insert xp.forEach after the depth loop)
  {
    from: "if(Vu>=0)for(var pu=[m]",
    to: "if(Vu>=0){for(var pu=[m]",
  },
  {
    // Insert xp.forEach expansion + closing if-brace before else
    from: "source))}}pu=wu}else{Xu.f",
    to: "source))}}pu=wu}xp.forEach(function(e){ru.has(e)||ru.add(e);for(var t=0;t<tu.length;t++){var n=tu[t];n.source===e&&!ru.has(n.target)&&ru.add(n.target),n.target===e&&!ru.has(n.source)&&ru.add(n.source)}});}else{Xu.f",
  },

  // 4. Left-click → navigate to page (replaces centering behavior)
  {
    from: "n.fx=0;n.fy=0;for(var m=0;m<nu.length;m++){if(nu[m]!==n&&nu[m].fx!=null){nu[m].fx=null;nu[m].fy=null}}au.alphaTarget(0.3).restart();hc={node:n,time:now}",
    to: "var l=$u(n.id);window.location.href=l",
    replaceAll: true,
  },

  // 5. Prevent browser context menu on graph canvas
  {
    from: "d.appendChild(Z.canvas);var ou=new o.Conta",
    to: 'd.appendChild(Z.canvas);d.addEventListener("contextmenu",function(e){e.preventDefault()});var ou=new o.Conta',
  },

  // 6. Add right-click handler inside the node IIFE (expand neighbors)
  //    Place it between pointerleave handler and the IIFE closing )})(Du,U,lu)
  {
    from: "Eu||Au()})})(Du,U,lu)",
    to: 'Eu||Au()}),A.on("rightclick",function(){F.fx=null;F.fy=null;xp.add(F.id);uu()})})(Du,U,lu)',
  },

  // 7. Clear expandedNodeIds when navigating to a new page
  {
    from: "if(c(Fu(w)),uu(),S=Array.from",
    to: "if(c(Fu(w)),xp.clear(),uu(),S=Array.from",
  },
];

function patchFile(filePath) {
  const absPath = path.resolve(filePath);
  if (!fs.existsSync(absPath)) {
    console.error(`  SKIP: file not found: ${absPath}`);
    return false;
  }

  let content = fs.readFileSync(absPath, "utf8");
  let changed = false;

  for (const rep of REPLACEMENTS) {
    if (rep.replaceAll) {
      const count = (content.match(new RegExp(escapeRegex(rep.from), "g")) || []).length;
      if (count > 0) {
        content = content.split(rep.from).join(rep.to);
        console.log(`  ✓ replaced ${count}x: ${rep.from.substring(0, 50)}...`);
        changed = true;
      } else {
        console.log(`  - not found (already patched?): ${rep.from.substring(0, 50)}...`);
      }
    } else {
      if (content.includes(rep.from)) {
        content = content.replace(rep.from, rep.to);
        console.log(`  ✓ replaced: ${rep.from.substring(0, 50)}...`);
        changed = true;
      } else {
        console.log(`  - not found (already patched?): ${rep.from.substring(0, 50)}...`);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(absPath, content, "utf8");
    console.log(`  → wrote: ${absPath}`);
  }
  return true;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

console.log("Patching graph plugin dist files...\n");

let anyPatched = false;
for (const file of DIST_FILES) {
  console.log(`File: ${file}`);
  if (patchFile(file)) anyPatched = true;
  console.log();
}

if (anyPatched) {
  console.log("Done. Graph plugin patched.");
} else {
  console.log("No changes made — files may already be patched or not found.");
}
