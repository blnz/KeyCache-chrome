console.log("loading content.js");

import React, { Component } from 'react';
import { render } from 'react-dom';
import Dock from 'react-dock';
import InjectApp from './inject';

console.log("InjectApp is:", InjectApp);

function getLoginForm(){
  var forms = document.getElementsByTagName('form');

  var login_forms = [];

  var login_keywords_arr = ["signin", "sign_in", "login", "log_in"];

  for(var i=0; i<forms.length; i++){
    var username_field;
    var password_field;
    var possess_login_keyword = false;

    var password_fields = getInputsByType(forms[i], 'password');
    var email_fields    = getInputsByType(forms[i], 'email');
    var text_fields     = getInputsByType(forms[i], 'text');

    var password_field_count = password_fields.length;

    var username_field_count = function(){
      if(email_fields.length > 0){
        return email_fields.length;
      }

      return text_fields.length;
    }();

    if(text_fields.length > 0){
      username_field = text_fields[0];
    }

    if(email_fields.length > 0){
      username_field = email_fields[0];
    }

    if(password_fields.length > 0){
      password_field = password_fields[0];
    }

    for(var j=0; j<login_keywords_arr.length; j++){
      var regex = new RegExp(login_keywords_arr[j]);

      var matches = regex.exec(forms[i].className) ||
          regex.exec(forms[i].name)      ||
          regex.exec(forms[i].id)        ||
          regex.exec(forms[i].action);

      if(matches && matches.length > 0){
        possess_login_keyword = true; break;
      } else {
        possess_login_keyword = false;
      }
    }

    if(username_field_count == 1 && password_field_count == 1){
      login_forms.push({'username_field': username_field, 'password_field': password_field, 'possess_login_keyword': possess_login_keyword});
    }
  }

  // Get only visible forms
  if(login_forms.length > 1){
    login_forms = function(forms){
      var result = new Array();

      for(var i=0; i<forms.length; i++){
        if(VISIBILITY.isVisible(forms[i].username_field) && VISIBILITY.isVisible(forms[i].password_field)){
          result.push(forms[i]);
        }
      }

      return result;
    }(login_forms);
  }

  // Get the forms only containing login keywords
  if (login_forms.length > 1){
    login_forms = function(forms){
      var result = new Array();

      for(var i=0; i<forms.length; i++){
        if(forms[i].possess_login_keyword){
          result.push(forms[i]);
        }
      }

      return result;
    }(login_forms);
  }

  if(login_forms.length == 0){
    // alert('IDKEY error: Login form could not be identified.');
    return undefined;
  } else if(login_forms.length == 1) {
    return {
      'username_field': login_forms[0].username_field,
      'password_field': login_forms[0].password_field
    }
  } else if(login_forms.length > 1){
    alert('IDKEY error: There is more than one form on the page, which could be identified as login form.');
    return undefined;
  }
}

function fillCredentials(username, password){
  var login_form = getLoginForm();

  if(login_form != undefined){
    login_form.password_field.value = password;
    login_form.password_field.focus();
    login_form.password_field.blur();
    login_form.username_field.value = username;
    login_form.username_field.focus();
    login_form.username_field.blur();
  }
}

function getInputsByType(node, type){
  var allInputs  = node.getElementsByTagName("input");
  var typeInputs = new Array();

  for (var i=0; i<allInputs.length; i++) {
    if(allInputs[i].type == type){
      typeInputs.push(allInputs[i]);
    }
  }

  return typeInputs;
}

function obfuscatePasswordString(s){
  var result = '';

  for(var i = 0; i < s.length; i++) {
    result += '*';
  }

  return result;
}


/**
 * Author: Jason Farrell
 * Author URI: http://useallfive.com/
 *
 * Description: Handles all things involving element visibility.
 * Package URL: https://github.com/UseAllFive/ua5-js-utils
 */
var VISIBILITY = (function(){
  /**
   * Checks if a DOM element is visible. Takes into
   * consideration its parents and overflow.
   *
   * @param (el)      the DOM element to check if is visible
   *
   * These params are optional that are sent in recursively,
   * you typically won't use these:
   *
   * @param (t)       Top corner position number
   * @param (r)       Right corner position number
   * @param (b)       Bottom corner position number
   * @param (l)       Left corner position number
   * @param (w)       Element width number
   * @param (h)       Element height number
   */
  function _isVisible(el, t, r, b, l, w, h) {
    var p = el.parentNode,
        VISIBLE_PADDING = 2;

    if ( !_elementInDocument(el) ) {
      return false;
    }

    //-- Return true for document node
    if ( 9 === p.nodeType ) {
      return true;
    }

    //-- Return false if our element is invisible
    if (
      '0' === _getStyle(el, 'opacity') ||
        'none' === _getStyle(el, 'display') ||
        'hidden' === _getStyle(el, 'visibility')
    ) {
      return false;
    }
    
    if ( 
      'undefined' === typeof(t) ||
        'undefined' === typeof(r) ||
        'undefined' === typeof(b) ||
        'undefined' === typeof(l) ||
        'undefined' === typeof(w) ||
        'undefined' === typeof(h)
    ) {
      t = el.offsetTop;
      l = el.offsetLeft;
      b = t + el.offsetHeight;
      r = l + el.offsetWidth;
      w = el.offsetWidth;
      h = el.offsetHeight;
    }
    //-- If we have a parent, let's continue:
    if ( p ) {
      //-- Check if the parent can hide its children.
      if ( ('hidden' === _getStyle(p, 'overflow') || 'scroll' === _getStyle(p, 'overflow')) ) {
        //-- Only check if the offset is different for the parent
        if (
          //-- If the target element is to the right of the parent elm
          l + VISIBLE_PADDING > p.offsetWidth + p.scrollLeft ||
            //-- If the target element is to the left of the parent elm
            l + w - VISIBLE_PADDING < p.scrollLeft ||
            //-- If the target element is under the parent elm
            t + VISIBLE_PADDING > p.offsetHeight + p.scrollTop ||
            //-- If the target element is above the parent elm
            t + h - VISIBLE_PADDING < p.scrollTop
        ) {
          //-- Our target element is out of bounds:
          return false;
        }
      }
      //-- Add the offset parent's left/top coords to our element's offset:
      if ( el.offsetParent === p ) {
        l += p.offsetLeft;
        t += p.offsetTop;
      }
      //-- Let's recursively check upwards:
      return _isVisible(p, t, r, b, l, w, h);
    }
    return true;
  }

  //-- Cross browser method to get style properties:
  function _getStyle(el, property) {
    if ( window.getComputedStyle ) {
      return document.defaultView.getComputedStyle(el,null)[property];  
    }
    if ( el.currentStyle ) {
      return el.currentStyle[property];
    }
  }

  function _elementInDocument(element) {
    while (element = element.parentNode) {
      if (element == document) {
        return true;
      }
    }
    return false;
  }

  return {
    'getStyle' : _getStyle,
    'isVisible' : _isVisible
  }

})();

var lf = getLoginForm();
if (lf) {
  console.log("found a login form");
   const injectDOM = document.createElement('div');
   injectDOM.className = 'inject-keycache';
   injectDOM.style.textAlign = 'center';
   document.body.appendChild(injectDOM);
   render(<InjectApp />, injectDOM);
} else {
  console.log("no login form");
}

