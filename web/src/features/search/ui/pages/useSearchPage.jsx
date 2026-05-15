import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";

import { useDebounce } from "../../../../shared/hooks/useDebounce";
import {
  useSearchBlogsQuery,
  useSearchProjectsQuery,
  useSearchUsersQuery,
} from "../../api/search.api";

function useSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState("users");
  const [userPage, setUserPage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [commentTarget, setCommentTarget] = useState(null);
  const [localQuery, setLocalQuery] = useState(query);
  const debouncedQuery = useDebounce(localQuery, 400);
  const loadMoreRef = useRef(null);
  const limit = 10;

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery.trim() });
    } else {
      setSearchParams({});
    }
    setUserPage(1);
    setProjectPage(1);
    setBlogPage(1);
  }, [debouncedQuery, setSearchParams]);

  const userSearch = useSearchUsersQuery(
    { query: debouncedQuery, limit, page: userPage },
    { skip: !debouncedQuery || activeTab !== "users" },
  );
  const projectSearch = useSearchProjectsQuery(
    { query: debouncedQuery, limit, page: projectPage },
    { skip: !debouncedQuery || activeTab !== "projects" },
  );
  const blogSearch = useSearchBlogsQuery(
    { query: debouncedQuery, limit, page: blogPage },
    { skip: !debouncedQuery || activeTab !== "blogs" },
  );

  const activeSearch =
    activeTab === "users"
      ? userSearch
      : activeTab === "projects"
        ? projectSearch
        : blogSearch;
  const items = activeSearch.data?.items || [];
  const hasMore = Boolean(activeSearch.data?.hasMore);
  const totalItems = activeSearch.data?.totalItems || 0;

  const observerOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "300px 0px",
      threshold: 0,
    }),
    [],
  );

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

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasMore || activeSearch.isFetching) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;

      if (activeTab === "users") {
        setUserPage((page) => page + 1);
      } else if (activeTab === "projects") {
        setProjectPage((page) => page + 1);
      } else {
        setBlogPage((page) => page + 1);
      }
    }, observerOptions);

    observer.observe(target);

    return () => observer.disconnect();
  }, [activeSearch.isFetching, activeTab, hasMore, observerOptions]);

  return {
    activeSearch,
    activeTab,
    closeCommentModal,
    commentTarget,
    debouncedQuery,
    handleComment,
    handleTabChange,
    hasMore,
    items,
    loadMoreRef,
    localQuery,
    setLocalQuery,
    totalItems,
  };
}

export default useSearchPage;
