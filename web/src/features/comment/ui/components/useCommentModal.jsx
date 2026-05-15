import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
} from "../../api/comment.api";

function useCommentModal({ commentCount, contentId, contentType, isOpen }) {
  const [commentText, setCommentText] = useState("");
  const queryArg = { contentId, contentType };
  const { data, isFetching, isLoading } = useGetCommentsQuery(queryArg, {
    skip: !isOpen || !contentId || !contentType,
  });
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
  const comments = data?.comments || [];

  async function handleCreateComment(event) {
    event.preventDefault();

    const nextComment = commentText.trim();
    if (!nextComment) return;

    setCommentText("");
    try {
      await createComment({
        comment: nextComment,
        contentId,
        contentType,
        currentCommentCount: commentCount,
      }).unwrap();
    } catch (error) {
      setCommentText(nextComment);
      toast.error(error?.data?.message || "Failed to add comment");
    }
  }

  async function handleDeleteComment(comment) {
    try {
      await deleteComment({
        commentId: comment._id,
        contentId,
        contentType,
        currentCommentCount: commentCount,
      }).unwrap();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete comment");
    }
  }

  return {
    commentText,
    comments,
    handleCreateComment,
    handleDeleteComment,
    isCreating,
    isDeleting,
    isFetching,
    isLoading,
    setCommentText,
  };
}

export default useCommentModal;
