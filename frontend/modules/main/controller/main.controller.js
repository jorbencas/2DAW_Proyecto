app.controller('mainCtrl', function ($scope, $http, $location) {
    console.log("main");
    
        $scope.search = function() {
            $location.path('/oferta/'+$scope.keywords);
            // $http.post('search.php', { "data" : $scope.keywords})
            // .success(function(data, status) {
            // 		$scope.status = status;
            // 		$scope.data = data;
            // 		$scope.result = data; // Show result from server in our <pre></pre> element
            // 	})
            // .error(function(data, status) {
            // 	$scope.data = data || "Request failed";
            // 	$scope.status = status;			
            // });
    
    
        };
    });