app.controller('cookiesCtrl', function ($scope, $rootScope, $http, accept_cookies_service, cookiesService) {
    $scope.close = function () {
        $rootScope.accept_cookies = false;
    };

    var user = accept_cookies_service.GetCredentials();
    if (user) { //si existe la cookie
        console.log(user);
        $rootScope.accept_cookies = false;

    }else{ //si no existe la cookie
        $rootScope.accept_cookies = true;

        var usuario = null;
        accept_cookies_service.obtain_info_guest().then(function (response) {
            if (response.success) {
                usuario = response.data;
                
                var browser = '';
                accept_cookies_service.obtain_browser_guest().then(function (response) {
                    browser = response.data;
                
                    user =  {usuario: usuario, browser: browser};
                    accept_cookies_service.SetCredentials(user); //guardar cookie i localstorage
                });
            } else {
                //console.log(response.data);
            }
        });
    }
});
