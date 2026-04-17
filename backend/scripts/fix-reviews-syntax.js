const fs = require('fs');
const path = require('path');

const dealsPath = path.join(__dirname, '../../frontend/src/data/deals.ts');
let content = fs.readFileSync(dealsPath, 'utf-8');

console.log('🔧 Fixing reviews array syntax...\n');

// Fix the reviews array - replace malformed review objects
// Pattern: reviews: [{author: ..., rating: ..., avatar: ..., text: "..."}
// Should be: reviews: [{author: "...", rating: ..., avatar: "...", text: "..."}

// The issue is that the closing } is right after text value instead of after the full object
// Current: text: "..."}  {author: 
// Should be: text: "..."}  {author:

// First, let's identify and fix all the malformed reviews arrays
const reviewsPattern = /reviews:\s*\[({[^[\]]*?})\]/gs;

let fixCount = 0;

content = content.replace(/reviews:\s*\[\{([^]*?)\}\]/g, (match) => {
  // Parse the reviews array content
  let reviewContent = match.slice(10, -2); // Remove "reviews: [{" and "}]"
  
  // Split by top-level commas between review objects
  let reviewObjects = [];
  let current = '';
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < reviewContent.length; i++) {
    const char = reviewContent[i];
    const prevChar = i > 0 ? reviewContent[i - 1] : '';
    
    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      current += char;
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && prevChar !== '\\') {
      inString = !inString;
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    if (char === ',' && braceCount === 0 && !inString) {
      reviewObjects.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current.trim()) {
    reviewObjects.push(current.trim());
  }
  
  // Ensure each review object is properly formatted
  reviewObjects = reviewObjects.map(obj => {
    // Remove leading/trailing braces if they exist
    obj = obj.trim();
    if (obj.startsWith('{')) obj = obj.slice(1);
    if (obj.endsWith('}')) obj = obj.slice(0, -1);
    
    // Parse the object properties
    let result = '{';
    result += obj.trim();
    result += '}';
    
    return result;
  });
  
  fixCount++;
  return `reviews: [${reviewObjects.join(', ')}]`;
});

// Alternative simpler fix: fix the specific pattern of misplaced closing braces
content = content.replace(/text:\s*"([^"]*?)"\},\s*\{author:/gs, (match, textContent) => {
  return `text: "${textContent}"}, {author:`;
});

// Better approach: find and fix all reviews arrays by reconstructing them properly
// Split the file by reviews: arrays
let parts = content.split('reviews: [');
let fixed = parts[0];

for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  
  // Find the closing bracket
  let reviewsEnd = part.indexOf(']');
  if (reviewsEnd === -1) continue;
  
  const reviewsStr = part.substring(0, reviewsEnd);
  const after = part.substring(reviewsEnd);
  
  // Parse the reviews string to extract individual review objects
  let reviews = [];
  let current = '';
  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  
  for (let j = 0; j < reviewsStr.length; j++) {
    const char = reviewsStr[j];
    const prevChar = j > 0 ? reviewsStr[j - 1] : '';
    
    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      current += char;
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && prevChar !== '\\') {
      inString = !inString;
    }
    
    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
    }
    
    if (char === ',' && braceCount === 0 && !inString) {
      const obj = current.trim();
      if (obj.startsWith('{') && obj.endsWith('}')) {
        reviews.push(obj);
      }
      current = '';
    } else if (!(char === ',' && braceCount === 0)) {
      current += char;
    }
  }
  
  // Add the last review
  if (current.trim()) {
    const obj = current.trim();
    if (obj.startsWith('{') && obj.endsWith('}')) {
      reviews.push(obj);
    }
  }
  
  // Reconstruct the reviews array
  fixed += 'reviews: [' + reviews.join(', ') + ']' + after;
}

// Write the fixed content
fs.writeFileSync(dealsPath, fixed, 'utf-8');

console.log('✅ Fixed reviews array syntax');
console.log(`✅ Total reviews arrays fixed: ${fixCount || 'all'}`);
console.log('✅ File updated successfully\n');
