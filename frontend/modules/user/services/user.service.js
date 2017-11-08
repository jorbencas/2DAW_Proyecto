app.factory("UserService", ['$location', '$rootScope', 'services', 'facebookService', 'cookiesService', 'twitterService',
function ($location, $rootScope, services, facebookService, cookiesService, twitterService) {
        var service = {};
        service.login = login;
        service.logout = logout;
        return service;

        function login() {
            //al cargarse la pagina por primera vez, user es undefined
            var user = cookiesService.GetCredentials();
            if (user) {
                $rootScope.accederV = false;
                $rootScope.profileV = true;
                $rootScope.logoutV = true;

                $rootScope.avatar = user.avatar;
                $rootScope.nombre = user.nombre;

                if (user.tipo === "worker") {
                    $rootScope.adminV = false;
                    $rootScope.misofertasV = true;
                } else if (user.tipo === "admin") {
                    $rootScope.adminV = true;
                    $rootScope.misofertasV = false;
                } else {
                    $rootScope.adminV = false;
                    $rootScope.misofertasV = false;
                }
            } else {
                $rootScope.accederV = true;
            }
        }

        function logout() {
            facebookService.logout();
            twitterService.clearCache();
            cookiesService.ClearCredentials();

            $rootScope.accederV = true;
            $rootScope.profileV = false;

            $rootScope.avatar = '';
            $rootScope.nombre = '';

            $rootScope.adminV = false;
            $rootScope.misofertasV = false;

            $rootScope.logoutV = false;
            $location.path("/");
        }
}]);
