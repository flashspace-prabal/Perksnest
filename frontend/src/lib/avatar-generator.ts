/**
 * Avatar Generator - Real Profile Photos of Actual People
 * Uses randomuser.me API which provides real professional headshots
 */

// Common male names
const MALE_NAMES = new Set([
  "james", "john", "robert", "michael", "william", "david", "richard", "charles", 
  "joseph", "thomas", "christopher", "daniel", "matthew", "anthony", "mark", "donald",
  "steven", "paul", "andrew", "joshua", "kenneth", "kevin", "brian", "george",
  "edward", "ronald", "timothy", "jason", "jeffrey", "ryan", "jacob", "gary",
  "nicholas", "eric", "jonathan", "stephen", "larry", "justin", "scott", "brandon",
  "benjamin", "samuel", "frank", "gregory", "alexander", "patrick", "jack", "dennis",
  "jerry", "tyler", "aaron", "jose", "adam", "henry", "douglas", "zachary",
  "peter", "kyle", "walter", "harold", "keith", "christian", "terry", "gerald",
  "felix", "miles", "liam", "noah", "oliver", "elijah", "ethan", "mason",
  "logan", "jackson", "sebastian", "aiden", "lukas", "jacob", "owen", "ryan"
]);

// Common female names
const FEMALE_NAMES = new Set([
  "mary", "patricia", "jennifer", "linda", "barbara", "elizabeth", "susan", "jessica",
  "sarah", "karen", "nancy", "lisa", "betty", "margaret", "sandra", "ashley",
  "kimberly", "emily", "donna", "michelle", "carol", "amanda", "melissa", "deborah",
  "stephanie", "rebecca", "sharon", "laura", "cynthia", "kathleen", "amy", "angela",
  "shirley", "anna", "brenda", "pamela", "emma", "nicole", "helen", "samantha",
  "katherine", "christine", "debra", "rachel", "catherine", "carolyn", "janet", "ruth",
  "maria", "heather", "diane", "virginia", "julie", "joyce", "victoria", "olivia",
  "kelly", "christina", "lauren", "joan", "evelyn", "judith", "megan", "andrea",
  "cheryl", "hannah", "jacqueline", "martha", "gloria", "teresa", "ann", "sara",
  "madison", "frances", "kathryn", "janice", "jean", "alice", "abigail", "sophia",
  "ava", "isabella", "mia", "charlotte", "amelia", "harper", "ella", "daisy"
]);

/**
 * Detect if a name is likely male or female
 */
export function detectGender(name: string): "male" | "female" | "unknown" {
  const firstName = name.split(" ")[0].toLowerCase().trim();
  
  if (MALE_NAMES.has(firstName)) return "male";
  if (FEMALE_NAMES.has(firstName)) return "female";
  return "unknown";
}

/**
 * Generate a real profile photo URL based on name and detected gender
 * Uses pravatar.cc which provides real profile photos with excellent CORS support
 */
export function generateAvatarUrl(name: string, seed?: string): string {
  const baseSeed = seed || name.replace(/\s+/g, "_").toLowerCase();
  
  // Generate a consistent number (0-69) based on the name
  let hash = 0;
  for (let i = 0; i < baseSeed.length; i++) {
    hash = ((hash << 5) - hash) + baseSeed.charCodeAt(i);
    hash = Math.abs(hash & hash);
  }
  
  const photoNumber = (hash % 70);
  
  // Using pravatar.cc - real people avatars with proper CORS headers
  // Returns real profile photos that work reliably across browsers
  return `https://i.pravatar.cc/150?img=${photoNumber}&u=${encodeURIComponent(baseSeed)}`;
}

/**
 * Generate multiple avatar URLs for the same name (for variety)
 */
export function generateAvatarVariants(name: string, count: number = 3): string[] {
  return Array.from({ length: count }, (_, i) => 
    generateAvatarUrl(name, `${name}_v${i}`)
  );
}

/**
 * Color palette for avatar fallbacks
 */
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-cyan-500",
  "bg-teal-500",
];

/**
 * Get a consistent color for a name (for fallback backgrounds)
 */
export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
