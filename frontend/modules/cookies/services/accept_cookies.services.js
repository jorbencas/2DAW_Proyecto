app.factory("accept_cookies_service", ['$http','$q', '$cookies', 'localstorage_accept_cookies_Service',
function ($http, $q, $cookies, localstorage_accept_cookies_Service) { 
        var service = {};
        service.obtain_info_guest = obtain_info_guest;
        service.obtain_browser_guest = obtain_browser_guest;
        
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.GetCredentials = GetCredentials;
        return service;
        
        function obtain_info_guest() {
            var deferred = $q.defer();
            $http({
                  method: 'GET',
                  url: '//freegeoip.net/json/'
                  //url: 'https://api.ipify.org/' Obtiene solamente la IP
              }).success(function(data, status, headers, config) {
                 deferred.resolve({ success: true, data: data });
              }).error(function(data, status, headers, config) {
                 deferred.resolve({ success: false, data: data });
              });
            return deferred.promise;
            /*
            ip: "85.55.99.70"
            city:"Valencia"
            country_code:"ES"
            country_name:"Spain"
            ip:"85.55.99.70"
            latitude:39.4698
            longitude:-0.3774
            metro_code:0
            region_code:"VC"
            region_name:"Valencia"
            time_zone:"Europe/Madrid"
            zip_code:"46001"
            */
            
        }
        
        function obtain_browser_guest() {
            var deferred = $q.defer();
            var nav = navigator.userAgent.toLowerCase();
            if(nav.indexOf("msie") != -1){
                deferred.resolve({ data: "IE" });
            } else if(nav.indexOf("firefox") != -1){
                deferred.resolve({ data: "Firefox" });
            } else if(nav.indexOf("opera") != -1){
                deferred.resolve({ data: "Opera" });
            } else if(nav.indexOf("chrome") != -1){
                deferred.resolve({ data: "Chrome" });
            } else {
                deferred.resolve({ data: "Other" });
            }
            return deferred.promise;
        }
        
        function SetCredentials(user) {
            $cookies.putObject("accept_cookies", 
            {usuario: user.usuario, browser: user.browser}, 
            {expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)});
            
            //almacenarlos en localstorage
            localstorage_accept_cookies_Service.Create(user).then(function (response) {
                //console.log(response.success);
                if (response.success) {
                    console.log(response.message);
                } else {
                    console.log(response.message);
                }
            });
        }

        function ClearCredentials() {
            $cookies.remove("accept_cookies");
        }
        
        function GetCredentials() {
            var user = $cookies.getObject("accept_cookies");
            if (user) { //si no es undefined
                return user;
            }else{
                return null;
            }
        }
}]);
