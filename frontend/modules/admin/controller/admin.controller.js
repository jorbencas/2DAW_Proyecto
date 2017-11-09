app.controller('adminCtrl', function () {
});

app.controller('listCtrl', function ($scope, user, $timeout) {
    //console.log(user.user.length);
    
    $scope.list = [];
    $scope.filteredlist = [];
    $scope.messageFailure = "";

    $scope.list = user.user;
    $scope.currentPage = 1; //current page
    $scope.numPerPage = 5;
    $scope.maxSize = 5;
    $scope.itemsPerPage = 5;

    $scope.$watch('currentPage + numPerPage', update);
    function update() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage), 
        end = begin + $scope.numPerPage;
        $scope.filteredlist = $scope.list.slice(begin, end);
    };
    
    $scope.sort_by = function (predicate) {
        $scope.predicate = predicate;
        $scope.reverse = !$scope.reverse;
    };
});
