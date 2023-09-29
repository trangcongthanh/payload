import type { Payload } from 'payload'

import path from 'path'
import { createDatabaseAdapter } from 'payload/database'

import type { Args, SQLiteAdapter, SQLiteAdapterResult } from './types'

import { connect } from './connect'
import { create } from './create'
import { createGlobal } from './createGlobal'
import { createGlobalVersion } from './createGlobalVersion'
import { createVersion } from './createVersion'
import { deleteMany } from './deleteMany'
import { deleteOne } from './deleteOne'
import { deleteVersions } from './deleteVersions'
import { destroy } from './destroy'
import { find } from './find'
import { findGlobal } from './findGlobal'
import { findGlobalVersions } from './findGlobalVersions'
import { findOne } from './findOne'
import { findVersions } from './findVersions'
import { init } from './init'
import { queryDrafts } from './queryDrafts'
import { beginTransaction } from './transactions/beginTransaction'
import { commitTransaction } from './transactions/commitTransaction'
import { rollbackTransaction } from './transactions/rollbackTransaction'
import { updateOne } from './update'
import { updateGlobal } from './updateGlobal'
import { updateGlobalVersion } from './updateGlobalVersion'
import { updateVersion } from './updateVersion'
import { webpack } from './webpack'

export function sqliteAdapter (args: Args): SQLiteAdapterResult {
  function adapter ({ payload }: { payload: Payload }) {
    const migrationDir = args.migrationDir || path.resolve(__dirname, '../../../migrations')
    return createDatabaseAdapter<SQLiteAdapter>({
      ...args,
      name: 'sqlite',

      // adapter-specific
      database: args.database || 'sqlite.db',
      db: undefined,
      enums: {},
      relations: {},
      schema: {},
      sessions: {},
      tables: {},

      // DatabaseAdapter
      beginTransaction,
      commitTransaction,
      connect,
      create,
      createGlobal,
      createGlobalVersion,
      createVersion,
      defaultIDType: 'number',
      deleteMany,
      deleteOne,
      deleteVersions,
      destroy,
      find,
      findGlobal,
      findGlobalVersions,
      findOne,
      findVersions,
      init,
      migrationDir,
      payload,
      queryDrafts,
      rollbackTransaction,
      updateGlobal,
      updateGlobalVersion,
      updateOne,
      updateVersion,
      webpack,
    })
  }

  return adapter
}
