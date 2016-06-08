import angular from 'angular';
import {camelCase, kebabCase, pick, isString} from 'lodash';

const COMPONENT_PROPERTIES = [
  'bindings',
  'transclude',
  'controllerAs',
  'require',
  'template',
  'templateUrl'
];

/**
 * Component decorator
 *
 * @example
 *
 * ``` js
 * \@Component()
 * class AppNavbar {
 *   \@binding('@') heading;
 *
 *   static template = `<div class="navbar">{{$ctrl.heading}}</div>`
 * }
 * ```
 *
 * ``` html
 * <app-navbar heading="My App"></app-navbar>
 * ```
 *
 * @param {object} options = {}
 * @return {function} - a component decorator
 */
export default function Component(options = {}) {
  return function(target) {
    let targetName = target.name || '';

    if (!targetName) {
      throw new Error('Unable to guess name for target');
    }

    let defaults = {
      moduleName: targetName,
      selector: kebabCase(targetName),
      dependencies: []
    };

    options = Object.assign(
      defaults,
      pick(target, COMPONENT_PROPERTIES),
      options
    );

    let dependencies = options.dependencies.map(dependency => {
      return isString(dependency) ? dependency : dependency.name;
    });

    let ngModule = angular.module(options.moduleName, dependencies);

    let componentOptions = Object.assign(
      pick(options, COMPONENT_PROPERTIES),
      {
        controller: target
      }
    );

    let componentName = camelCase(options.selector);

    ngModule.component(componentName, componentOptions);

    let configs = target._ngEs7Configs || [];

    configs.forEach(config => {
      ngModule.config(config);
    });

    let runs = target._ngEs7Runs || [];

    runs.forEach(run => {
      ngModule.run(run);
    });

    ngModule.bootstrap = function(element) {
      angular.element(document).ready(function() {
        element = element || document.body;
        angular.bootstrap(element, [ngModule.name]);
      });
    };

    return ngModule;
  };
}
