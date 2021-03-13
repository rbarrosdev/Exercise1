// Standard compose
function composeAll(...fns) {
  return x => fns.reduce((res, f) => f(res), x);
}

function compose(...fns) {
  return x => {
    let res = Promise.resolve(x);
    fns.forEach(f => {
      res = res.then(f);
    });
    return res;
  };
}

module.exports = {
  composeAll,
  compose
};
