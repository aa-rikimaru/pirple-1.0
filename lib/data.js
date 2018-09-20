// Dependencies
const fs = require('fs');
const path = require('path');

// Container fo rthe module ( to be exported )
const lib = {};

// Base Directory of the data folder
lib.baseDir = path.join(__dirname, '../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
  // Open the file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fd) => {
    if (!err && fd) {
      // Convert data to string
      let stringData = JSON.stringify(data);

      // Write to file and close it
      fs.writeFile(fd, stringData, (err) => {
        if (!err) {
          fs.close(fd, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing new file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('Could not create new file, it may already exist');
    }
  });
}

// Read data from a newFile
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf-8', (err, data) => {
    callback(err, data);
  });
}

// Update data inside a file
lib.update = (dir, file, data, callback) => {
  // Open the file for writing
  fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fd) => {
    if (!err && fd) {
      // Convert data to a string
      let stringData = JSON.stringify(data);

      // Truncate the file
      fs.truncate(fd, (err) => {
        if (!err) {
          fs.writeFile(fd, stringData, (err) =>{
            if (!err) {
              fs.close(fd, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback('Error closing the file');
                }
              })
            } else {
              callback('Error writing to existing file');
            }
          })
        } else {
          callback('Error truncating the file');
        }
      })
    } else {
      callback('Could not open the file for updating, it may not exist yet');
    }
  })
}

// Delete a file
lib.delete = (dir, file, callback) => {
  // Unlink the file
  fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback('Error deleting file:', err);
    }
  });
}

// Export the module;
module.exports = lib;
