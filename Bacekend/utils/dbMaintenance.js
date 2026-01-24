/**
 * DB maintenance helpers (Postgres).
 *
 * Problem solved:
 * - If the `users.id` sequence gets out of sync (after manual inserts / restore / seed),
 *   Postgres can generate an ID that already exists, causing:
 *   SequelizeUniqueConstraintError: duplicate key value violates unique constraint "users_pkey"
 */

const isSafeSqlIdentifier = (name) => typeof name === 'string' && /^[a-zA-Z0-9_]+$/.test(name);

async function fixUsersIdSequence(sequelize) {
  // This works for SERIAL and IDENTITY-backed sequences.
  const sql = `
    SELECT setval(
      pg_get_serial_sequence('"users"', 'id'),
      (SELECT COALESCE(MAX(id), 1) FROM "users"),
      true
    );
  `;

  await sequelize.query(sql);
}

async function listPublicTables(sequelize) {
  const [rows] = await sequelize.query(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
  );
  return (rows || [])
    .map(r => r.tablename)
    .filter(isSafeSqlIdentifier);
}

async function fixIdSequenceForTable(sequelize, tableName, idColumn = 'id') {
  if (!isSafeSqlIdentifier(tableName) || !isSafeSqlIdentifier(idColumn)) return false;

  // Ask Postgres which sequence backs this table+column. If none -> skip.
  const [seqRows] = await sequelize.query(
    `SELECT pg_get_serial_sequence('"${tableName}"', '${idColumn}') AS seq;`
  );
  const seq = seqRows?.[0]?.seq;
  if (!seq) return false;

  const seqLiteral = String(seq).replace(/'/g, "''");
  await sequelize.query(
    `SELECT setval('${seqLiteral}', (SELECT COALESCE(MAX("${idColumn}"), 1) FROM "${tableName}"), true);`
  );
  return true;
}

async function fixAllPublicIdSequences(sequelize) {
  const tables = await listPublicTables(sequelize);
  let fixedCount = 0;

  for (const tableName of tables) {
    try {
      const fixed = await fixIdSequenceForTable(sequelize, tableName, 'id');
      if (fixed) fixedCount += 1;
    } catch (e) {
      // Skip tables where we don't have permission or column doesn't exist.
      continue;
    }
  }

  return fixedCount;
}

async function runDbMaintenance(sequelize, options = {}) {
  const {
    // default: run in development/test, skip in production unless explicitly enabled
    enabled = process.env.AUTO_FIX_DB_SEQUENCES === 'true'
      || process.env.NODE_ENV === 'development'
      || process.env.NODE_ENV === 'test',
  } = options;

  if (!enabled) return;

  // Best-effort: if this fails (permissions, missing table), don't crash the server.
  try {
    // Keep the original fix for clarity, and also fix every public table that has an `id` sequence.
    await fixUsersIdSequence(sequelize);
    const fixedCount = await fixAllPublicIdSequences(sequelize);
    // eslint-disable-next-line no-console
    console.log(`[db] sequences synced (tables fixed: ${fixedCount})`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[db] sequence sync skipped/failed:', e?.message || e);
  }
}

module.exports = {
  fixUsersIdSequence,
  fixIdSequenceForTable,
  fixAllPublicIdSequences,
  runDbMaintenance,
};

