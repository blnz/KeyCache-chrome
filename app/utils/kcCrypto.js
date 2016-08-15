const bluebird = require('bluebird');
import {toByteArray, fromByteArray} from 'base64-js'

function stringToArrayBuffer(string) {
  var encoder = new TextEncoder("utf-8");
  return encoder.encode(string);
}

function arrayBufferToString(abuf) {
  var decoder = new TextDecoder("utf-8");
  return decoder.decode(abuf);
}

// Wraps a webcrypto key in a password,
// yeilding an object we can serialize to JSON
// the wrapped key produced is an object with three fields of base64
// encoded Uint8Arrays: { salt, iv, wrapped }
//
export function wrappedKey(password, wrappable) {
  const salt = window.crypto.getRandomValues(new Uint8Array(8))
  const iterations = 100
  const hash = 'SHA-256'
  const iv  = window.crypto.getRandomValues(new Uint8Array(16))

  return new Promise( function(resolve, reject) {
    return window.crypto.subtle.importKey(
      "raw",
      stringToArrayBuffer(password),
      {"name": "PBKDF2"},
      false,
      ["deriveKey"]
    ).
    // Derive a key from the password
    then(function(baseKey){
      return window.crypto.subtle.deriveKey(
        {
          "name": "PBKDF2",
          "salt": salt.buffer, // stringToArrayBuffer(salt),
          "iterations": iterations,
          "hash": hash
        },
        baseKey,
        {"name": "AES-CBC", "length": 256}, // Key we want
        true,                               // Extrable
        ["encrypt", "decrypt", "wrapKey"]              // For new key
      );
    }).
    then(function(derivedWrappingKey) {
      return window.crypto.subtle.wrapKey(
        "jwk", //can be "jwk", "raw", "spki", or "pkcs8"
        wrappable, //the key you want to wrap, must be able to export to above format
        derivedWrappingKey, //the AES-CBC key with "wrapKey" usage flag
        {   name: "AES-CBC", iv: iv }
      )
    }).
    then(function(wrapped){
      //returns an ArrayBuffer containing the encrypted data
      console.log("wrapped", wrapped)
      console.log("asArray", new Uint8Array(wrapped));
      resolve({
        wrapped: fromByteArray(new Uint8Array(wrapped)),
        iv: fromByteArray(iv),
        salt: fromByteArray(salt)
      })
    }).
    catch(function(err) {
      console.log("Key derivation failed: " + err.message);
      reject(err)
    });
  })
}

export function unWrappedKey(password, serialized) {
  const { wrapped, iv, salt } = serialized
  console.log("unWrapped key with serialized:", serialized)
  const iterations = 100
  const hash = 'SHA-256'

  return new Promise( function(resolve, reject) {
    return window.crypto.subtle.importKey(
      "raw",
      stringToArrayBuffer(password),
      {"name": "PBKDF2"},
      false,
      ["deriveKey"]).
      // Derive a key from the password
      then(function(baseKey){
        console.log("base key was imported, salt is:")
        return window.crypto.subtle.deriveKey(
          {
            "name": "PBKDF2",
            "salt": toByteArray(salt).buffer,
            "iterations": iterations,
            "hash": hash
          },
          baseKey,
          {"name": "AES-CBC", "length": 256}, // Key we want
          true,                               // Extrable
          ["encrypt", "decrypt", "wrapKey", "unwrapKey"]              // For new key
        );
      }).

      then(function(derivedWrappingKey) {
        console.log("we have our derived wrappingKey", derivedWrappingKey)
        return window.crypto.subtle.unwrapKey(
          "jwk", //"jwk", "raw", "spki", or "pkcs8" (whatever was used in wrapping)
          toByteArray(wrapped), //the key you want to unwrap
          derivedWrappingKey, //the AES-CBC key with "unwrapKey" usage flag
          {   //these are the wrapping key's algorithm options
          name: "AES-CBC",
          iv:  toByteArray(iv).buffer, //The initialization vector we used to encrypt
        },
        {   //this what you want the wrapped key to become (same as when wrapping)
          name: "AES-CBC",
          length: 256
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //the usages you want the unwrapped key to have
      )
    })
    .then(function(key){
      //returns a key object
      console.log(key);
      resolve(key)
    })
    .catch(function(err){
      console.error(err);
      reject(err)
    })
  })
}


export function kcEncrypt(key, data) {
  const iv = window.crypto.getRandomValues(new Uint8Array(16))

  return window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: iv
    },
    key, //from generateKey or importKey above
    data //ArrayBuffer of data you want to encrypt
  )
  .then(function(encrypted){
    //returns an ArrayBuffer containing the encrypted data
    console.log(new Uint8Array(encrypted));
    return { iv: iv, cipherText: new Uint8Array(encrypted) }
  })
  .catch(function(err){
    console.error(err);
  });
}

