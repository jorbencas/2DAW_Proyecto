var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
                // Home
                .when("/", {templateUrl: "frontend/modules/main/view/main.view.html", controller: "mainCtrl"})
                
                // Contact
                .when("/contact", {templateUrl: "frontend/modules/contact/view/contact.view.html", controller: "contactCtrl"})
                
                // Ofertas
                .when("/ofertas", {
                    templateUrl: "frontend/modules/ofertas/view/main.view.html",
                    controller: "ofertasCtrl",
                    resolve: {
                        ofertas: function (services) {
                            return services.get('ofertas', 'maploader');
                        }
                    }
                })
                .when("/ofertas/:id", {
                    templateUrl: "frontend/modules/ofertas/view/oferta.view.html",
                    controller: "detailsCtrl",
                    resolve: {
                        data: function (services, $route) {
                            return services.get('ofertas', 'getOffer', $route.current.params.id);
                        }
                    }
                })

                // else 404
                .otherwise("/", {templateUrl: "frontend/modules/main/view/main.view.html", controller: "mainCtrl"});
    }]);
