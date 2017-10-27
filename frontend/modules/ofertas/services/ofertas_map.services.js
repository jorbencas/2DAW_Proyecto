app.factory("ofertas_map", ['$rootScope',
function ($rootScope) {
    var service = {};
    service.cargarmap = cargarmap;
    service.marcar = marcar;
    return service;

    function cargarmap(arrArguments, $rootScope) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
        
        function showPosition(position){
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            latlon = new google.maps.LatLng(lat, lon);
            mapholder = document.getElementById('mapholder');
            //mapholder.style.height = '550px';
            //mapholder.style.width = '900px';
            
            var myOptions = {
                center: latlon, zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL}
            };
            var map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
            // var marker = new google.maps.Marker({position: latlon, map: map, title: "You are here!"});
            
            $rootScope.map = map;
            for (var i = 0; i < arrArguments.length; i++) {
                marcar(map, arrArguments[i], $rootScope);
            }
        }
        
        function showError(error){
            switch (error.code){
                case error.PERMISSION_DENIED:
                    $rootScope.demo = "Denegada la peticion de Geolocalización en el navegador.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    $rootScope.demo = "La información de la localización no esta disponible.";
                    break;
                case error.TIMEOUT:
                    $rootScope.demo = "El tiempo de petición ha expirado.";
                    break;
                case error.UNKNOWN_ERROR:
                    $rootScope.demo = "Ha ocurrido un error desconocido.";
                    break;
            }
        }
    }
    
    function marcar(map, oferta, $rootScope) {
        var latlon = new google.maps.LatLng(oferta.latitud, oferta.longitud);
        var marker = new google.maps.Marker({position: latlon, map: map, title: oferta.descripcion, animation: null});
    
        marker.set('id', oferta.id);
        marker.set('latlon', latlon);
    
        var infowindow = new google.maps.InfoWindow({
            content: '<h1 class="oferta_title">Oferta en ' + oferta.lugar_inicio + '</h1><p class="oferta_content">' + oferta.descripcion + '</p><p class="oferta_content">Día: ' + oferta.fecha_inicio + '</p><p class="oferta_content">Horario: ' + oferta.hora_inicio + ' - ' + oferta.hora_final + '</p>'
        });
    
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
            google.maps.event.addListener(infowindow, 'domready', function () {
                var iwOuter = $('.gm-style-iw');
                var iwCloser = iwOuter.next();
                var iwBackground = iwOuter.prev();
    
                iwBackground.children(':nth-child(2)').css({'display': 'none'});
                iwBackground.children(':nth-child(4)').css({'display': 'none'});
                iwBackground.children(':nth-child(1)').attr('style', function (i, s) {
                    return s + 'left: 76px !important;'
                });
                iwBackground.children(':nth-child(3)').attr('style', function (i, s) {
                    return s + 'left: 76px !important;'
                });
                iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'background-color': '#f5f5f5', 'z-index': '1'});
                iwCloser.css({
                    opacity: '1',
                    right: '18px', top: '3px',
                    'border-radius': '13px', // circular effect
                    'box-shadow': '0 0 5px #3990B9' // 3D effect to highlight the button
                });
                iwCloser.mouseout(function () {
                    $(this).css({opacity: '1'});
                });
            });
        });
        $rootScope.markers.push(marker);
    }
    
}]);
