import { createClient } from "next-sanity"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

const configuredClient = projectId && dataset ? createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-10",
  useCdn: false,
  ...(token ? { token } : {}),
}) : null

export const adminClient = (configuredClient || {
  fetch: async () => { throw new Error("Zeva Sanity is not configured.") },
  create: async () => { throw new Error("Zeva Sanity is not configured.") },
  patch: () => { throw new Error("Zeva Sanity is not configured.") },
  delete: async () => { throw new Error("Zeva Sanity is not configured.") },
  transaction: () => { throw new Error("Zeva Sanity is not configured.") },
  assets: { upload: async () => { throw new Error("Zeva Sanity is not configured.") } },
}) as ReturnType<typeof createClient>
