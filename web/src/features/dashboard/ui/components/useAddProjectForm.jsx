import { useState } from "react";

function useAddProjectForm({ initialProject, onSubmit }) {
  const [title, setTitle] = useState(initialProject?.title || "");
  const [description, setDescription] = useState(initialProject?.description || "");
  const [githubLink, setGithubLink] = useState(initialProject?.githubLink || "");
  const [liveLink, setLiveLink] = useState(initialProject?.liveLink || "");
  const [tags, setTags] = useState(initialProject?.tags || []);
  const [tagDraft, setTagDraft] = useState("");
  const [images, setImages] = useState([]);

  function addTagsFromText(value) {
    const nextTags = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (!nextTags.length) return;

    setTags((current) => {
      const existing = new Set(current.map((tag) => tag.toLowerCase()));
      const freshTags = nextTags.filter((tag) => !existing.has(tag.toLowerCase()));
      return [...current, ...freshTags].slice(0, 12);
    });
  }

  function handleTagChange(event) {
    const value = event.target.value;

    if (!value.includes(",")) {
      setTagDraft(value);
      return;
    }

    const parts = value.split(",");
    const remainingText = parts.pop() || "";
    addTagsFromText(parts.join(","));
    setTagDraft(remainingText.trimStart());
  }

  function handleTagKeyDown(event) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTagsFromText(tagDraft);
      setTagDraft("");
      return;
    }

    if (event.key === "Backspace" && !tagDraft && tags.length) {
      setTags((current) => current.slice(0, -1));
    }
  }

  function removeTag(tagToRemove) {
    setTags((current) => current.filter((tag) => tag !== tagToRemove));
  }

  function handleSubmit() {
    addTagsFromText(tagDraft);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description);
    formData.append("githubLink", githubLink);
    formData.append("liveLink", liveLink);
    formData.append("tags", [...tags, tagDraft.trim()].filter(Boolean).join(","));
    images.forEach((image) => formData.append("images", image));

    onSubmit(formData);
  }

  function handleImageChange(event) {
    setImages(Array.from(event.target.files || []));
  }

  return {
    description,
    githubLink,
    handleImageChange,
    handleSubmit,
    handleTagChange,
    handleTagKeyDown,
    images,
    liveLink,
    removeTag,
    setDescription,
    setGithubLink,
    setLiveLink,
    setTitle,
    tagDraft,
    tags,
    title,
  };
}

export default useAddProjectForm;
