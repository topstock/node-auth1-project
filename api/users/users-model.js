const db = require('../../data/db-config')
/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  return db('users').select('user_id','username')
}
/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  console.log('finding by filter')
  return db('users')
    .select('user_id','username')
    .where(filter)
    .first()
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  console.log('finding by id')
  return db('users')
    .select('user_id','username')
    .where("user_id", user_id).first()
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) { 
  console.log('adding new user')
  const newIds = await db('users')
    .insert(user)
  console.log('added ', newIds[0])
  return findById(newIds[0])
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add
}