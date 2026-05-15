import { useState } from "react";
import { useParams } from "react-router";

import { useDebouncedLike } from "../../../like/hooks/useDebouncedLike";
import { useGetProjectByIdQuery } from "../../api/project.api";

function useProjectPage() {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const { data, error, isError, isLoading, refetch } =
    useGetProjectByIdQuery(id, {
      skip: !id,
    });

  const project = data?.project;
  const images = project?.images || [];
  const activeImage = images[activeImageIndex]?.url;
  const author = project?.user;
  const authorPicture = author?.profilePicture?.url;
  const hasMultipleImages = images.length > 1;
  const projectLike = useDebouncedLike({
    contentId: project?._id,
    contentType: "project",
    isLiked: project?.isLiked,
    likeCount: project?.likeCount,
  });

  function showPreviousImage() {
    setActiveImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }

  function showNextImage() {
    setActiveImageIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }

  return {
    activeImage,
    activeImageIndex,
    author,
    authorPicture,
    error,
    hasMultipleImages,
    images,
    isCommentModalOpen,
    isError,
    isLoading,
    project,
    projectLike,
    refetch,
    setActiveImageIndex,
    setIsCommentModalOpen,
    showNextImage,
    showPreviousImage,
  };
}

export default useProjectPage;
