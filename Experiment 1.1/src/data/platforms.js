// Static catalog of supported platforms and their publishing constraints.
// Plain data — no framework dependency — so it can be imported anywhere
// (validation, tabs, previews) without pulling in state-management code.

export const PLATFORMS = [
  {
    id: "twitter",
    name: "Twitter / X",
    handle: "@you",
    monogram: "X",
    color: "#1D9BF0",
    charLimit: 280,
    maxMedia: 4,
    requiresMedia: false,
    hashtagSoftLimit: 3,
    description: "Short-form, text-first, strict character cap.",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@you",
    monogram: "IG",
    color: "#DD2A7B",
    charLimit: 2200,
    maxMedia: 10,
    requiresMedia: true,
    hashtagSoftLimit: 30,
    description: "Visual-first — at least one image is required.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "You · Professional",
    monogram: "in",
    color: "#0A66C2",
    charLimit: 3000,
    maxMedia: 9,
    requiresMedia: false,
    hashtagSoftLimit: 5,
    description: "Long-form friendly, professional tone.",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "You",
    monogram: "f",
    color: "#1877F2",
    charLimit: 5000,
    maxMedia: 10,
    requiresMedia: false,
    hashtagSoftLimit: 5,
    description: "Flexible length, mixed audiences.",
  },
];

export const getPlatform = (id) => PLATFORMS.find((p) => p.id === id);
