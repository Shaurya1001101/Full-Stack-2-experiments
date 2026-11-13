import { useCallback, useMemo, useState } from "react";
import { PLATFORMS, getPlatform } from "../data/platforms";
import { validateForPlatforms } from "../utils/validation";

const makeId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

/**
 * All composer state lives in this single hook, built entirely from
 * React's own useState/useMemo/useCallback — no external state library.
 * Keeping it here (rather than scattered across components) is what
 * makes the UI components below simple and reusable.
 */
export function usePostComposer() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]); // { id, url }
  const [selectedPlatformIds, setSelectedPlatformIds] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [publishState, setPublishState] = useState("idle"); // idle | publishing | done
  const [sentLog, setSentLog] = useState([]);

  const togglePlatform = useCallback((id) => {
    setSelectedPlatformIds((prev) => {
      const isSelected = prev.includes(id);
      const next = isSelected ? prev.filter((p) => p !== id) : [...prev, id];

      setActiveTabId((currentActive) => {
        if (isSelected) {
          // Removing the active tab: fall back to whatever is left.
          return currentActive === id ? next[0] ?? null : currentActive;
        }
        // Newly added platform becomes the focused tab.
        return id;
      });

      return next;
    });
  }, []);

  const addMedia = useCallback((url) => {
    if (url.trim() === "") return;
    setMedia((prev) => [...prev, { id: makeId(), url: url.trim() }]);
  }, []);

  const removeMedia = useCallback((id) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const resetDraft = useCallback(() => {
    setText("");
    setMedia([]);
    setSelectedPlatformIds([]);
    setActiveTabId(null);
  }, []);

  const selectedPlatforms = useMemo(
    () => selectedPlatformIds.map(getPlatform).filter(Boolean),
    [selectedPlatformIds]
  );

  const draft = useMemo(() => ({ text, media }), [text, media]);

  const { results, allValid } = useMemo(
    () => validateForPlatforms(selectedPlatforms, draft),
    [selectedPlatforms, draft]
  );

  const canPublish =
    allValid && selectedPlatforms.length > 0 && publishState !== "publishing";

  const publish = useCallback(() => {
    if (!canPublish) return;
    setPublishState("publishing");
    // Simulated network round-trip — swap this for a real API call later.
    setTimeout(() => {
      setSentLog((prev) => [
        {
          id: makeId(),
          text,
          media,
          platformIds: [...selectedPlatformIds],
          sentAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setPublishState("done");
      resetDraft();
      setTimeout(() => setPublishState("idle"), 1600);
    }, 700);
  }, [canPublish, text, media, selectedPlatformIds, resetDraft]);

  return {
    allPlatforms: PLATFORMS,
    text,
    setText,
    media,
    addMedia,
    removeMedia,
    selectedPlatformIds,
    selectedPlatforms,
    togglePlatform,
    activeTabId,
    setActiveTabId,
    results,
    allValid,
    canPublish,
    publishState,
    publish,
    sentLog,
  };
}
