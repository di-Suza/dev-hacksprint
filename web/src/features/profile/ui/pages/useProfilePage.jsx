import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { useSendMessageMutation } from "../../../message/api/chat.api";
import { useGetUserProfileQuery } from "../../api/profile.api";
import { useDebouncedFollow } from "../../hooks/useDebouncedFollow";

function useProfilePage(socialLinkMeta) {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [followModalType, setFollowModalType] = useState("");
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();

  const shouldSkip = currentUser?._id === id;

  const { data, isLoading } = useGetUserProfileQuery(id, {
    skip: shouldSkip,
  });
  const user = data?.user?.user;
  const projects = data?.user?.projects || [];
  const blogs = data?.user?.blogs || [];
  const socialLinks = socialLinkMeta
    .map((item) => ({
      ...item,
      href: user?.socialLinks?.[item.key],
    }))
    .filter((item) => item.href);
  const profileFollow = useDebouncedFollow({
    followersCount: user?.followersCount,
    isFollowed: user?.isFollowed,
    userId: user?._id,
  });

  useEffect(() => {
    if (shouldSkip) {
      navigate("/dashboard");
    }
  }, [shouldSkip, navigate]);

  async function handleStartChat() {
    const text = messageText.trim();
    if (!text) return;

    try {
      await sendMessage({
        message: text,
        receiverId: user._id,
      }).unwrap();
      toast.success("Message sent");
      setMessageText("");
      setIsMessageModalOpen(false);
      navigate("/messages");
    } catch (error) {
      toast.error(error?.data?.message || "Message not sent");
    }
  }

  return {
    blogs,
    followModalType,
    handleStartChat,
    isLoading,
    isMessageModalOpen,
    messageText,
    profileFollow,
    projects,
    sendingMessage,
    setFollowModalType,
    setIsMessageModalOpen,
    setMessageText,
    shouldSkip,
    socialLinks,
    user,
  };
}

export default useProfilePage;
