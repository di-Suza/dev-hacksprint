
import { useSelector } from "react-redux";

import { useGetMeQuery } from "../features/auth/api/auth.api";

const AuthInitializer = ({ children }) => {
  const { isLoggedOut, user } = useSelector((state) => state.auth);
  useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: Boolean(user) || isLoggedOut,
  });

  return children;
};

export default AuthInitializer;
