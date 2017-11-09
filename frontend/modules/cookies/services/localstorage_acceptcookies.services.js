app.factory("localstorage_accept_cookies_Service", ['$timeout', '$filter', '$q', function ($timeout, $filter, $q) { 
        var service = {};
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        return service;

        function GetAll() {
            var deferred = $q.defer();
            deferred.resolve({ success: true, message: 'GetAll success', data: getUsers() });
            return deferred.promise;
        }

        function GetById(id) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { id: id });
            var user = filtered.length ? filtered[0] : null;
            if(user === null){
                deferred.resolve({ success: false, message: 'GetById error', data: null });
            }else{
                deferred.resolve({ success: true, message: 'GetById success', data: user });
            }
            return deferred.promise;
        }

        function GetByUsername(usuario) {
            var deferred = $q.defer();
            var filtered = $filter('filter')(getUsers(), { usuario: usuario });
            var user = filtered.length ? filtered[0] : null;
            if(user === null){
                deferred.resolve({ success: false, message: 'GetByUsername error', data: null });
            }else{
                deferred.resolve({ success: true, message: 'GetByUsername success', data: user });
            }
            return deferred.promise;
        }

        function Create(user) {
            var deferred = $q.defer();
            $timeout(function () {
                GetByUsername(user.usuario)
                    .then(function () {
                        var users = getUsers();
                        // assign id
                        var lastUser = users[users.length - 1] || { id: 0 };
                        user.id = lastUser.id + 1;

                        // save to local storage
                        users.push(user);
                        setUsers(users);
                        deferred.resolve({ success: true, message: 'User created success' });
                    });
            }, 1000);
            return deferred.promise;
        }

        function Update(user) {
            var deferred = $q.defer();
            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users[i] = user;
                    break;
                }
            }
            setUsers(users);
            //deferred.resolve();
            deferred.resolve({ success: true, message: 'User updated success' });
            return deferred.promise;
        }
        
        function Delete(id) {
            var deferred = $q.defer();
            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            setUsers(users);
            deferred.resolve({ success: true, message: 'User deleted success' });
            return deferred.promise;
        }

        // private functions
        function getUsers() {
            if(!localStorage.users_accept_cookies){
                localStorage.users_accept_cookies = JSON.stringify([]);
            }
            return JSON.parse(localStorage.users_accept_cookies);
        }
        function setUsers(users) {
            localStorage.users_accept_cookies = JSON.stringify(users);
        }
}]);
