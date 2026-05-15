import { useEffect, useMemo, useRef, useState } from "react";

import { useGetBlogFeedQuery, useGetProjectFeedQuery } from "../../api/feed.api";

function useFeedPage() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projectPage, setProjectPage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [commentTarget, setCommentTarget] = useState(null);
  const loadMoreRef = useRef(null);
  const limit = 10;

  const projectFeed = useGetProjectFeedQuery(
    { limit, page: projectPage },
    { skip: activeTab !== "projects" },
  );
  const blogFeed = useGetBlogFeedQuery(
    { limit, page: blogPage },
    { skip: activeTab !== "blogs" },
  );

  const activeFeed = activeTab === "projects" ? projectFeed : blogFeed;
  const items = activeFeed.data?.items || [];
  const hasMore = Boolean(activeFeed.data?.hasMore);
  const currentPage = activeTab === "projects" ? projectPage : blogPage;

  const observerOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "300px 0px",
      threshold: 0,
    }),
    [],
  );

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || activeFeed.isFetching) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      if (activeTab === "projects") {
        setProjectPage((page) => page + 1);
      } else {
        setBlogPage((page) => page + 1);
      }
    }, observerOptions);

    observer.observe(target);

    return () => observer.disconnect();
  }, [activeFeed.isFetching, activeTab, hasMore, observerOptions]);

  function handleTabChange(tab) {
    setActiveTab(tab);
  }

  function handleComment(content, contentType) {
    setCommentTarget({
      contentId: content._id,
      contentType,
      commentCount: content.commentCount || 0,
    });
  }

  function closeCommentModal() {
    setCommentTarget(null);
  }

  return {
    activeFeed,
    activeTab,
    commentTarget,
    currentPage,
    handleComment,
    handleTabChange,
    hasMore,
    items,
    loadMoreRef,
    closeCommentModal,
  };
}

export default useFeedPage;
