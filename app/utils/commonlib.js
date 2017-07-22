function getLoginForm(){
  var forms = document.getElementsByTagName('form');

  var login_forms = [];

  var done = false;
  
  console.log("Found " + forms.length + " forms");
  
  console.log(forms);
  
  for(var i=0; i<forms.length; i++){
    
    console.log("Processing form " + i );
    
    // use our super nifty method for login form finding
    var formBreakdown = findFormAuthFields(forms[i]);
    // looks like we found something, queue it up
    if( formBreakdown !== null && formBreakdown !== undefined )
    {
      console.log("Got a valid option. queueing it");
      console.log(formBreakdown);
      login_forms.push(formBreakdown);
      done = true;
    }
    
    console.log("Done processing form " + i );
    
    // we are done once we find one suitable option
    if( done )
    {
      break;
    }
    
  }  
  
  console.log("Done processing forms");
  
  // Get only visible forms
  if (login_forms.length > 1) {
    login_forms = function(forms){
      var result = new Array();

      for (var i=0; i < forms.length; i++){
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

  if (login_forms.length == 0) {
    console.log("can't find the form after all");
    return undefined;
  } else if (login_forms.length == 1) {
    return {
      'username_field': login_forms[0].username_field,
      'password_field': login_forms[0].password_field
    }
  } else if(login_forms.length > 1) {
    console.log("more than one form");
    return undefined;
  }
}

 const sites = { 
      "www.bmwusa.com": { "login_regex": ".*tbLoginId", "password_regex": ".*tbPassword" },
      "www.reddit.com": { "on_name":"true", "login_regex": "^user$", "password_regex": "^passwd$"},
      "www.linkedin.com": { "login_regex": "^login-email$", "password_regex": "^login-password$"},
      "www.facebook.com": { "login_regex": "^email$", "password_regex": "^pass$"},
      "www.amazon.com": { "login_regex": "^ap_email$", "password_regex": "^ap_password$"},
      "signin.ebay.com": { "login_regex": "^userid$", "password_regex": "^pass$"},
      "www.paypal.com": { "login_regex": "^email$", "password_regex": "^password$"},
      "github.com": { "login_regex": "^login_field$", "password_regex": "^password$"},
      "www.svtperformance.com": { "login_regex": "^navbar_username$", "password_regex": "^navbar_password$"},
      "www.coinbase.com": { "login_regex": "^email$", "password_regex": "^password$"},
      "www.dropbox.com": { "login_regex": "^pyxl.*", "password_regex": "^pyxl.*"},
      "www.fark.com": { "login_regex": "^loginName$", "password_regex": "^loginPass$"},
      "www.pinterest.com": { "login_regex": "^userEmail$", "password_regex": "^userPassword$"},
      "login.live.com": { "on_name":"true", "login_regex": "loginfmt", "password_regex": "passwd"},
      "twitter.com": { "login_regex": "^signin-email$", "password_regex": "^signin-password$"},
      "www.tumblr.com": { "login_regex": "^signup_email$", "password_regex": "^signup_password$"},
      "login.yahoo.com": { "login_regex": "^login-username$", "password_regex": "^login-passwd$"},
      "my.screenname.aol.com": { "on_name":"true", "login_regex": "^loginId$", "password_regex": "^password$"},
      "www.bankofamerica.com": { "login_regex": "^onlineId1$", "password_regex": "^passcode1$"},
      "www.netflix.com": { "login_regex": "^email$", "password_regex": "^password$"},
      "accounts.craigslist.org": { "login_regex": "^inputEmailHandle$", "password_regex": "^inputPassword$"},
      "www.pornhub.com": {"login_regex": "^username$", "password_regex": "^password$"}
      };


/*
 *
 * function findFormAuthFields(form)
 *
 * This method will walk a form and look for username and password fields 
 * based on hostname and a regex.
 * If this does not work, findFormFieldsGhetto will be run.
 *
 */


function findFormAuthFields(form)
{
  var host = location.hostname;
  var possess_login_keyword = true;
  var site_json_data = '{' +
      '"www.bmwusa.com": { "login_regex": ".*tbLoginId","password_regex": ".*tbPassword" },'+
      '"www.reddit.com": { "on_name":"true", "login_regex": "^user$", "password_regex": "^passwd$"},'+
      '"www.linkedin.com": { "login_regex": "^login-email$", "password_regex": "^login-password$"},'+
      '"www.facebook.com": { "login_regex": "^email$", "password_regex": "^pass$"},'+
      '"www.amazon.com": { "login_regex": "^ap_email$", "password_regex": "^ap_password$"},'+
      '"signin.ebay.com": { "login_regex": "^userid$", "password_regex": "^pass$"},'+
      '"www.paypal.com": { "login_regex": "^email$", "password_regex": "^password$"},'+
      '"github.com": { "login_regex": "^login_field$", "password_regex": "^password$"},'+
      '"www.svtperformance.com": { "login_regex": "^navbar_username$", "password_regex": "^navbar_password$"},'+
      '"www.coinbase.com": { "login_regex": "^email$", "password_regex": "^password$"},'+
      '"www.dropbox.com": { "login_regex": "^pyxl.*", "password_regex": "^pyxl.*"},'+
      '"www.fark.com": { "login_regex": "^loginName$", "password_regex": "^loginPass$"},'+
      '"www.pinterest.com": { "login_regex": "^userEmail$", "password_regex": "^userPassword$"},'+
      '"login.live.com": { "on_name":"true", "login_regex": "loginfmt", "password_regex": "passwd"},'+
      '"twitter.com": { "login_regex": "^signin-email$", "password_regex": "^signin-password$"},'+
      '"www.tumblr.com": { "login_regex": "^signup_email$", "password_regex": "^signup_password$"},'+
      '"login.yahoo.com": { "login_regex": "^login-username$", "password_regex": "^login-passwd$"},'+
      '"my.screenname.aol.com": { "on_name":"true", "login_regex": "^loginId$", "password_regex": "^password$"},'+
      '"www.bankofamerica.com": { "login_regex": "^onlineId1$", "password_regex": "^passcode1$"},'+
      '"www.netflix.com": { "login_regex": "^email$", "password_regex": "^password$"},'+
      '"accounts.craigslist.org": { "login_regex": "^inputEmailHandle$", "password_regex": "^inputPassword$"},'+
      '"www.pornhub.com": {"login_regex": "^username$", "password_regex": "^password$"}'+
      '}';
  var sites = JSON.parse(site_json_data);

  console.log("We are on " + host );
  
  if (host in sites) {
    var entry = sites[host];
    
    if( entry !== null || entry !== undefined )
    {
      console.log("Found entry for : " + host);
      
      // get fields from dom...
      var password_fields = getInputsByType(form, 'password');
      var email_fields    = getInputsByType(form, 'email');
      var text_fields     = getInputsByType(form, 'text');
      var all_input_fields  = text_fields.concat(email_fields);
      
      console.log("Potential Username fields");
      for(var j=0; j<all_input_fields.length; j++){
	console.log("    id: " + all_input_fields[j].id + " ( name :" + all_input_fields[j].name + ")" );
      }
      
      console.log("Potential Password fields");
      for(var j=0; j<password_fields.length; j++){
	console.log("    id: " + password_fields[j].id + " ( name :" + password_fields[j].name + ")" );
      }
      
      if( all_input_fields.length == 0 ||
	  password_fields.length == 0 ){
	return;
      }
      
      // find password fields
      var found_match = false;
      var matched_password_field = null;
      var password_regex = entry["password_regex"];
      
      var on_name = 0;
      if( entry["on_name"] == "true" )
      {
	console.log("Matching against name attribute");
	on_name = 1;
      }
      
      for(var i=0; i<password_fields.length; i++){
      	var field_name = password_fields[i].id;
      	
      	// support looking at the name vs id attributes
      	if( on_name )
      	{
      	  field_name = password_fields[i].name;
      	}
      	
      	console.log("checking " + field_name +  " against " + password_regex);
      	var field_regex = new RegExp(password_regex, "i");    
	var matches = field_regex.exec(field_name.toString());
	if(matches && matches.length > 0){
	  console.log("matched " + field_name);
	  matched_password_field = password_fields[i]; 
	  found_match = true;
	  break;
	}	
      }
      
      // if we didn't find a match for password - bail.
      if( !found_match ) return;
      
      // find username fields
      var matched_username_field  = null;
      var username_regex = entry["login_regex"];
      for(var i=0; i<all_input_fields.length; i++){
      	var field_name = all_input_fields[i].id;
      	
      	// support looking at the name vs id attributes
      	if( on_name )
      	{
      	  field_name = all_input_fields[i].name;
      	}
      	
      	console.log("checking " + field_name +  " against " + username_regex);
      	var field_regex = new RegExp(username_regex, "i");    
	var matches = field_regex.exec(field_name.toString());
	if(matches && matches.length > 0){
	  console.log("matched " + field_name);
	  matched_username_field = all_input_fields[i];
	  found_match = true;
	  break;
	}	
      }
      
      // if we didn't find a match for username - bail.
      if( !found_match ) return;
      
      console.log("Matched " + matched_username_field.id + " and " + matched_password_field.id);
      
      return {'username_field': matched_username_field, 'password_field': matched_password_field, 'possess_login_keyword':possess_login_keyword}
      
    }
    
  }

}

/*
 *
 * function findFormAuthFieldsGhetto(form)
 *
 * This method will walk a form and look for un/pw fields 
 * based on commonly known field names. This is a backup to our preferred 
 * findKnownFormFields(form) method. This is the original arkami bookmarklet logic.
 *
 */
function findFormAuthFieldsGhetto(form)
{
  var username_field;
  var password_field;
  var possess_login_keyword = false;
  var login_keywords_arr = ["login", "signin", "sign_in", "log_in", "username", "user"];
  var password_keywords_arr = ["password", "pass", "passwd"]; 
  
  var password_fields = getInputsByType(form, 'password');
  var email_fields    = getInputsByType(form, 'email');
  var text_fields     = getInputsByType(form, 'text');

  var password_field_count = password_fields.length;

  var username_field_count = function(){
    if(email_fields.length > 0){
      return email_fields.length;
    }

    return text_fields.length;
  }();
  
  console.log("Potential Username fields");
  for(var j=0; j<text_fields.length; j++){
    console.log("    " + text_fields[j].id);
  }
  
  console.log("Potential Password fields");
  for(var j=0; j<password_fields.length; j++){
    console.log("    " + password_fields[j].id);
  }
  
  if( text_fields.length == 0 ||
      password_fields.length == 0 ){
    return;
  }

  // trick to fix some sites. ugly as hell
  text_fields.reverse();

  if(text_fields.length > 1){
    var have_match = false;
    for(var j=0; j<text_fields.length; j++){
      //console.log("analyzing " + text_fields[j].id);      
      for(var k=0; k<login_keywords_arr.length; k++){
      	var field_name = text_fields[j].id;
      	var current_keyword = login_keywords_arr[k];
      	//console.log("checking " + field_name +  " against " + current_keyword);
      	var field_regex = new RegExp(current_keyword, "i");    
	var matches = field_regex.exec(field_name.toString());
	if(matches && matches.length > 0){
	  //console.log("matched " + field_name);
	  username_field = text_fields[j]; 
	  have_match=true;
	  break;
	}	
      }
      
      if( have_match )
      {
    	break;
      }
      
    }
  }else{
    username_field = text_fields[0];
  }

  if(email_fields.length > 0){
    username_field = email_fields[0];
  }
  
  password_fields.reverse();
  
  if(password_fields.length > 1){
    var have_match = false;
    for(var j=0; j<password_fields.length; j++){
      //console.log("analyzing pwfield " + password_fields[j].id);      
      for(var k=0; k<password_keywords_arr.length; k++){
      	var field_name = password_fields[j].id;
      	var current_keyword = password_keywords_arr[k];
      	//console.log("checking " + field_name +  " against " + current_keyword);
      	var field_regex = new RegExp(current_keyword, "i");    
	var matches = field_regex.exec(field_name.toString());
	if(matches && matches.length > 0){
	  //console.log("matched " + field_name);
	  password_field = password_fields[j]; 
	  have_match=true;
	  break;
	}	
      }
      
      if( have_match )
      {
    	break;
      }
      
    }
  }else{
    password_field = password_fields[0];
  }

  for(var j=0; j<login_keywords_arr.length; j++){
    var regex = new RegExp(login_keywords_arr[j]);

    var matches = regex.exec(form.className) ||
        regex.exec(form.name)      ||
        regex.exec(form.id)        ||
        regex.exec(form.action);

    if(matches && matches.length > 0){
      possess_login_keyword = true; break;
    } else {
      possess_login_keyword = false;
    }
  }

  console.log("matched - " + username_field.id + " - " + password_field.id );
  
  if(username_field_count >0 && password_field_count >0){
    return {'username_field': username_field, 'password_field': password_field, 'possess_login_keyword': possess_login_keyword}
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

  for(var i=0; i<s.length; i++){
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
