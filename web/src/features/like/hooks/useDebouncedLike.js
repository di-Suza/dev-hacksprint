import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  useLikeContentMutation,
  useUnlikeContentMutation,
} from "../api/like.api";

function getProjectedCount(nextLiked, committedLiked, committedCount) {
  if (nextLiked === committedLiked) return committedCount;
  return Math.max(committedCount + (nextLiked ? 1 : -1), 0);
}

export function useDebouncedLike({
  contentId,
  contentType,
  isLiked = false,
  likeCount = 0,
  debounceMs = 450,
}) {
  const [displayLiked, setDisplayLiked] = useState(Boolean(isLiked));
  const [displayLikeCount, setDisplayLikeCount] = useState(likeCount || 0);
  const committedLikedRef = useRef(Boolean(isLiked));
  const committedCountRef = useRef(likeCount || 0);
  const timerRef = useRef(null);
  const [likeContent, { isLoading: isLiking }] = useLikeContentMutation();
  const [unlikeContent, { isLoading: isUnliking }] = useUnlikeContentMutation();
  const isSyncingLike = isLiking || isUnliking;

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    committedLikedRef.current = Boolean(isLiked);
    committedCountRef.current = likeCount || 0;
    setDisplayLiked(Boolean(isLiked));
    setDisplayLikeCount(likeCount || 0);
  }, [contentId, isLiked, likeCount]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function syncLikeState(nextLiked) {
    if (!contentId || nextLiked === committedLikedRef.current) {
      return;
    }

    const payload = { contentId, contentType };

    try {
      const response = nextLiked
        ? await likeContent(payload).unwrap()
        : await unlikeContent(payload).unwrap();

      committedLikedRef.current = response.isLiked;
      committedCountRef.current = response.likeCount || 0;
      setDisplayLiked(response.isLiked);
      setDisplayLikeCount(response.likeCount || 0);
    } catch (error) {
      setDisplayLiked(committedLikedRef.current);
      setDisplayLikeCount(committedCountRef.current);
      toast.error(error?.data?.message || "Failed to update like");
    }
  }

  function toggleLike() {
    if (isSyncingLike || !contentId) return;

    setDisplayLiked((currentLiked) => {
      const nextLiked = !currentLiked;
      const nextCount = getProjectedCount(
        nextLiked,
        committedLikedRef.current,
        committedCountRef.current,
      );

      setDisplayLikeCount(nextCount);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        syncLikeState(nextLiked);
      }, debounceMs);

      return nextLiked;
    });
  }

  return {
    isLiked: displayLiked,
    isSyncingLike,
    likeCount: displayLikeCount,
    toggleLike,
  };
}
