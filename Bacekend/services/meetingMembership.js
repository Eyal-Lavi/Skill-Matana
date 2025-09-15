// Note: This project uses CommonJS. If switching to ES Modules, replace
// require/module.exports with import/export accordingly.

/**
 * Interface to be replaced with DB later (e.g., Sequelize/MySQL).
 * Currently: allows everyone (DEV ONLY).
 * @param {string|number} meetingId
 * @param {string|number} userId
 * @returns {Promise<boolean>}
 */
async function isParticipant(meetingId, userId) {
  void meetingId; void userId;
  // TODO: Replace with a DB check against participants table
  return true;
}

module.exports = { isParticipant };

