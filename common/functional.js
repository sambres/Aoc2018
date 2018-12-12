exports.pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
exports.compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);
const composeM = chainMethod => (...ms) =>
  ms.reduce((f, g) => x => {
    const y = g(x);
    return y[chainMethod] ? y[chainMethod](f) : f(y);
  });
exports.composeP = composeM('then');
exports.composeM = composeM;

const pipeM = chainMethod => (...ms) =>
  ms.reduceRight((f, g) => x => {
    const y = g(x);
    return y[chainMethod] ? y[chainMethod](f) : f(y);
  });
exports.pipeP = pipeM('then');
exports.pipeM = pipeM;
