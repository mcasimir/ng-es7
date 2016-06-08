export default function run(...providers) {
  return (target, methodName) => {
    target._ngEs7Runs = target._ngEs7Runs || [];
    let fn = target[methodName].bind(target);
    target._ngEs7Runs.push(providers.concat(fn));
    return target;
  };
}
