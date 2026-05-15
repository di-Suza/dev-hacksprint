import { useMemo, useState } from "react";

function useLandingPage() {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 18 });

  function updateSpotlight(event) {
    const x = (event.clientX / window.innerWidth) * 100;
    const y = (event.clientY / window.innerHeight) * 100;
    setSpotlight({ x, y });
  }

  const spotlightStyle = useMemo(
    () => ({
      background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, color-mix(in srgb, var(--color-accent) 15%, transparent), transparent 24%)`,
    }),
    [spotlight],
  );

  return {
    spotlightStyle,
    updateSpotlight,
  };
}

export default useLandingPage;
