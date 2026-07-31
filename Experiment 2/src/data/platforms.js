// Static catalog of supported platforms and their publishing constraints.
// This is reference data (not user state), so it lives outside Redux and
// is imported wherever rules need to be checked or displayed.

export const PLATFORMS = [
  {
    id: "x",
    name: "X",
    handle: "@you",
    monogram: "X",
    color: "#EDEEF2",
    colorSoft: "rgba(237, 238, 242, 0.14)",
    charLimit: 280,
    maxMedia: 4,
    requiresMedia: false,
    hashtagSoftLimit: 3,
    description: "Short, fast, text-first.",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@you",
    monogram: "IG",
    color: "#DD2A7B",
    colorSoft: "rgba(221, 42, 123, 0.14)",
    charLimit: 2200,
    maxMedia: 10,
    requiresMedia: true,
    hashtagSoftLimit: 30,
    description: "Visual-first. At least one image is required.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "You · Professional",
    monogram: "in",
    color: "#0A66C2",
    colorSoft: "rgba(10, 102, 194, 0.14)",
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
    colorSoft: "rgba(24, 119, 242, 0.14)",
    charLimit: 5000,
    maxMedia: 10,
    requiresMedia: false,
    hashtagSoftLimit: 5,
    description: "Flexible length, mixed audiences.",
  },
];

export const getPlatform = (id) => PLATFORMS.find((p) => p.id === id);
