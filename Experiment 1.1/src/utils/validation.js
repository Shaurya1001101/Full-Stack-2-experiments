// Pure, side-effect-free validation helpers. No React or state-management
// dependency, so the same functions can back the live UI feedback and a
// final pre-publish check, and can be unit tested in isolation.

export function countHashtags(text) {
  const matches = text.match(/#[\p{L}\p{N}_]+/gu);
  return matches ? matches.length : 0;
}

/**
 * Validate one draft (text + media) against a single platform's rules.
 * Returns { charCount, remaining, valid, errors, warnings }.
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
 * Validate a draft against a list of platforms at once.
 * Returns { results: { [platformId]: result }, allValid }.
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
