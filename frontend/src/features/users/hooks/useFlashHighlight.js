import { useState } from "react";
import { USER_ITEM_FADE_IN_TIMEOUT } from "@features/users/constants/users.constants";
export const useFlashHighlight = (timeout = USER_ITEM_FADE_IN_TIMEOUT) => {
  const [highlightedId, setHighlightedId] = useState(null);

  const triggerHighlight = (id) => {
    setHighlightedId(id);
    setTimeout(() => setHighlightedId(null), timeout);
  };

  return [highlightedId, triggerHighlight];
};
