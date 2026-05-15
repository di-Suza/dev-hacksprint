import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  useFollowProfileUserMutation,
  useUnfollowProfileUserMutation,
} from "../api/profile.api";

function getProjectedFollowers(nextFollowed, committedFollowed, committedCount) {
  if (nextFollowed === committedFollowed) return committedCount;
  return Math.max(committedCount + (nextFollowed ? 1 : -1), 0);
}

export function useDebouncedFollow({
  followersCount = 0,
  isFollowed = false,
  userId,
  debounceMs = 450,
}) {
  const [displayFollowed, setDisplayFollowed] = useState(Boolean(isFollowed));
  const [displayFollowersCount, setDisplayFollowersCount] = useState(
    followersCount || 0,
  );
  const committedFollowedRef = useRef(Boolean(isFollowed));
  const committedFollowersCountRef = useRef(followersCount || 0);
  const timerRef = useRef(null);
  const [followUser, { isLoading: isFollowing }] =
    useFollowProfileUserMutation();
  const [unfollowUser, { isLoading: isUnfollowing }] =
    useUnfollowProfileUserMutation();
  const isSyncingFollow = isFollowing || isUnfollowing;

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    committedFollowedRef.current = Boolean(isFollowed);
    committedFollowersCountRef.current = followersCount || 0;
    setDisplayFollowed(Boolean(isFollowed));
    setDisplayFollowersCount(followersCount || 0);
  }, [followersCount, isFollowed, userId]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function syncFollowState(nextFollowed) {
    if (!userId || nextFollowed === committedFollowedRef.current) {
      return;
    }

    try {
      const response = nextFollowed
        ? await followUser(userId).unwrap()
        : await unfollowUser(userId).unwrap();

      committedFollowedRef.current = response.isFollowed;
      committedFollowersCountRef.current = response.followersCount || 0;
      setDisplayFollowed(response.isFollowed);
      setDisplayFollowersCount(response.followersCount || 0);
    } catch (error) {
      setDisplayFollowed(committedFollowedRef.current);
      setDisplayFollowersCount(committedFollowersCountRef.current);
      toast.error(error?.data?.message || "Failed to update follow");
    }
  }

  function toggleFollow() {
    if (isSyncingFollow || !userId) return;

    setDisplayFollowed((currentFollowed) => {
      const nextFollowed = !currentFollowed;
      const nextFollowersCount = getProjectedFollowers(
        nextFollowed,
        committedFollowedRef.current,
        committedFollowersCountRef.current,
      );

      setDisplayFollowersCount(nextFollowersCount);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        syncFollowState(nextFollowed);
      }, debounceMs);

      return nextFollowed;
    });
  }

  return {
    followersCount: displayFollowersCount,
    isFollowed: displayFollowed,
    isSyncingFollow,
    toggleFollow,
  };
}
