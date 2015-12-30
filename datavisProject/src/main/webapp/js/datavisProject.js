var app = angular.module('datavisProject', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', '$controllerProvider', function ($routeProvider, $controllerProvider) {

        app.registerCtrl = $controllerProvider.register;

        function requireCtrl(name) {
            return ['$q', '$rootScope', function ($q, $rootScope) {
                    if (name.indexOf(',') !== -1) {
                        name = name.split(',');
                    } else {
                        name = [name];
                    }
                    
                    var deferred = $q.defer();
                    var done = 0;
                    
                    for(i=0; i< name.length;i++){
                        $.getScript('controller/' + name[i] + '.js').success(function () {
                            $rootScope.$apply(function () {
                                done++;
                                if(done === i){
                                    deferred.resolve();
                                }
                            });
                        });
                    }
                    
                    return deferred.promise;
                }];
        }

        $routeProvider.when('/', {
            templateUrl: 'view/example.html',
            resolve: requireCtrl('ExampleController,behaviour,polygon,point,line')
        })
                .when('/example', {
                    templateUrl: 'view/example.html',
                    resolve: requireCtrl('ExampleController')
                })
                .otherwise({
                    redirectTo: "/"
                });
    }]);

app.directive('dropdownMultiselect', function () {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            pre_selected: '=preSelected',
            defaulttext: '=defaulttext',
            showmax: '=showmax',
            ngid: '=ngid'
        },
        template: "<div class='multiselect-group' data-ng-class='{open: open}'>" +
                "<button class='dropdown-toggle form-control multiselect-control' data-ng-click='open=!open;openDropdown()'><span class='pull-left'>{{selectText}}</span> <span class='caret'></span></button>" +
                "<ul tabindex='0' class='dropdown-menu' id='{{ngid}}' ng-blur='open=!open;' style='width:100%;' aria-labelledby='dropdownMenu'>" +
                "<li><a data-ng-click='selectAll()'><i class='icon-ok-sign'></i>  Check All</a></li>" +
                "<li><a data-ng-click='deselectAll();'><i class='icon-remove-sign'></i>  Uncheck All</a></li>" +
                "<li class='divider'></li>" +
                "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.name}}<span data-ng-class='isChecked(option.id)'></span></a></li>" +
                "</ul>" +
                "</div>",
        controller: function ($scope, $timeout, $window) {
            $scope.selectText = $scope.defaulttext;
            $scope.openDropdown = function () {
                $scope.selected_items = [];
                for (var i = 0; i < $scope.pre_selected.length; i++) {
                    $scope.selected_items.push($scope.pre_selected[i].id);
                }
                $timeout(function () {
                    $window.document.getElementById($scope.ngid).focus();

                });
            };

            $scope.selectAll = function () {
                $scope.model = _.pluck($scope.options, 'id');
                $scope.setSelected();
                //console.log($scope.model);
            };
            $scope.deselectAll = function () {
                $scope.model = [];
                $scope.setSelected();
                //console.log($scope.model);
            };
            $scope.setSelectedItem = function () {
                var id = this.option.id;
                if (_.contains($scope.model, id)) {
                    $scope.model = _.without($scope.model, id);
                } else {
                    $scope.model.push(id);
                }
                $scope.setSelected();
                //console.log($scope.model);
                return false;
            };
            $scope.isChecked = function (id) {
                if (_.contains($scope.model, id)) {
                    return 'icon-ok pull-right';
                }
                return false;
            };

            $scope.setSelected = function () {
                text = "";
                maxitems = $scope.showmax;
                $scope.model.forEach(function (item) {
                    if (maxitems > 0) {
                        if (text.length === 0) {
                            text += item;
                            maxitems--;
                        } else {
                            text += ',' + item;
                            maxitems--;
                        }
                    } else {
                        maxitems--;
                    }
                });
                if (maxitems < 0) {
                    text = "";
                }
                if (text.length > 0) {
                    $scope.selectText = text;
                } else {
                    if ($scope.model.length === 0) {
                        $scope.selectText = $scope.defaulttext;
                    } else {
                        $scope.selectText = $scope.model.length + " items selected";
                    }
                }
            };
        }
    };
});