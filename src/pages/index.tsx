// pages/index.tsx
import { Analytics } from "@vercel/analytics/react";

import Home from "./home";
import Chat from "./chat";

export default function Index() {
  return (
    <>
      <Home />
      <Analytics />
    </>
  );
}
