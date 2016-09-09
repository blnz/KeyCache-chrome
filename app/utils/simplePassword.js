// the simplest random password generator, ever

const randomString = (count) => {
  const capitals = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowers = "abcdefghijkmnopqrstuvwxyz"; // skip "l" to avoid confusion w "1"
  const numbers = "0123456789";
  const specials = "~!?#%^&*()";

  const allChars = capitals + lowers + numbers + specials

  const randoms = new Uint32Array(count)
  window.crypto.getRandomValues(randoms)
 
  var chstring = ""
  for (var i = 0; i < randoms.length; ++i) {
    //    const ix = randoms[i] % allChars.length
    // const myChar = allChars[ix]
    chstring += allChars[randoms[i] % allChars.length]
  }
  return chstring
}

export default randomString;
