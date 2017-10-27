app.factory("CommonService", ['$rootScope','$timeout', function ($rootScope, $timeout) {
        var service = {};
        service.banner = banner;
        service.amigable = amigable;
        return service;

        function banner(message, type) {
            $rootScope.bannerText = message;
            $rootScope.bannerClass = 'alertbanner aletbanner' + type;
            $rootScope.bannerV = true;

            $timeout(function () {
                $rootScope.bannerV = false;
                $rootScope.bannerText = "";
            }, 5000);
        }
        
        function amigable(url) {
            var link = "";
            url = url.replace("?", "");
            url = url.split("&");

            for (var i = 0; i < url.length; i++) {
                var aux = url[i].split("=");
                link += aux[1] + "/";
            }
            return link;
        }
    }]);
