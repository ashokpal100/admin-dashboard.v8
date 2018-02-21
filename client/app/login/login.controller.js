(function () {
    'use strict';

    angular.module('app')
        .controller('LoginController', ['$rootScope','$scope', 'LoginService','$mdToast','$state', LoginController])

    function LoginController($rootScope, $scope, LoginService, $mdToast, $state) {

        $scope.doLogin = function(){
            // Send a toast saying Verifying Credentials
            $mdToast.show(
                $mdToast.simple()
                .content('Verifying Credentials!')
                .position('top right')
                .hideDelay(2000)
            );
            LoginService.login($scope.data).then(function(data){
                console.log(data)
                if(data.data.token){
                    // Verified Successully
                    showMessage('Verified Admin Role Successully!')
                    $rootScope.user = data.data.user
                    
                    // Storing relevant information in Cookies
                    showMessage('Storing relevant information locally!')
                    var success = LoginService.saveTokenToLocalStorage(data.data.token)
                    if(success){
                        $state.go('dashboard')
                    }
                }else if(data.data.message){
                    showMessage(data.data.message)
                    resetForm()
                }else{
                    showMessage("Error Retry")
                    resetForm()
                }
            },function(err){
                showMessage("Error Retry")
                resetForm()
            })
        }

        function resetForm(){
            // Reset the form
            $scope.data = {};
            $scope.loginForm.$setPristine(true);
        }
        function showMessage(message){
            $mdToast.show(
                $mdToast.simple()
                .content(message)
                .position('top right')
                .hideDelay(1000)
            );
        }
    }

})(); 
