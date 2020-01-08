const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
// in order to read contents in files we need promises library, we import
const Promise = require('bluebird');
// need to promisify readFilePromise
const readFilePromise = Promise.promisify(fs.readFile);


var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // asy - possible callback doesn't complete before next lines
  // strNum is now passed from getNextUniqueID, and defined as the second parameter ID
  counter.getNextUniqueId((err, id) => {
    if (err) {
      // we want to return error here and stop programming from running if error
      return callback (err);
    } else {
      var filePath = path.join(exports.dataDir, `${id}.txt`);
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};


exports.readAll = (callback) => {
  // data, second parameter is array of the folder names, we named files = [];
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      // map turns files into array of objects in data
      var data = _.map(files, (file) => {
        // extract ID
        // path > /users/noelmendoza/.../00001.txt
        // path.basename grabs the end of the file name and removes .txt
        var id = path.basename(file, '.txt');
        // we want to return this because this is what displays to user, the file names if we refresh
        // we add readFilePromise to return array of promises > future values
        var filePath = path.join(exports.dataDir, file);
        return readFilePromise(filePath).then((fileData) => {
          return {
            id: id,
            text: fileData.toString()
          };
        });
      });
      // call all promises, then callback
      Promise.all(data).then((items) => {
        callback(null, items);
      });
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  // delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    //console.log(`./data/${id}`);
    // callback(fs.unlink(`./data/${id}`), () => {
    //   console.log('success');
    // });
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};