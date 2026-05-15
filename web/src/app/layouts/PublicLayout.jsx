import { Navigate, Outlet, useLocation } from "react-router";
import { shallowEqual, useSelector } from "react-redux";

function PublicLayout() {
  const location = useLocation();
  const { userId } = useSelector(
    (state) => ({
      userId: state.auth.user?._id,
    }),
    shallowEqual
  );

  if (userId) {
    const from = location.state?.from;
    const redirectTo = from
      ? `${from.pathname || "/dashboard"}${from.search || ""}${from.hash || ""}`
      : "/dashboard";

    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default PublicLayout;
