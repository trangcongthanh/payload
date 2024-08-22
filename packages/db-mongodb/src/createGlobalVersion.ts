import type { CreateGlobalVersion, Document, PayloadRequest } from 'payload'

import type { MongooseAdapter } from './index.js'

import { withSession } from './withSession.js'

export const createGlobalVersion: CreateGlobalVersion = async function createGlobalVersion(
  this: MongooseAdapter,
  {
    autosave,
    createdAt,
    globalSlug,
    parent,
    publishedLocale,
    req = {} as PayloadRequest,
    snapshot,
    updatedAt,
    versionData,
  },
) {
  const VersionModel = this.versions[globalSlug]
  const options = await withSession(this, req)

  const [doc] = await VersionModel.create(
    [
      {
        autosave,
        createdAt,
        latest: true,
        parent,
        publishedLocale,
        snapshot,
        updatedAt,
        version: versionData,
      },
    ],
    options,
    req,
  )

  await VersionModel.updateMany(
    {
      $and: [
        {
          _id: {
            $ne: doc._id,
          },
        },
        {
          parent: {
            $eq: parent,
          },
        },
        {
          latest: {
            $eq: true,
          },
        },
      ],
    },
    { $unset: { latest: 1 } },
    options,
  )

  const result: Document = JSON.parse(JSON.stringify(doc))
  const verificationToken = doc._verificationToken

  // custom id type reset
  result.id = result._id
  if (verificationToken) {
    result._verificationToken = verificationToken
  }
  return result
}
