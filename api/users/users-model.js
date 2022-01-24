const db = require('../../data/db-config')
/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */
function find() {
  console.log('find')

  return db('users')
}
/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  console.log('finding by filter')
  // return db('users').where({
  //  filter: filter
  // })
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
async function findById(user_id) {
  console.log('finding by ID')

  const user = await db('users').where({
    user_id: user_id
  }).first()
  const { username } = user
  return { user_id, username }
 
}

/**
  resolves to the newly inserted user { user_id, username }
 */
async function add(user) { 
  console.log('adding new user')
  await db('users').insert(user)
  return db('users').where({
    username: user.username
  }).first()
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  find,
  findBy,
  findById,
  add
}