//returns a an object with two fields: {iv64, cipherText64} both fields
export function encryptStringToSerialized(key, data) {
  return kcEncrypt(key, stringToArrayBuffer(data))
  .then(function(encrypted) {
    const {iv, cipherText} = encrypted
    return {iv64: fromByteArray(iv), cipherText64: fromByteArray(cipherText)}
  })
  .catch(function(err){
    console.error(err);
  });
}

// decrypts a object with two fields: {iv64, cipherText64} both fields
// base64 encoded Uint8Arrays which we'll decrypt with the given key
// and resolve the decrypted bytes to a utf8 string
export function decryptSerializedToString(key, serialized) {
  const { iv64, cipherText64 } = serialized
  return kcDecrypt(key, toByteArray(iv64), toByteArray(cipherText64))
  .then(function(bytes){
    return arrayBufferToString(bytes)
  })
  .catch(function(err){
    console.error(err);
  })
}

export function kcDecrypt(key, iv, data) {
  return window.crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: iv
    },
    key, //from generateKey or importKey above
    data.buffer //ArrayBuffer of data you want to encrypt
  )
  .then (function(decrypted) {
    console.log("we've decrypted to:", new Uint8Array(decrypted));
    return decrypted
  })
}

// unit test ... creates a new symmetric key,
// then encrypts some text with that key
// then wraps the key in a new key derived from a password
// then uses the password to extract a copy of the original key
// and uses the extracted key copy to decrypt the original text
export function testWrapping1(password) {
  var data = "hello world"
  var keyPromise = window.crypto.subtle.generateKey(
    {name: "AES-CBC", length: 256}, // Algorithm the key will be used with
    true,                           // Can extract key value to binary string
    ["encrypt", "decrypt"]          // Use for these operations
  );

  keyPromise.catch(function(err) {console.log("Something went wrong: " + err.message);});

  var encryptedPromise = keyPromise.then(function(key) {
    console.log("got a new AES-KEY:", key)
    return kcEncrypt(key, stringToArrayBuffer(data))
  });

  var wrappedPromise = keyPromise.then(function (key){
    return wrappedKey(password, key)
  });

  return bluebird.all([keyPromise, encryptedPromise, wrappedPromise])
  .spread( function(key, encrypted, wrapped) {
    //returns an ArrayBuffer containing the encrypted data
    return  { key, encrypted, wrapped}
  })
  .then(function (keyAndEncrypted) {
    console.log("our encrypted obbject is with key and wrappedKey", keyAndEncrypted)
    const { key, encrypted, wrapped } = keyAndEncrypted
    return unWrappedKey(password, wrapped)
    .then(function(unwrappedKey){
      return kcDecrypt(unwrappedKey, encrypted.iv, encrypted.cipherText)
    })
  })
  .then(function(decrypted){
    console.log("got decrypted", decrypted)
    return decrypted
  })
  .catch(function(err) {
    console.log(err)
  })
}

// another unit test ... creates a new symmetric key,
// then encrypts some text with that key
// then wraps the key in a new key derived from a password
// then uses the password to extract a copy of the original key
// and uses the extracted key copy to decrypt the original text
export function testWrapping(password) {
  var data = "hello there world"
  var keyPromise = window.crypto.subtle.generateKey(
    {name: "AES-CBC", length: 256}, // Algorithm the key will be used with
    true,                           // Can extract key value to binary string
    ["encrypt", "decrypt"]          // Use for these operations
  );

  keyPromise.catch(function(err) {console.log("Something went wrong: " + err.message);});

  var encryptedPromise = keyPromise.then(function(key) {
    console.log("got a new AES-KEY:", key)
    return encryptStringToSerialized(key, data)
  });

  var wrappedPromise = keyPromise.then(function (key){
    return wrappedKey(password, key)
  });

  return bluebird.all([keyPromise, encryptedPromise, wrappedPromise])
  .spread( function(key, encrypted, wrapped) {
    //returns an ArrayBuffer containing the encrypted data
    return  { key, encrypted, wrapped}
  })
  .then(function (keyAndEncrypted) {
    console.log("our encrypted obbject is with key and wrappedKey", keyAndEncrypted)
    const { key, encrypted, wrapped } = keyAndEncrypted
    return unWrappedKey(password, wrapped)
    .then(function(unwrappedKey){
      return decryptSerializedToString(unwrappedKey, encrypted)
    })
  })
  .then(function(decrypted){
    console.log("got decrypted", decrypted)
    return decrypted
  })
  .catch(function(err) {
    console.log(err)
  })
}
