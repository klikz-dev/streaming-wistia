'use strict';

var MCrypt = require('mcrypt').MCrypt;

var DEFAULT_ALGORITHM = 'des';
var DEFAULT_MODE = 'ecb';
var DEFAULT_ENCODING = 'base64';

var Encryption = function(secretKey, algorithm, mode, encoding) {
  if (!secretKey) {
    throw new Error('Encryption: You must provide a secret key!');
  }
  this.algorithm = algorithm || DEFAULT_ALGORITHM;
  this.mode = mode || DEFAULT_MODE;
  this.encoding = encoding || DEFAULT_ENCODING;

  this.proccessor = new MCrypt(this.algorithm, this.mode);
  this.proccessor.open(secretKey);

};

Encryption.prototype.encrypt = function(message) {

  var ciphertext = this.proccessor.encrypt(message);
  return ciphertext.toString(this.encoding);

};

Encryption.prototype.decrypt = function(message) {

  var plaintext = this.proccessor.decrypt(new Buffer(message, this.encoding));
  return plaintext.toString().replace(/\0|\1/g, ''); //remove any null terminators

};

Encryption.prototype.sampleData = function() {
  return {
    membership_id: '000002264143',
    first_name: 'I\'ESHA',
    last_name: 'PAUL',
    email_address: 'PAULI@FULTONSCHOOLS.ORG',
    role: 'User',
    stripeid: 'cus_9ELbr0bPlw02l4',
    timestamp: '03/22/2016'
  };
};

module.exports = Encryption;
