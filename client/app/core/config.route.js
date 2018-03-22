(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider','$locationProvider',
                function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider,$locationProvider) {
                $locationProvider.html5Mode({enabled: true});
                
                $urlRouterProvider
                    .when('/', '/dashboard')
                    .otherwise('/dashboard');
                    
                $stateProvider
                    .state('login',{
                        url: '/login',
                        templateUrl: 'app/login/login.html',
                        controller: 'LoginController'
                    })
                    .state('dashboard', {
                        url: '/dashboard',
                        templateUrl: 'app/dashboard/dashboard.html',
                        
                        resolve: {
                            protected_route: ['$rootScope','LoginService','$state',function($rootScope,LoginService,$state){
                                if(!LoginService.getTokenFromLocalStorage()){
                                    $state.go('login')
                                }
                            }],
                            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                                try{ 
                                    if(!!angular.module('ngMap')){}
                                }catch(e){
                                    return $ocLazyLoad.load([
                                    'googlemap'
                                    ]);    
                                }
                            }]
                        }
                    });
                
            }
        ]);

})(); 