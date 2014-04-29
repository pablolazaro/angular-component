angular.module('angular-component').directive('component', function ($log, ResolverService) {

    return {
        restrict: 'E',
        replace: true,
        scope: true,
        controller: 'ComponentController',
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
