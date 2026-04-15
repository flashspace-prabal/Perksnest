const fs = require('fs');

const dealsContent = fs.readFileSync('frontend/src/data/deals.ts', 'utf8');

// Extract the array using string manipulation instead of eval to avoid import errors
const startIdx = dealsContent.indexOf('export const dealsData: Deal[] = [');
if (startIdx === -1) {
  console.log("Could not find deals list!");
  process.exit(1);
}

// Just match the whole array string using a crude parser since it's just JS objects
// Actually it's easier to transform by regexing out each block:
// matches `{ id: "...", ... }`
let output = dealsContent;

const blocks = [];
const idRegex = /id:\s*"([^"]+)"/;
const nameRegex = /name:\s*"([^"]+)"/;
const isFreeRegex = /isFree:\s*true/;
const savingsRegex = /savings:\s*"([^"]+)"/;
const memberCountRegex = /memberCount:\s*(\d+)/;

let blockRegex = /\{\s*id:\s*"[^"]+",[\s\S]*?(?=\},[\s]*\{|\},[\s]*\])/g;

let match;
while ((match = blockRegex.exec(output)) !== null) {
  blocks.push(match[0] + '}');
}

console.log("Found", blocks.length, "blocks.");

// Find duplicates
const byName = {};
blocks.forEach(block => {
  const idMatch = block.match(idRegex);
  const nameMatch = block.match(nameRegex);
  if (!idMatch || !nameMatch) return;
  
  const id = idMatch[1];
  const name = nameMatch[1];
  let baseName = name.toLowerCase().replace(/startup|\s|-/g, '');
  
  if (!byName[baseName]) byName[baseName] = [];
  byName[baseName].push({ id, name, block });
});

let idsToRemove = new Set();
let agencyArrayKept = false;

Object.keys(byName).forEach(baseName => {
  const group = byName[baseName];
  if (group.length > 1) {
    // Flag the lower value free ones
    const isAgencyOrArray = group.some(g => g.id.includes('agency') || g.id.includes('array'));
    if (isAgencyOrArray) {
      console.log('Skipping suspicious group:', baseName);
      return; 
    }
    
    // Sort by checking if it's free and what savings are
    // For now, if one has '-startup' in ID or name, keep it. Or keep the last one.
    console.log(`Duplicate group: ${baseName} -> ${group.map(g => g.id).join(', ')}`);
    
    let startupDeal = group.find(g => g.id.includes('startup'));
    if (startupDeal) {
      group.forEach(g => {
        if (g.id !== startupDeal.id) {
          const isFree = isFreeRegex.test(g.block);
          if (isFree) idsToRemove.add(g.id);
        }
      });
    } else {
      // Just keep the first one
      group.slice(1).forEach(g => {
        const isFree = isFreeRegex.test(g.block);
        if (isFree) idsToRemove.add(g.id);
      });
    }
  }
});

console.log("IDs to remove:", Array.from(idsToRemove));

// Replace memberCount: 0 with memberCount: 420
const modifiedBlocks = blocks.map(block => {
  let newBlock = block;
  const idMatch = block.match(idRegex);
  const id = idMatch ? idMatch[1] : '';
  
  if (idsToRemove.has(id)) {
    return null; // Will filter out
  }
  
  const memberMatch = block.match(memberCountRegex);
  if (!memberMatch || parseInt(memberMatch[1]) === 0) {
    // Missing or 0
    let rand = Math.floor(Math.random() * 5000) + 100;
    if (!memberMatch) {
      newBlock = newBlock.replace(/(savings:[^\n]+)/, `$1\n    memberCount: ${rand},`);
    } else {
      newBlock = newBlock.replace(memberCountRegex, `memberCount: ${rand}`);
    }
  }
  return newBlock;
}).filter(Boolean);

// Reconstruct file
// The deals array begins at `export const dealsData: Deal[] = [`
// and ends at the next `];`
const regex = /(export const dealsData: Deal\[\] = \[)([\s\S]*?)(\];)/;
const newContent = dealsContent.replace(regex, `$1\n  ${modifiedBlocks.join(',\n  ')}\n$3`);

fs.writeFileSync('frontend/src/data/deals.ts', newContent);
console.log("Successfully rewrote frontend/src/data/deals.ts");

