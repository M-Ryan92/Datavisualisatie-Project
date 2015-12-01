var app = angular.module('datavisProject', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', '$controllerProvider', function ($routeProvider, $controllerProvider) {

        app.registerCtrl = $controllerProvider.register;

        function requireCtrl(name) {
            return ['$q', '$rootScope', function ($q, $rootScope) {
                    var deferred = $q.defer();
                    $.getScript('controller/' + name + '.js').success(function () {
                        $rootScope.$apply(function () {
                            deferred.resolve();
                        });
                    });
                    return deferred.promise;
                }];
        }

        $routeProvider.when('/', {
            templateUrl: 'view/app.html'
        })
                .when('/example', {
                    templateUrl: 'view/example.html',
                    resolve: requireCtrl('ExampleController')
                })
                .otherwise({
                    redirectTo: "/"
                });
    }]);