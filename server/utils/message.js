var moment = require('moment');

var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

var generateImage = (from, image) => {
  return {
    from,
    image,
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
