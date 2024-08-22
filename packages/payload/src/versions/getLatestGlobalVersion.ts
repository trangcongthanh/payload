import type { SanitizedGlobalConfig } from '../globals/config/types.js'
import type { Document, Payload, PayloadRequest, Where } from '../types/index.js'

type Args = {
  config: SanitizedGlobalConfig
  locale?: string
  payload: Payload
  published?: boolean
  req?: PayloadRequest
  slug: string
  where: Where
}

export const getLatestGlobalVersion = async ({
  slug,
  config,
  locale,
  payload,
  published,
  req,
  where,
}: Args): Promise<{ global: Document; globalExists: boolean }> => {
  let latestVersion

  const whereQuery = published ? { 'version._status': { equals: 'published' } } : {}

  if (config.versions?.drafts) {
    latestVersion = (
      await payload.db.findGlobalVersions({
        global: slug,
        limit: 1,
        locale,
        pagination: false,
        req,
        sort: '-updatedAt',
        where: whereQuery,
      })
    ).docs[0]
  }

  if (!latestVersion) {
    if (!published) {
      const global = await payload.db.findGlobal({
        slug,
        locale,
        req,
        where,
      })
      const globalExists = Boolean(global)

      return {
        global,
        globalExists,
      }
    }

    return undefined
  }

  const globalExists = Boolean(latestVersion)

  return {
    global: {
      ...latestVersion.version,
      createdAt: latestVersion.createdAt,
      updatedAt: latestVersion.updatedAt,
    },
    globalExists,
  }
}
