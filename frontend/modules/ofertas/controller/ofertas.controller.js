app.controller('ofertasCtrl', function ($scope, ofertas, $http) {
    $scope.filteredOfertas = [];
    $scope.markers = [];
    $scope.oferta = ofertas.ofertas;
    $scope.numPerPage = 6;
    $scope.maxSize = 5;
    $scope.currentPage = 1;

    $scope.$watch('currentPage + numPerPage', update);

    

    function update() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.filteredOfertas = $scope.oferta.slice(begin, end);
    };

    $scope.search = function() {
		$http.post('search.php', { "data" : $scope.keywords})
		.success(function(data, status) {
    			$scope.status = status;
    			$scope.data = data;
    			$scope.result = data; // Show result from server in our <pre></pre> element
    		})
		.error(function(data, status) {
			$scope.data = data || "Request failed";
			$scope.status = status;			
		});
    };

});

app.controller('detailsCtrl', function ($scope, data, ofertas_map) {
    console.log(data);
    $scope.data = data.ofertas;

    // ofertas_map.cargarmap(ofertas.ofertas, $scope);
    
    //     $scope.select = function (id) {
    //         for (var i = 0; i < $scope.markers.length; i++) {
    //             var marker = $scope.markers[i];
    //             if (id == marker.get('id')) {
    //                 if (marker.getAnimation() !== null) {
    //                     marker.setAnimation(null);
    //                 } else {
    //                     marker.setAnimation(google.maps.Animation.BOUNCE);
    //                     $scope.map.setCenter(marker.latlon);
    //                 }
    //                 break;
    //             }
    //         }
    //     };

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

