'use strict';
var request = require('request');

const API_ENDPOINT = 'https://api.wistia.com/v1';

/**
 * Takes in the API request options, ensures they're formatted correctly for the request and makes it. Also renews the token if it has expired
 * @param {String} endpoint - the relative url to make the request to
 * @param {String} method - the method of the request
 * @returns {Promise} that resolves to the response or an error
 */
module.exports.send = function (endpoint, method = 'GET') {
  return new Promise(function (resolve, reject) {
    request(
      {
        method: method,
        url: API_ENDPOINT + endpoint,
        headers: {
          Authorization: 'Bearer ' + process.env.WISTIA_KEY,
        },
      },
      (error, response) => {
        if (error) {
          reject(error);
        }
        return resolve(response.body);
      }
    );
  });
};
