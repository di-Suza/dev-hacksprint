import { RouterProvider } from "react-router";
import { Toaster } from "sonner";

import AuthInitializer from "./app/authInitializer";
import router from "./app/routes/router";

function App() {
  return (
    <>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
          },
        }}
      />
    </>
  );
}

export default App;
