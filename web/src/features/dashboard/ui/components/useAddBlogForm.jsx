import { useState } from "react";

function useAddBlogForm({ initialBlog, onSubmit }) {
  const [title, setTitle] = useState(initialBlog?.title || "");
  const [content, setContent] = useState(initialBlog?.content || "");
  const [categories, setCategories] = useState(initialBlog?.categories || []);
  const [categoryDraft, setCategoryDraft] = useState("");

  function addCategoriesFromText(value) {
    const nextCategories = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!nextCategories.length) return;

    setCategories((current) => {
      const existing = new Set(current.map((category) => category.toLowerCase()));
      const freshCategories = nextCategories.filter(
        (category) => !existing.has(category.toLowerCase()),
      );
      return [...current, ...freshCategories].slice(0, 10);
    });
  }

  function handleCategoryChange(event) {
    const value = event.target.value;

    if (!value.includes(",")) {
      setCategoryDraft(value);
      return;
    }

    const parts = value.split(",");
    const remainingText = parts.pop() || "";
    addCategoriesFromText(parts.join(","));
    setCategoryDraft(remainingText.trimStart());
  }

  function handleCategoryKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addCategoriesFromText(categoryDraft);
      setCategoryDraft("");
      return;
    }

    if (event.key === "Backspace" && !categoryDraft && categories.length) {
      setCategories((current) => current.slice(0, -1));
    }
  }

  function removeCategory(categoryToRemove) {
    setCategories((current) =>
      current.filter((category) => category !== categoryToRemove),
    );
  }

  function handleSubmit(isPublished) {
    const nextCategories = [...categories, categoryDraft.trim()].filter(Boolean);
    addCategoriesFromText(categoryDraft);

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      categories: nextCategories.join(","),
      isPublished,
    });
  }

  return {
    categories,
    categoryDraft,
    content,
    handleCategoryChange,
    handleCategoryKeyDown,
    handleSubmit,
    removeCategory,
    setContent,
    setTitle,
    title,
  };
}

export default useAddBlogForm;
