(function(){
    'use strict';

    var app = angular.module('app');
    app.factory('LoginService',['$http','$window','$cookies','localStorageService',function($http,$window,$cookies,localStorageService){
    
        var base_url = $window.apiAccessLayer.url

        var factory = {};
        factory.login = function(data){
            console.log(data)
            console.log(base_url + '/admin/login')
            return $http.post(base_url + '/admin/login', data);
        }
        factory.saveTokenToLocalStorage = function(token){
          return localStorageService.set('token',token);
        };
        factory.deleteTokenFromLocalStorage = function(){
          return localStorageService.remove('token');
        };

        factory.getTokenFromLocalStorage = function(){
          return localStorageService.get('token');
        };

        return factory;
    }]);




})();