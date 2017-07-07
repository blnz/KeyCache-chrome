// Injector file for webpack hot loading 'content.bundle.js'
const context = this;

// http://stackoverflow.com/questions/8403108/calling-eval-in-particular-context/25859853#25859853
function evalInContext(js, lContext) {
  return function() { return eval(js); }.call(lContext);
}

function reqListener() {
  evalInContext(this.responseText, context);
}

const request = new XMLHttpRequest();
request.onload = reqListener;
request.open('get', 'https://localhost:3000/js/content.bundle.js', true);
request.send();
