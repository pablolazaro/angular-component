'use strict';

angular.module('angular-component', ['ng'])

.factory('ResolverService', function ($http, $interpolate, $log, $q) {
    var DefinitionType,
        Definition,
        convertToType,
        resolveCondition,
        waitForParent,
        expressionResolver,
        httpResolver,
        Resolver,
        getResolver,
        validateDefinition,
        parseDefinition,
        validateArguments,
        resolveDefinitions,
        resolveDependency,
        resolveDependencies,
        isScope;


    /**
     * Check if an object is an AngularJS scope.
     * @param {Object}  obj     Object to check
     * @returns If is a scope
     */
    isScope = function (obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }

    /**
     * Returns a promise which will be resolved when dependency takes a value distinct of undefined.
     * Null value will be recognised like an error and will reject the promise.
     *
     * @param {String}  dependency  Name of the dependency in the scope to wait for be resolved
     * @param {Object}  scope       Scope which contains the dependency
     * @returns {Object}            A promise
     */
    resolveDependency = function (dependency, scope) {
        var deferred = $q.defer(),
            watcher;

        if (dependency && isScope(scope)) {
            if (scope[dependency] !== null) {
                if (scope[dependency] === undefined) {
                    watcher = scope.$watch(dependency, function (value) {
                        if (value !== undefined) {
                            if (value !== null) {
                                watcher();
                                deferred.resolve(scope[dependency]);
                            } else {
                                watcher();
                                deferred.reject(dependency + ' is null');
                            }
                        }
                    });
                } else {
                    deferred.resolve(scope[dependency]);
                }
            } else {
                deferred.reject(dependency + ' is null');
            }
        } else {
            throw new Error('Arguments are not valid, dependency object must be defined and scope an AngularJS scope');
        }

        return deferred.promise;
    }

    /**
     * Returns a global promise containing all promises listening to dependencies resolution,
     * when all dependencies are resolved, an array with all resolved values will be returned.
     *
     * @param dependencies Array which contains all dependencies
     * @param scope Scope which contains the dependency
     * @returns A global promise
     */
    resolveDependencies = function (dependencies, scope) {
        if (angular.isArray(dependencies) && isScope(scope)) {
            var promises = [];

            angular.forEach(dependencies, function (dependency) {
                promises.push(resolveDependency(dependency, scope));
            })

            return $q.all(promises);
        } else {
            throw new Error('Arguments are not valid, dependencies object must be an Array and scope an AngularJS scope');
        }
    };

    /**
     * Constants object.
     * @type {Object}
     */
    DefinitionType = {
        EXPRESSION: 'expression',
        HTTP: 'http'
    };

    /**
     * @constructor
     * @param {Object} definition Objeto de definición inicial
     * @returns {{}}
     */
    Definition = function (definition) {
        var object = {};

        object.name = definition.name;
        object.parent = definition.parent;
        object.typeof = definition.typeof;
        object.condition = definition.condition;

        if (definition.expression) {
            object.type = DefinitionType.EXPRESSION;
            object.expression = definition.expression;
        } else if (definition.http) {
            object.type = DefinitionType.HTTP;
            object.http = definition.http;
        }

        return object;
    };

    /**
     * Convierte el valor en el tipo especificado.
     *
     * @param   {*}       value     Valor que se desea convertir
     * @param   {String}  type      Tipo al que el valor será convertido
     * @returns {*}                 El valor convertido en el tipo especificado
     */
    convertToType = function (value, type) {
        try {
            var convertedValue;

            switch (type.toLowerCase()) {
                case 'string':
                    convertedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
                    break;
                case 'number':
                    convertedValue = typeof value === 'object' ? Number.NaN : Number(value);
                    break;
                case 'boolean':
                    switch (typeof value) {
                        case 'boolean':
                            convertedValue = Boolean(value);
                            break;
                        case 'string':
                            convertedValue = value === 'true';
                            break;
                        case 'number':
                            convertedValue = value === 1;
                            break;
                        default:
                            convertedValue = false;
                            break;
                    }
                    break;
                default:
                    convertedValue = value;
                    break;
            }

            return convertedValue;
        } catch (error) {
            throw new Error('Error al convertir el valor ' + value + ' al tipo ' + type + '.\n' + error.message);
        }
    };

    resolveCondition = function (condition, scope) {
        var interpolatedCondition = $interpolate(condition)(scope);
        return convertToType(interpolatedCondition, 'boolean');
    };


    waitForParent = function (definition, scope, resolve, deferred) {
        $log.debug('Se pospone la resolución de la definición <<' + definition.name + '>> porque tiene una dependencia con <<' + definition.parent + '>> y esta aún no está resuelta');

        scope.$on(definition.parent , function (event, value) {
            if (value === null) {
                $log.debug('No se ha resuelto la definición <<' + definition.name + '>> ya que su padre <<' + definition.parent + '>> tampoco se ha resuelto');
                deferred.resolve(null);
            } else {
                $log.debug('Definición <<' + definition.parent + '>> resuelta. Se procede a resolver la definición <<' + definition.name + '>>');

                if ((!definition.condition) || (definition.condition && resolveCondition(definition.condition, scope))) {
                    resolve(definition, scope, deferred);
                } else {
                    $log.debug('No se ha resuelto la definición <<' + definition.name + '>> ya que su condicion no se cumple');
                    deferred.resolve(null);
                }
            }
        });
    };

    expressionResolver = function (definition, scope, deferred) {
        try {
            var expressionResolved = $interpolate(definition.expression)(scope);

            deferred.resolve(expressionResolved);
        } catch (error) {
            deferred.reject('Error al resolver la expresión de la definición <<' + definition.name + '>>.\n' + error.message);
        }
    };

    httpResolver = function (definition, scope, deferred) {
        try {
            var httpRequest = definition.http,
                httpResolved,
                interpolatedUrl;

            interpolatedUrl = $interpolate(httpRequest.url)(scope);

            $http.get(interpolatedUrl, httpRequest.config || {}).then(function (response) {
                httpResolved = httpRequest.responseName ? response.data[httpRequest.responseName] : response.data[definition.name];

                deferred.resolve(httpResolved);
            }, function (data, status) {
                deferred.reject('Error en la petición para <<' + definition.name + '>>. El servidor ha devuelto un status ' + status);
            });
        } catch (error) {
            deferred.reject('Error al resolver la expresión de la definición <<' + definition.name + '>>.\n' + error.message);
        }
    };

    /**
     *
     * @param specificResolver
     * @constructor
     */
    Resolver = function (specificResolver) {
        this.resolveByType = specificResolver;
    };

    /**
     *
     * @param definition
     * @param scope
     * @returns {*}
     */
    Resolver.prototype.resolve = function (definition, scope) {
        var deferred = $q.defer(),
            resolverDeferred = $q.defer();

        if (definition.parent && angular.isUndefined(scope[definition.parent])) {
            waitForParent(definition, scope, this.resolveByType, resolverDeferred);
        } else {
            if ((!definition.condition) || (definition.condition && resolveCondition(definition.condition, scope))) {
                this.resolveByType(definition, scope, resolverDeferred);
            } else {
                $log.debug('No se ha resuelto la definición <<' + definition.name + '>> ya que su condicion no se cumple');
                resolverDeferred.resolve(null);
            }
        }

        resolverDeferred.promise.then(function (object) {
            if (object !== null) {
                if (definition.typeof) {
                    object = convertToType(object, definition.typeof);
                }

                scope[definition.name] = object;

                $log.debug('Se ha resuelto la definición <<' + definition.name + '>> con valor: ' + JSON.stringify(object));

                scope.$broadcast(definition.name, object);

                deferred.resolve(object);
            } else {
                scope.$broadcast(definition.name, null);
                deferred.resolve(null);
            }
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };


    /**
     * Devuelve el resolutor de una definición en función del tipo de esta.
     *
     * @param   {String}    type    Tipo de la definición a resolver
     * @returns {Function}          Función que resolverá la definición
     */
    getResolver = function (type) {
        var resolver;

        switch (type) {
            case DefinitionType.EXPRESSION:
                resolver = new Resolver(expressionResolver);
                break;
            case DefinitionType.HTTP:
                resolver = new Resolver(httpResolver);
                break;
            default:
                throw new Error('El tipo de definición <<' + type + '>> no está actualmente soportado.');
        }

        return resolver;
    };

    /**
     * Valida un objeto de definición.
     *
     * @param {Object}      definition  Objeto de definición a validar
     */
    validateDefinition = function (definition) {
        var validationError;

        if (angular.isObject(definition)) {
            if (definition.name) {
                if ((definition.expression || definition.http)) {
                    if ((definition.expression && definition.http)) {
                        validationError = 'El objeto de definición <<' + definition.name + '>> tiene tanto el atributo <<expression>> como el atributo <<http>> definidos.';
                    } else {
                        if (definition.parent && definition.parent === definition.name) {
                            validationError = 'El objeto de definición <<' + definition.name + '>> tiene una dependencia consigo mismo.';
                        }
                    }
                } else {
                    validationError = 'El objeto de definición <<' + definition.name + '>> no tiene ni el atributo <<expression>> ni el atributo <<http>> definido.';
                }
            } else {
                validationError = 'El objeto de definición no tiene el atributo <<name>> declarado. \nEs necesario declarar este atributo para poder asignarle el valor resuelto al scope del componente.';
            }
        } else {
            validationError = 'El objeto de definición no es un objeto válido.';
        }

        if (validationError) {
            throw new Error(validationError);
        }
    };

    /**
     * Analiza una definición y devuelve un promise con el resultado de la misma.
     *
     * @param   {Object}    definition  Definición que se desea resolver
     * @param   {Object}    scope       Scope asociado a la definición
     * @return  {Object}                Objeto promise con el resultado de la definición
     */
    parseDefinition = function (definition, scope) {
        var parsedDefinition, definitionPromise;

        validateDefinition(definition);

        parsedDefinition = new Definition(definition);
        definitionPromise = getResolver(parsedDefinition.type).resolve(parsedDefinition, scope);

        return definitionPromise;
    };


    validateArguments = function (definitions, scope) {
        var error;

        if (angular.isArray(definitions)) {
            if (angular.isUndefined(scope)) {
                error = 'El scope no está definido.';
            }
        } else {
            error = 'El objeto de definiciones no es un array.';
        }

        if (error) {
            throw new Error(error);
        }
    };

    resolveDefinitions = function (definitions, scope) {
        var promises = [];

        validateArguments(definitions, scope);

        angular.forEach(definitions, function (definition) {
            var definitionPromise = parseDefinition(definition, scope);
            promises.push(definitionPromise);
        });

        return $q.all(promises);
    };

    return {
        convertToType: convertToType,
        expressionResolver: expressionResolver,
        getResolver: getResolver,
        httpResolver: httpResolver,
        parseDefinition: parseDefinition,
        resolveCondition: resolveCondition,
        resolveDefinitions: resolveDefinitions,
        validateArguments: validateArguments,
        validateDefinition: validateDefinition,
        waitForParent: waitForParent,
        resolveDependencies: resolveDependencies,
        resolveDependency: resolveDependency
    };

})

.directive('component', function ($log, ResolverService) {

    return {
        restrict: 'E',
        replace: true,
        scope: true,
        controller: function ($scope) {
            $scope.definitionsResolved = false;

            this.resolveDefinitions = function (definitions) {
                var globalPromise = ResolverService.resolveDefinitions(definitions, $scope);

                globalPromise.then(function (resolvedPromises) {
                    $scope.definitionsResolved = true;
                }, function (error) {
                    $log.error('No se ha podido resolver alguna de las definiciones.\n' + error.message);
                });
            };
        },
        compile: function (element, attrs) {
            var stringDefinition = attrs.definition,
                jsonDefinition;

            return function postLink (scope, iElement, iAttrs, controller) {
                if (stringDefinition) {
                    $log.debug('Se ha encontrado una directiva <<component>> con la siguiente lista de definiciones:');
                    $log.debug(stringDefinition);

                    try {
                        jsonDefinition = JSON.parse(stringDefinition);
                    } catch (error) {
                        throw new Error('Error al transformar el objeto de definición.\n' + error.message);
                    }

                    controller.resolveDefinitions(jsonDefinition);
                }
            };
        }
    };

});
