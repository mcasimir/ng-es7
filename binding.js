export default function binding(kind = '@') {
  return (target, propName, descriptor) => {
    target.constructor.bindings = target.constructor.bindings || {};
    target.constructor.bindings[propName] = kind;
    descriptor.writable = true;
    return descriptor;
  };
}
