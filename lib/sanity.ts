
import { createClient } from "next-sanity"
import { createImageUrlBuilder } from "@sanity/image-url"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

const configuredClient =
  projectId && dataset
    ? createClient({
        projectId,
        dataset,
        apiVersion:
          process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-10",
        useCdn: false,
      })
    : null

// Keep the storefront renderable before Sanity credentials are configured.
export const client = (configuredClient || {
  fetch: async () => {
    throw new Error(
      "Zeva Sanity is not configured. Set the Zeva project ID and dataset."
    )
  },
}) as ReturnType<typeof createClient>

const builder = configuredClient
  ? createImageUrlBuilder(configuredClient)
  : null

export function urlFor(source: any) {
  if (!builder) {
    throw new Error("Zeva Sanity is not configured.")
  }

  return builder.image(source)
}
