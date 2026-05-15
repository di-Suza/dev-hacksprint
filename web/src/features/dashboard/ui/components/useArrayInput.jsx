import { useEffect, useState } from "react";

function useArrayInput({ onChange, value }) {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setDraft("");
  }, [value.length]);

  function addDraftItems(rawValue = draft) {
    const nextItems = rawValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!nextItems.length) return;

    const existing = new Set(value.map((item) => item.toLowerCase()));
    const merged = [
      ...value,
      ...nextItems.filter((item) => !existing.has(item.toLowerCase())),
    ];

    onChange(merged);
    setDraft("");
  }

  function removeItem(itemToRemove) {
    onChange(value.filter((item) => item !== itemToRemove));
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addDraftItems();
    }
  }

  return {
    addDraftItems,
    draft,
    handleKeyDown,
    removeItem,
    setDraft,
  };
}

export default useArrayInput;
