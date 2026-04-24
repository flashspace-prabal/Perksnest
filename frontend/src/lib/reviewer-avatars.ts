import { detectGender } from "@/lib/avatar-generator";

const menAvatars = Array.from({ length: 20 }, (_, index) => `/assets/testimonials/men-${index + 1}.jpg`);
const womenAvatars = Array.from({ length: 20 }, (_, index) => `/assets/testimonials/women-${index + 1}.jpg`);

const honorifics = new Set([
  "dr",
  "dr.",
  "prof",
  "prof.",
  "professor",
  "mr",
  "mr.",
  "mrs",
  "mrs.",
  "ms",
  "ms.",
  "mx",
  "mx.",
]);

const femaleNameOverrides = new Set([
  "aisha",
  "amelia",
  "anita",
  "ava",
  "carla",
  "cassandra",
  "elena",
  "fatima",
  "grace",
  "jade",
  "jennifer",
  "jessica",
  "kai",
  "lily",
  "maya",
  "meera",
  "michelle",
  "monica",
  "ngoc",
  "nina",
  "olivia",
  "priya",
  "rebecca",
  "sofia",
  "sophia",
  "sophie",
  "victoria",
  "yuki",
  "zara",
]);

const maleNameOverrides = new Set([
  "alessandro",
  "amit",
  "andreas",
  "arjun",
  "brian",
  "carlos",
  "david",
  "diego",
  "felix",
  "hans",
  "hassan",
  "henrik",
  "kai",
  "karthik",
  "klaus",
  "lin",
  "luis",
  "marco",
  "marcus",
  "nathan",
  "oliver",
  "oscar",
  "rajesh",
  "robert",
  "thomas",
  "tom",
  "vikram",
  "yuki",
]);

const normalizedLocalAvatar = (value: string) =>
  value.startsWith("/assets/testimonials/") ? value : "";

const normalizeToken = (token: string) => token.toLowerCase().replace(/[^a-z]/g, "");

function getFirstGivenName(name: string) {
  const parts = name
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);

  const firstNonHonorific = parts.find((part) => !honorifics.has(part));
  return firstNonHonorific || "reviewer";
}

function getLikelyGender(name: string): "male" | "female" {
  const givenName = getFirstGivenName(name);

  if (femaleNameOverrides.has(givenName) && !maleNameOverrides.has(givenName)) return "female";
  if (maleNameOverrides.has(givenName) && !femaleNameOverrides.has(givenName)) return "male";

  const detected = detectGender(givenName);
  return detected === "female" ? "female" : "male";
}

function getHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getReviewerAvatar(name: string, preferredAvatar?: string | null, seedValue?: string) {
  const localAvatar = preferredAvatar ? normalizedLocalAvatar(preferredAvatar) : "";
  if (localAvatar) return localAvatar;

  const remoteAvatar = preferredAvatar?.trim() || "";
  if (remoteAvatar) return remoteAvatar;

  const avatarPool = getLikelyGender(name) === "female" ? womenAvatars : menAvatars;
  const avatarSeed = `${seedValue || ""}:${name}`.toLowerCase();
  return avatarPool[getHash(avatarSeed) % avatarPool.length];
}
