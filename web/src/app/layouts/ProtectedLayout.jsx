import { Navigate, useLocation } from "react-router";
import { shallowEqual, useSelector } from "react-redux";

import FullPageLoader from "../../shared/components/FullPageLoader";
import SidebarLayout from "./SidebarLayout";

function ProtectedLayout() {
  const location = useLocation();

  const { isLoggedOut, status, userId } = useSelector(
    (state) => ({
      isLoggedOut: state.auth.isLoggedOut,
      status: state.auth.status,
      userId: state.auth.user?._id,
    }),
    shallowEqual
  );

  if (userId) {
    return <SidebarLayout />;
  }

  if ((status === "idle" || status === "loading") && !isLoggedOut) {
    return <FullPageLoader isLoading={true} />;
  }

  if (isLoggedOut || status === "failed") {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <FullPageLoader isLoading={true} />;
}

export default ProtectedLayout;
