var moment = require('moment');

var generateMessage = (text) => {
  return {
    text,
    createdAt: moment().valueOf()
  };
};

var generateImage = (fName) => {
  return {
    fName,
    createdAt: moment().valueOf()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage, generateLocationMessage,generateImage};
