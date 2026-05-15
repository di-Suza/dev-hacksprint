import {
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "../../api/profile.api";

function useFollowListModal({ type, userId }) {
  const isFollowers = type === "followers";
  const title = isFollowers ? "Followers" : "Following";
  const followersQuery = useGetFollowersQuery(
    { page: 1, userId },
    { skip: !userId || !isFollowers },
  );
  const followingQuery = useGetFollowingQuery(
    { page: 1, userId },
    { skip: !userId || isFollowers },
  );
  const activeQuery = isFollowers ? followersQuery : followingQuery;
  const users =
    (isFollowers
      ? activeQuery.data?.followers
      : activeQuery.data?.following) || [];

  return {
    activeQuery,
    title,
    users,
  };
}

export default useFollowListModal;
