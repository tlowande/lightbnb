const properties = require('./json/properties.json');
const users = require('./json/users.json');
const db = require('./dbIndex')

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = async function (email) {
  try {
    const userObject = await db.query(`
    SELECT users.* 
    FROM users
    WHERE email = $1;
    `, [email.toLowerCase()])
    if (!userObject) {
      return null
    } else {
      return userObject.rows[0]
    }
  } catch (err) {
    console.error('query error', err.stack)
  }
}


//BUILT WITH PROMISE INSTEAD OF ASYNC/AWAIT
//   return db.query(`
//   SELECT users.* 
//   FROM users
//   WHERE email = $1
//   `, [email.toLowerCase()])
//   .then(res =>  {
//     if(!res){
//       return null
//     } else {
//       return res.rows[0]
//     }
//   })
//   .catch(err => console.error('query error', err.stack));
// }

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = async function (id) {
  try {
    const idObject = await db.query(`
    SELECT users.* 
    FROM users
    WHERE id = $1;
    `, [id])
    if (!idObject) {
      return null
    } else {
      return idObject.rows[0]
    }
  } catch (err) {
    console.error('query error', err.stack)
  }
}

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = async function (user) {
  try {
    const addUser = await db.query(`
    INSERT INTO users (name, password, email)
    VALUES ($1, $2, $3)
    RETURNING *;
    `, [user.name, user.password, user.email])
    if (!addUser) {
      return null
    } else {
      return addUser.rows[0]
    }
  } catch (err) {
    console.error('query error', err.stack)
  }


  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = async function (guest_id, limit = 10) {
  try {
    const userResObj = await db.query(`
    SELECT reservations.*, properties.*, AVG(rating) AS average_rating 
    FROM reservations 
    JOIN property_reviews 
    ON property_reviews.reservation_id = reservations.id 
    JOIN properties ON reservations.property_id = properties.id
    WHERE reservations.guest_id = $1
    GROUP BY properties.id, reservations.id
    LIMIT $2;
    `, [guest_id, limit]);
    if (!userResObj) {
      return null
    } else {
      return userResObj.rows
    }
  }
  catch (err) { console.error('query error', err.stack) };
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const values = []
  let query = `
  SELECT properties.*, AVG(rating) AS average_rating 
  FROM properties 
  LEFT JOIN property_reviews 
  ON property_reviews.property_id = properties.id 
  `;

  if (options.city) {
    values.push(`%${options.city}%`);
    query += `WHERE city iLIKE $${values.length} `;
  }

  if (options.owner_id) {
    values.push(options.owner_id);
    if (values.length === 1) {
      query += ` WHERE owner_id = $${values.length} `;
    } else {
      query += ` AND owner_id = $${values.length} `;
    }
  }
//cost on the DB are multiplied by 100 to  avoid cents
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    values.push((options.minimum_price_per_night * 100), (options.maximum_price_per_night* 100));
    if (values.length === 2) {
      query += ` WHERE cost_per_night BETWEEN $${values.length - 1} AND $${values.length}`;
    } else {
      query += ` AND cost_per_night BETWEEN $${values.length - 1} AND $${values.length}`;
    }
  }

  query += `
  GROUP BY properties.id`
  
  if (options.minimum_rating) {
    values.push(options.minimum_rating);
    query += ` HAVING AVG(rating) >= $${values.length} `;
  }
  
  values.push(limit);
  query += ` ORDER BY cost_per_night
  LIMIT $${values.length};
  `;

  return db.query(query, values)
    .then(res => res.rows)
    .catch(err => console.error('query error', err.stack));
}


//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = async function (property) {
  try {
    const addProperty = await db.query(`
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms,country, street, city, province, post_code )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
    `, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property. number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code ])
    if (!addProperty) {
      return null
    } else {
  
      return addProperty.rows[0]
    }
  } catch (err) {
    console.error('query error', err.stack)
  }
}
  
  
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
exports.addProperty = addProperty;

