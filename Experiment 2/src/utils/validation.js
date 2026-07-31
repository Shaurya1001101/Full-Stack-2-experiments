// Pure, side-effect-free validation helpers.
// Kept outside Redux/components so they're easy to unit test and reuse
// between the composer's live feedback and the final publish check.

export function countHashtags(text) {
  const matches = text.match(/#[\p{L}\p{N}_]+/gu);
  return matches ? matches.length : 0;
}

/**
 * Validate a single draft (text + media) against one platform's rules.
 * Returns { errors, warnings, charCount, remaining, valid }.
 */
export function validateForPlatform(platform, { text, media }) {
  const errors = [];
  const warnings = [];

  const charCount = text.length;
  const remaining = platform.charLimit - charCount;
  const hashtagCount = countHashtags(text);

  if (text.trim() === "" && media.length === 0) {
    errors.push("Add some text or media before publishing.");
  }

  if (charCount > platform.charLimit) {
    errors.push(
      `${Math.abs(remaining)} characters over the ${platform.charLimit} limit.`
    );
  }

  if (platform.requiresMedia && media.length === 0) {
    errors.push(`${platform.name} requires at least one image.`);
  }

  if (media.length > platform.maxMedia) {
    errors.push(
      `Only ${platform.maxMedia} media file${
        platform.maxMedia === 1 ? "" : "s"
      } allowed on ${platform.name}, ${media.length} attached.`
    );
  }

  if (hashtagCount > platform.hashtagSoftLimit) {
    warnings.push(
      `${hashtagCount} hashtags may read as spammy on ${platform.name} (recommended ≤ ${platform.hashtagSoftLimit}).`
    );
  }

  if (remaining <= 20 && remaining > 0) {
    warnings.push(`Only ${remaining} characters left.`);
  }

  return {
    charCount,
    remaining,
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a draft against every selected platform at once.
 * Returns a map of platformId -> validation result, plus an overall flag.
 */
export function validateForPlatforms(platforms, draft) {
  const results = {};
  let allValid = platforms.length > 0;

  platforms.forEach((platform) => {
    const result = validateForPlatform(platform, draft);
    results[platform.id] = result;
    if (!result.valid) allValid = false;
  });

  return { results, allValid };
}
