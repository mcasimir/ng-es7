/**
 * Inject decorator
 *
 * @param {object} options = {}
 * @return {function} - a component decorator
 */
export default function inject(...services) {
  return (target, propName, descriptor) => {

    // properties
    if (target.name && descriptor) {
      target._ngEs7StaticInjectables = target._ngEs7StaticInjectables || [];
      target._ngEs7StaticInjectables.push({
        internalName: propName,
        externalName: services[0] || propName
      });

      return descriptor;
    }

    // classes and methods
    target.$inject = services;
    return target;
  };
}
