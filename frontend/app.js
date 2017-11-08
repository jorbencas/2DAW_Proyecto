var app = angular.module('myApp', ['ngRoute','ngAnimate', 'ui.bootstrap', 'ngCookies', 'facebook']);
app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
                // Home
                .when("/", {templateUrl: "frontend/modules/main/view/main.view.html", controller: "mainCtrl"})
                
                // Contact
                .when("/contact", {templateUrl: "frontend/modules/contact/view/contact.view.html", controller: "contactCtrl"})
                
                //Ofertas
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
                            console.log($route);
                            return services.get('ofertas', 'getOffer', $route.current.params.id);
                        }
                    }
                })

                .when("/oferta/:type", {
                    templateUrl: "frontend/modules/ofertas/view/main.view.html",
                    controller:"ofertasCtrl",
                    resolve: {
                        ofertas: function (services, $route) {
                            return services.get('ofertas', 'getCategory', $route.current.params.type);
                        }
                    }
                })

               
                 //Signup
                 .when("/user/alta/", {
                    templateUrl: "frontend/modules/user/view/signup.view.html",
                    controller: "signupCtrl"
                })
                //Activar Usuario
                .when("/user/activar/:token", {
                    templateUrl: "frontend/modules/main/view/main.view.html",
                    controller: "verifyCtrl"
                })

                //Perfil
                .when("/user/profile/", {
                    templateUrl: "frontend/modules/user/view/profile.view.html",
                    controller: "profileCtrl",
                    resolve: {
                        user: function (services, cookiesService) {
                            var user = cookiesService.GetCredentials();
                            if (user) {
                                return services.get('user', 'profile_filler', user.usuario);
                            }
                            return false;
                        }
                    }
                })
                
                //Restore
                .when("/user/recuperar", {
                    templateUrl: "frontend/modules/user/view/restore.view.html",
                    controller: "restoreCtrl"
                })
                //ChangePass
                .when("/user/cambiarpass/:token", {
                    templateUrl: "frontend/modules/user/view/changepass.view.html",
                    controller: "changepassCtrl"
                })

                
                // else 404
                .otherwise("/", {templateUrl: "frontend/modules/main/view/main.view.html", controller: "mainCtrl"});

    }]);

   