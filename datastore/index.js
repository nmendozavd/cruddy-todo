const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // asy - possible callback doesn't complete before next lines
  // needed to pull strNum, by defining it in the call of the getNextUniqueID
  counter.getNextUniqueId((err, strNum) => {
    if (err) {
      throw ('getNextUniqueId unsuccessful');
    } else {
      var id = strNum;
      items[id] = text;
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          console.log('writeFile error!');
        } else {
          callback(null, { id, text });
          // console.log(items);
        }
      });
      // callback(null, { id, text });
    }
  });
};


exports.readAll = (callback) => {
  fs.readdir('./data/', (err, data) => {
    var data = _.map(items, (text, id) => {
      return { id, text};
      console.log('id:', id);
    });
    callback(null, data);
  });

  //   var data = _.map(items, (text, id) => {
  //     return { id, text };
  //   });
  //   callback(null, data);
  // };

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
