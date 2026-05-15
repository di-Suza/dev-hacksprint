import { useState } from "react";
import { useParams } from "react-router";

import { useDebouncedLike } from "../../../like/hooks/useDebouncedLike";
import { useGetBlogByIdQuery } from "../../api/blog.api";

function useBlogPage() {
  const { id } = useParams();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { data, error, isError, isLoading, refetch } = useGetBlogByIdQuery(id, {
    skip: !id,
  });

  const blog = data?.blog;
  const author = blog?.user;
  const authorPicture = author?.profilePicture?.url;
  const blogLike = useDebouncedLike({
    contentId: blog?._id,
    contentType: "blog",
    isLiked: blog?.isLiked,
    likeCount: blog?.likeCount,
  });

  return {
    author,
    authorPicture,
    blog,
    blogLike,
    error,
    isCommentModalOpen,
    isError,
    isLoading,
    refetch,
    setIsCommentModalOpen,
  };
}

export default useBlogPage;
