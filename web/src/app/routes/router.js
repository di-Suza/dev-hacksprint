import { createElement } from "react";
import { createBrowserRouter } from "react-router";

import ProtectedLayout from "../layouts/ProtectedLayout";
import PublicLayout from "../layouts/PublicLayout";
import SignInPage from "../../features/auth/ui/pages/SignInPage";
import SignupPage from "../../features/auth/ui/pages/SignupPage";
import Dashboard from "../../features/dashboard/ui/pages/Dashboard";
import FeedPage from "../../features/feed/ui/pages/FeedPage";
import LandingPage from "../../features/landing/ui/pages/LandingPage";
import BlogPage from "../../features/blog/ui/pages/BlogPage";
import MessagePage from "../../features/message/ui/pages/MessagePage";
import NotificationPage from "../../features/notification/ui/pages/NotificationPage";
import ProfilePage from "../../features/profile/ui/pages/ProfilePage";
import ProjectPage from "../../features/project/ui/pages/ProjectPage";
import SearchPage from "../../features/search/ui/pages/SearchPage";

const router = createBrowserRouter([
  {
    element: createElement(PublicLayout),
    children: [
      {
        path: "/",
        element: createElement(LandingPage),
      },
      {
        path: "/signin",
        element: createElement(SignInPage),
      },
      {
        path: "/signup",
        element: createElement(SignupPage),
      },
    ],
  },
  {
    element: createElement(ProtectedLayout),
    children: [
      {
        path: "/feed",
        element: createElement(FeedPage),
      },
      {
        path: "/search",
        element: createElement(SearchPage),
      },
      {
        path: "/messages",
        element: createElement(MessagePage),
      },
      {
        path: "/notifications",
        element: createElement(NotificationPage),
      },
      {
        path: "/dashboard",
        element: createElement(Dashboard),
      },
      {
        path: "/projects/:id",
        element: createElement(ProjectPage),
      },
      {
        path: "/blogs/:id",
        element: createElement(BlogPage),
      },
      {
        path: "/profile/:id",
        element: createElement(ProfilePage),
      },
    ],
  },
]);

export default router;
