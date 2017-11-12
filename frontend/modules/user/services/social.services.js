app.factory('twitterService', function ($q) {
    var authorizationResult = false;
    return {
        initialize: function () {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('FJ8BCOtGotnr4EvaQBXJuzwfFR0', {cache: true});
            //try to create an authorization result when the page loads, this means a returning user won't have to click the twitter button again
            authorizationResult = OAuth.create('twitter');
        },
        isReady: function () {
            return (authorizationResult);
        },
        connectTwitter: function () {
            var deferred = $q.defer();
            OAuth.popup('twitter', {cache: true}, function (error, result) { //cache means to execute the callback if the tokens are already present
                if (!error) {
                    authorizationResult = result;
                    deferred.resolve();
                } else {
                    console.log(result);
                }
            });
            return deferred.promise;
        },
        clearCache: function () {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },
        getLatestTweets: function () {
            var deferred = $q.defer();
            var promise = authorizationResult.get('/1.1/statuses/home_timeline.json').done(function (data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                //when the data is retrieved resolved the deferred object
                deferred.resolve(data)
            });
            return deferred.promise;
        },
        getUserInfo: function () {
            var deferred = $q.defer();
            var promise = authorizationResult.get('1.1/account/verify_credentials.json?include_email=true').done(function (data) { //https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
                deferred.resolve(data);
            });
            //console.log(deferred.promise);
            return deferred.promise;
        }
    }
});

app.factory('facebookService', function (Facebook, $q) {
    var service = {};
    service.login = login;
    service.logout = logout;
    service.me = me;
    return service;

    function login() {
        var deferred = $q.defer();
        var loginOptions = { scope: 'email' };
        
        Facebook.getLoginStatus(function (response) {
            var promise;
            if (response.status == 'connected')
                promise = deferred.resolve(true);
            else {
                promise = Facebook.login(function (response) {
                    deferred.resolve(true);
                },loginOptions); ///////////////////////////////////////////////////////////////
            }
        });
        return deferred.promise;
    };

    function me() {
        var deferred = $q.defer();
        var promise = Facebook.api('/me', {fields: 'first_name,last_name,email,id'}, function (response) { ///////////////////
            deferred.resolve(response);
        });
        return deferred.promise;
    };

    function logout() {
        Facebook.getLoginStatus(function (response) {
            if (response.status == 'connected') {
                Facebook.logout();
            }
        });
    };
});
