// Define the handlers
let handlers = {};

handlers.users = function(data, callback) {
  let acceptableMethods = ['post', 'get', 'put', 'delete'];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users.[data.method](data);
  } else {
    callback(405);
  }
};

// Containers for the users submethods
handlers._users = {};

// Users ~ POST
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
  // Check that all required fields are filled out
  let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.lastName.trim() : false;
  let password = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length > 10 ? data.payload.lastName.trim() : false;

}
// Users ~ GET
handlers._users.post = (data, callback) => {

}
// Users ~ PUT
handlers._users.post = (data, callback) => {

}
// Users ~ DELETE
handlers._users.post = (data, callback) => {

}


// Ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

handlers.notFound = (data, callback) => {
  callback(404);
};

// Export the module
module.exports = handlers;
