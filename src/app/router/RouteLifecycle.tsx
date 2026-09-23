import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { routeMetaFor } from "./routeRegistry";

export function RouteLifecycle() {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const meta = routeMetaFor(location.pathname);
    const title = meta?.title ?? "GrowthOS";
    document.title = title === "GrowthOS" ? title : `${title} · GrowthOS`;
    setAnnouncement(title);

    const frame = window.requestAnimationFrame(() => {
      document.getElementById("main-content")?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {announcement ? `Navigated to ${announcement}` : ""}
    </div>
  );
}
