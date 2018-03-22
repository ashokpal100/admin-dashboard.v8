(function () {
    'use strict';

    angular.module('app')
        .controller('AppCtrl', [ '$scope', '$rootScope', '$state', '$document', 'appConfig','LoginService', '$mdDialog',AppCtrl]); // overall control
        
    function AppCtrl($scope, $rootScope, $state, $document, appConfig, LoginService,$mdDialog) {

        $scope.pageTransitionOpts = appConfig.pageTransitionOpts;
        $scope.main = appConfig.main;
        $scope.color = appConfig.color;

        $scope.$watch('main', function(newVal, oldVal) {
            // if (newVal.menu !== oldVal.menu || newVal.layout !== oldVal.layout) {
            //     $rootScope.$broadcast('layout:changed');
            // }

            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
                $rootScope.$broadcast('nav:reset');
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
                if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                    $scope.main.fixedHeader = true;
                    $scope.main.fixedSidebar = true;
                }
                if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                    $scope.main.fixedHeader = false;
                    $scope.main.fixedSidebar = false;
                }
            }
            if (newVal.fixedSidebar === true) {
                $scope.main.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
                $scope.main.fixedSidebar = false;
            }
        }, true);

        // $rootScope.logout = function(){
        //     $rootScope.user = null;
        //     LoginService.deleteTokenFromLocalStorage()
        //     $state.go('login')
        // }
        $rootScope.logout = function(){
            var confirm = $mdDialog.confirm()
                  .title('are you sure you want to logout?')
                  .ok('ok')
                  .cancel('cancel');
        
            $mdDialog.show(confirm).then(function() {
              $scope.status = 'ok';
              LoginService.deleteTokenFromLocalStorage();
              $state.go('login');
            }, function() {
              $scope.status = 'cancel';
            });
        };

        $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
            $document.scrollTo(0, 0);
        });

        $scope.performSearch = function(searchString){
            console.log("Performing Search....")
            console.log(searchString)
            $state.go('search', {
                string: searchString 
            })
        }
    }


})(); 