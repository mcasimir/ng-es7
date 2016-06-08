import angular from 'angular';
import {isString} from 'lodash';

export default function Service(options = {}) {
  return function(target) {
    let targetName = target.name || '';

    if (!targetName) {
      throw new Error('Unable to guess name for target');
    }

    let defaults = {
      moduleName: targetName,
      serviceName: targetName,
      dependencies: []
    };

    options = Object.assign(defaults, options);

    let dependencies = options.dependencies.map(dependency => {
      return isString(dependency) ? dependency : dependency.name;
    });

    let ngModule = angular.module(options.moduleName, dependencies);

    let requiredProviders = [];
    let cls = target;

    while (Object.getPrototypeOf(cls).name) {
      requiredProviders = requiredProviders.concat(
        cls._ngEs7StaticInjectables || []
      );

      cls = Object.getPrototypeOf(cls);
    }

    let externalRequiredProviderNames = requiredProviders.map(injectable => {
      return injectable.externalName;
    });

    let internalRequiredProviderNames = requiredProviders.map(injectable => {
      return injectable.internalName;
    });

    ngModule.provider(options.serviceName, {
      $get: externalRequiredProviderNames.concat((...injected) => {
        for (let i of injected.keys()) {
          target[internalRequiredProviderNames[i]] = injected[i];
        }
        return target;
      })
    });

    let configs = target._ngEs7Configs || [];

    configs.forEach(config => {
      ngModule.config(config);
    });

    let runs = target._ngEs7Runs || [];

    runs.forEach(run => {
      ngModule.run(run);
    });

    return ngModule;
  };
}
