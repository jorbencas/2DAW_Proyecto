app.controller('ofertasCtrl', function ($scope, ofertas) {
    console.log(ofertas.ofertas);
    $scope.filteredOfertas = [];
    $scope.oferta = ofertas.ofertas;
    $scope.numPerPage = 3;
    $scope.maxSize = 5;
    $scope.currentPage = 1;

    $scope.$watch('currentPage + numPerPage', update);
    

    function update() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        console.log($scope.oferta.slice(begin, end));
       //$scope.filteredOfertas = $scope.oferta;
        $scope.filteredOfertas = $scope.oferta.slice(begin, end);
    }

    
      
    //   $scope.$watch('currentPage + numPerPage', function() {
    //     var begin = (($scope.currentPage - 1) * $scope.numPerPage)
    //     , end = begin + $scope.numPerPage;
        
    //     $scope.filteredTodos = $scope.todos.slice(begin, end);
    //   });

});

app.controller('detailsCtrl', function ($scope, data) {
    console.log(data);
    $scope.data = data.ofertas;

    // $scope.stringAsistentes = $scope.data.asistentes;
    // $scope.data.asistentes = $scope.stringAsistentes.split("-");
    // $scope.UneteV = true;
    
    // var user = cookiesService.GetCredentials();
    // if (user) {
    //     for (var i = 0; i < $scope.data.asistentes.length; i++)
    //         if ($scope.data.asistentes[i] === user.usuario)
    //             $scope.UneteV = false;
    // }
    
    // services.get('user', 'profile_filler', data.ofertas.usuario).then(function (response) {
    //     console.log(response);
    //     if (!response.error) {
    //         $scope.usuario = response.user;
    //         $scope.usuario.rankYes = Number($scope.usuario.valoracion);
    //         $scope.usuario.rankNo = 5 - Number($scope.usuario.rankYes);
    //     }
    // });
        
    // $scope.getTimes = function (n) {
    //     return new Array(n);
    // };
    
    // $scope.join = function () {
    //     var user = cookiesService.GetCredentials();
    //     if (user) {
    //         var asis = $scope.stringAsistentes + "-" + user.usuario;
    //         services.get('ofertas', 'join', $scope.data.id, asis).then(function (response) {
    //             //console.log(response);
    //             if (response.success) {
    //                 $scope.data.asistentes = response.datos.split("-");
    //                 $scope.UneteV = false;
    //                 window.location.href = window.location.href;
    //             } else {
    //                 CommonService.banner("Algo salió mal, inténtelo más tarde", "Err");
    //             }
    //         });
    //     } else {
    //         CommonService.banner("Haz login para poder unirte", "Err");
    //     }
    // };
});

