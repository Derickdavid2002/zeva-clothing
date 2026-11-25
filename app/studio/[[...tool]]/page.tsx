
"use client";

import dynamic from "next/dynamic";
import config from "../../../sanity.config";

const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        Loading Sanity Studio...
      </div>
    ),
  }
);

export default function StudioPage() {
  return <NextStudio config={config} />;
}
