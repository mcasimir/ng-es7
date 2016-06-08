export default function config(...providers) {
  return (target, methodName) => {
    target._ngEs7Configs = target._ngEs7Configs || [];
    let fn = target[methodName].bind(target);
    target._ngEs7Configs.push(providers.concat(fn));
    return target;
  };
}
