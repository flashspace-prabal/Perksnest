/**
 * Social Proof Names Generator
 * Provides diverse, realistic names for social proof avatars
 * Auto-generates different names for each deal to create authenticity
 */

const MALE_FIRST_NAMES = [
  "James", "Michael", "David", "Robert", "John", "William", "Richard", "Joseph",
  "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark",
  "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian",
  "Edward", "Ronald", "Timothy", "Jason", "Jeffrey", "Ryan", "Jacob", "Gary",
  "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon",
  "Benjamin", "Samuel", "Frank", "Gregory", "Alexander", "Patrick", "Jack", "Dennis",
  "Jerry", "Tyler", "Aaron", "Jose", "Adam", "Henry", "Douglas", "Zachary",
  "Peter", "Kyle", "Walter", "Harold", "Keith", "Christian", "Terry", "Gerald"
];

const FEMALE_FIRST_NAMES = [
  "Mary", "Patricia", "Jennifer", "Linda", "Barbara", "Elizabeth", "Susan", "Jessica",
  "Sarah", "Karen", "Nancy", "Lisa", "Betty", "Margaret", "Sandra", "Ashley",
  "Kimberly", "Emily", "Donna", "Michelle", "Carol", "Amanda", "Melissa", "Deborah",
  "Stephanie", "Rebecca", "Sharon", "Laura", "Cynthia", "Kathleen", "Amy", "Angela",
  "Shirley", "Anna", "Brenda", "Pamela", "Emma", "Nicole", "Helen", "Samantha",
  "Katherine", "Christine", "Debra", "Rachel", "Catherine", "Carolyn", "Janet", "Ruth",
  "Maria", "Heather", "Diane", "Virginia", "Julie", "Joyce", "Victoria", "Olivia",
  "Kelly", "Christina", "Lauren", "Joan", "Evelyn", "Judith", "Megan", "Andrea"
];

const LAST_NAMES = [
  "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez",
  "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
  "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
  "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Young", "Allen",
  "King", "Wright", "Scott", "Torres", "Peterson", "Phillips", "Campbell", "Parker",
  "Evans", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
  "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Peterson", "Cooper", "Peterson",
  "Kim", "Chen", "Wu", "Singh", "Kumar", "Patel", "Khan", "Shah"
];

/**
 * Generate random but consistent social proof names for a deal
 * Uses deal ID as seed to ensure same deal always shows same people
 */
export function generateSocialProofNames(dealId: string, count: number = 5): string[] {
  // Create a seed from dealId
  let seed = 0;
  for (let i = 0; i < dealId.length; i++) {
    seed = ((seed << 5) - seed) + dealId.charCodeAt(i);
    seed = seed & seed;
  }

  const names: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate pseudo-random but consistent index
    const randomIndex = Math.abs((seed + i * 12345) % (MALE_FIRST_NAMES.length * FEMALE_FIRST_NAMES.length));
    const isFemale = randomIndex % 2 === 0;
    
    const firstNameList = isFemale ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES;
    const firstNameIdx = Math.abs((seed + i * 111) % firstNameList.length);
    const lastNameIdx = Math.abs((seed + i * 222) % LAST_NAMES.length);
    
    const firstName = firstNameList[firstNameIdx];
    const lastName = LAST_NAMES[lastNameIdx];
    
    names.push(`${firstName} ${lastName}`);
  }
  
  return names;
}

/**
 * Get a single social proof name for a specific index
 */
export function getSocialProofName(dealId: string, index: number): string {
  const names = generateSocialProofNames(dealId, index + 1);
  return names[index];
}

/**
 * Diverse job titles for social proof
 */
const JOB_TITLES = [
  "Founder", "CEO", "CTO", "Product Manager", "Designer",
  "Developer", "Engineer", "Entrepreneur", "Investor", "Startup Coach",
  "Data Scientist", "Marketing Manager", "Sales Lead", "Operations Manager",
  "Backend Developer", "Full Stack Engineer", "Product Designer",
  "Growth Hacker", "Business Analyst", "Tech Lead"
];

/**
 * Get a random job title for social proof
 */
export function getRandomJobTitle(seed: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
  }
  const jobIdx = Math.abs((hash + index * 777) % JOB_TITLES.length);
  return JOB_TITLES[jobIdx];
}
