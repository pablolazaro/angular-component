angular.module('angular-component', ['ng']).controller('ComponentController', ['$scope', '$log', 'ResolverService', function ($scope, $log, ResolverService) {
    $scope.definitionsResolved = false;

    this.resolveDefinitions = function (definitions) {
        var start = new Date().getTime(),
            end;

        ResolverService.resolveDefinitions(definitions, $scope).then(function (resolvedPromises) {
            $scope.definitionsResolved = true;

            end = new Date().getTime();

            $log.debug('Definitions resolved in ' + (end - start) + 'ms');
        }, function (error) {
            $log.error('No se ha podido resolver alguna de las definiciones.\n' + error.message);
        });
    };
}]);
