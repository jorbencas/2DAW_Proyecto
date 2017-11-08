app.controller('menuCtrl', function ($scope, $uibModal, UserService, $rootScope, $anchorScroll) {
    console.log("modal");
    UserService.login();
    $rootScope.bannerV = false;
    $rootScope.bannerText = "";

    $scope.open = function () {
        console.log("modal");
        var modalInstance = $uibModal.open({
            animation: 'true',
            templateUrl: 'frontend/modules/user/view/modal.view.html',
            controller: 'modalWindowCtrl',
            size: "lg"
        });
    };

    $scope.logout = function () {
        UserService.logout();
    };
    
    //scrollup está en footer.php
    //en arriba.js visualiza scrollup
    //redirigir scrollup al top de la pagina
    $scope.toTheTop = function () {
        $anchorScroll();
    };

});

app.controller('modalWindowCtrl', function ($scope, $uibModalInstance, services,
    CommonService, $location, UserService, twitterService, facebookService, $timeout, cookiesService) {
    $scope.form = {
        user: "",
        pass: ""
    };
        
    twitterService.initialize();
    
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.login = function () {
        var data = {"usuario": $scope.form.user, "pass": $scope.form.pass};
        data = JSON.stringify(data);
        
        services.post("user", "login", data).then(function (response) {
            //console.log(response);
            //console.log(response[0].usuario);
            if (!response.error) {
                cookiesService.SetCredentials(response[0]);
                $scope.close();
                UserService.login();
            } else {
                if (response.datos == 503)
                    CommonService.banner("Error, intentelo mas tarde", "Err");
                else if (response.datos == 404){
                    $location.path("/");
                    CommonService.banner("Error, intentelo mas tarde", "Err");
                }else {
                    $scope.err = true;
                    $scope.errorpass = response.datos;
                    $timeout(function () {
                        $scope.err = false;
                        $scope.errorpass = "";
                    }, 1500);
                }
            }
        });
    };

    $scope.loginTw = function () {
        twitterService.connectTwitter().then(function () {
            //console.log(twitterService.isReady());
            if (twitterService.isReady()) {
                twitterService.getUserInfo().then(function (data) {
                    //console.log(data);
                    services.post("user", 'social_signin', {id: data.id, nombre: data.name, avatar: data.profile_image_url_https, twitter: true})
                    .then(function (response) {
                        //console.log(response[0]);
                        if (!response.error) {
                            cookiesService.SetCredentials(response[0]);
                            $scope.close();
                            UserService.login();
                        } else {
                            if (response.datos == 503)
                                CommonService.banner("Error server, intentelo mas tarde", "Err");
                        }
                    });
                });
            }
        });
    };
    $scope.loginFb = function () {
        facebookService.login().then(function () {
            facebookService.me().then(function (user) {
                //console.log(user);
                if (user.error){
                    $scope.close();
                }else{
                    services.post("user", 'social_signin', {id: user.id, nombre: user.first_name, apellidos: user.last_name, email: user.email})
                    .then(function (response) {
                        //console.log(response);
                        //console.log(response[0]['usuario']);
                        if (!response.error) {
                            cookiesService.SetCredentials(response[0]);
                            $scope.close();
                            UserService.login();
                        } else {
                            if (response.datos == 503)
                                CommonService.banner("Error server, intentelo mas tarde", "Err");
                        }
                    });
                }
            });
        });
    };
});

app.controller('signupCtrl', function ($scope, services, $location, $timeout, CommonService) {
    $scope.signup = {
        inputUser: "",
        inputName: "",
        inputSurn: "",
        inputEmail: "",
        inputPass: "",
        inputPass2: "",
        inputBirth: "",
        inputType: "client",
        inputBank: "",
        inputDni: ""
    };
    
    $scope.error = function() {
        $scope.signup.user_error = ""; 
        $scope.signup.email_error = "";  
        $scope.signup.nombre_error = ""; 
        $scope.signup.surn_error = "";          
        $scope.signup.pass_error = "";
        $scope.signup.birth_error = "";
        $scope.signup.bank_error = "";
        $scope.signup.dni_error = "";
    };
    
    $scope.change_signup = function () {
        $scope.signup.user_error = ""; 
        $scope.signup.email_error = "";  
        $scope.signup.nombre_error = ""; 
        $scope.signup.surn_error = "";          
        $scope.signup.pass_error = "";
        $scope.signup.birth_error = "";
        $scope.signup.bank_error = "";
        $scope.signup.dni_error = "";
    };
    
    $('.modal').remove();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");

    $scope.SubmitSignUp = function () {
        var data = {"usuario": $scope.signup.inputUser, "email": $scope.signup.inputEmail,
            "password": $scope.signup.inputPass};
        var data_users_JSON = JSON.stringify(data);
        
        services.post('user', 'signup_user', data_users_JSON).then(function (response) {
            //console.log(response);

            if (response.success) {
                $timeout(function () {
                    $location.path('/');
                    CommonService.banner("El usuario se ha dado de alta correctamente, revisa su correo para activarlo", "");
                }, 2000);
            } else {
                if (response.typeErr === "Name") {
                    $scope.AlertMessage = true;
                    $timeout(function () {
                        $scope.AlertMessage = false;
                    }, 5000);
                    $scope.signup.user_error = response.error;
                    
                } else if (response.typeErr === "Email") {
                    $scope.AlertMessage = true;
                    $timeout(function () {
                        $scope.AlertMessage = false;
                    }, 5000);
                    $scope.signup.email_error = response.error;
                    
                } else if (response.typeErr === "error") {
                    //console.log(response.error);
                    $scope.AlertMessage = true;
                    $timeout(function () {
                        $scope.AlertMessage = false;
                    }, 5000);
                    $scope.signup.user_error = response.error.usuario;
                    $scope.signup.email_error = response.error.email;
                    $scope.signup.nombre_error = response.error.nombre;
                    $scope.signup.surn_error = response.error.apellidos;
                    $scope.signup.pass_error = response.error.password;
                    $scope.signup.birth_error = response.error.date_birthday;
                    $scope.signup.bank_error = response.error.bank;
                    $scope.signup.dni_error = response.error.dni;
                } else if (response.typeErr === "error_server"){
                    CommonService.banner("Error en el servidor", "Err");
                }
            }
        });
    };
});

app.controller('verifyCtrl', function (UserService, $location, CommonService, $route, services, cookiesService) {
    var token = $route.current.params.token;
    if (token.substring(0, 3) !== 'Ver') {
        CommonService.banner("Ha habido algún tipo de error con la dirección", "Err");
        $location.path('/');
    }
    services.get("user", "activar", token).then(function (response) {
        //console.log(response);
        //console.log(response.user[0].usuario);
        if (response.success) {
            CommonService.banner("Su cuenta ha sido satisfactoriamente verificada", "");
            cookiesService.SetCredentials(response.user[0]);
            UserService.login();
            $location.path('/');
        } else {
            if (response.datos == 503){
                CommonService.banner("Error, intentelo mas tarde", "Err");
                $location.path("/");
            }else if (response.error == 404){
                CommonService.banner("Error, intentelo mas tarde", "Err");
                $location.path("/");
            }
        }
    });
});

app.controller('restoreCtrl', function ($scope, services, $timeout, $location, CommonService) {
    $scope.restore = {
        inputEmail: ""
    };

    $('.modal').remove();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");

    $scope.SubmitRestore = function () {
        var data = {"inputEmail": $scope.restore.inputEmail, "token": 'restore_form'};
        var restore_form = JSON.stringify(data);
        
        services.post('user', 'process_restore', restore_form).then(function (response) {
            //console.log(response);
            response = response.split("|");
            $scope.message = response[1];
            if (response[0] == 'true') {
                $scope.class = 'alert alert-success';
                $timeout(function () {
                    $location.path('/');
                    CommonService.banner("Revisa la bandeja de tu correo", "");
                }, 3000);
            } else {
                $scope.class = 'alert alert-error';
                $timeout(function () {
                    $location.path('/');
                    CommonService.banner("Intentelo mas tarde...", "");
                }, 3000);
            }
        });
    };
});

app.controller('changepassCtrl', function ($route, $scope, services, $location, CommonService) {
    $scope.token = $route.current.params.token;
    $scope.changepass = {
        inputPassword: ""
    };

    $scope.SubmitChangePass = function () {
        var data = {"password": $scope.changepass.inputPassword, "token": $scope.token};
        var passw = JSON.stringify(data);
        
        services.put('user', 'update_pass', passw).then(function (response) {
            //console.log(response);
            if (response.success) {
                $location.path('/');
                CommonService.banner("Tu contraseña se ha cambiado correctamente", "");
            } else {
                CommonService.banner("Error en el servidor", "Err");
            }
        });
    };
});

app.controller('profileCtrl', function ($scope, UserService, services, user, $location, CommonService, 
load_pais_prov_poblac, $timeout, cookiesService) {
    //console.log(user);
    //console.log(user.user.usuario); //yomogan
    
    //admin
    $scope.admin = false;
    var user_cookie = cookiesService.GetCredentials();
    if (user_cookie) {
        if( (user.user.usuario !== user_cookie.usuario) && (user_cookie.tipo != 'admin') )
            $location.path("/");
        else if (user.user.usuario !== user_cookie.usuario)
            $scope.admin = true;
    }else{
        $location.path("/");
    }
                
    //llenar los campos del form_profile con scope
    user.user.password = "";
    $scope.user = user.user;
    $scope.drop = {
        msgClass: ''
    };
    if (!isNaN(user.user.usuario))
        $scope.user.usuario = user.user.nombre;
        
    //disabled mail y dni
    $scope.controlmail = false; //ng-disabled=false
    $scope.controldni = false; //ng-disabled=false
    if (user.user.email)
        $scope.controlmail = true;
    if (user.user.dni)
        $scope.controldni = true;
    
    //errors
    $scope.error = function() {
        $scope.user.nombre_error = ""; 
        $scope.user.surn_error = "";
        $scope.user.birth_error = "";
        $scope.user.pass_error = "";
        $scope.user.bank_error = "";
        $scope.user.email_error = "";  
        $scope.user.dni_error = "";
        $scope.user.pais_error = "";
        $scope.user.prov_error = "";
        $scope.user.pob_error = "";
    };
    $scope.change_profile = function () {
        $scope.user.nombre_error = ""; 
        $scope.user.surn_error = "";
        $scope.user.birth_error = "";
        $scope.user.pass_error = "";
        $scope.user.bank_error = "";
        $scope.user.email_error = "";  
        $scope.user.dni_error = "";
    };
    
    //rellenar pais, provincias y poblaciones
    load_pais_prov_poblac.load_pais()
    .then(function (response) {
        if(response.success){
            $scope.paises = response.datas;
        }else{
            $scope.AlertMessage = true;
            $scope.user.pais_error = "Error al recuperar la informacion de paises";
            $timeout(function () {
                $scope.user.pais_error = "";
                $scope.AlertMessage = false;
            }, 2000);
        }
    });
    //$scope.provincias = null; //en ng-disabled
    //$scope.poblaciones = null; //en ng-disabled

    $scope.resetPais = function () {
        if ($scope.user.pais.sISOCode == 'ES') {
            load_pais_prov_poblac.loadProvincia()
            .then(function (response) {
                if(response.success){
                    $scope.provincias = response.datas;
                }else{
                    $scope.AlertMessage = true;
                    $scope.user.prov_error = "Error al recuperar la informacion de provincias";
                    $timeout(function () {
                        $scope.user.prov_error = "";
                        $scope.AlertMessage = false;
                    }, 2000);
                }
            });
            $scope.poblaciones = null;
        } /*else { //en ng-disabled
            $scope.provincias = null;
            $scope.poblaciones = null;
        }*/
    };
    
    $scope.resetValues = function () {
        var datos = {idPoblac: $scope.user.provincia.id};
        load_pais_prov_poblac.loadPoblacion(datos)
        .then(function (response) {
            if(response.success){
                $scope.poblaciones = response.datas;
            }else{
                $scope.AlertMessage = true;
                $scope.user.pob_error = "Error al recuperar la informacion de poblaciones";
                $timeout(function () {
                    $scope.user.pob_error = "";
                    $scope.AlertMessage = false;
                }, 2000);
            }
        });
    };
    
    //dropzone
    $scope.dropzoneConfig = {
        'options': {
            'url': 'backend/index.php?module=user&function=upload_avatar',
            addRemoveLinks: true,
            maxFileSize: 1000,
            dictResponseError: "Ha ocurrido un error en el server",
            acceptedFiles: 'image/*,.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF,.rar,application/pdf,.psd'
        },
        'eventHandlers': {
            'sending': function (file, formData, xhr) {},
            'success': function (file, response) {
                console.log(response);
                response = JSON.parse(response);
                //console.log(response);
                if (response.resultado) {
                    $(".msg").addClass('msg_ok').removeClass('msg_error').text('Success Upload image!!');
                    $('.msg').animate({'right': '300px'}, 300);
                    
                    //console.log(response.datos);
                    $scope.user.avatar = response.datos;
                
                    var user = {usuario: $scope.user.usuario, avatar: response.datos, 
                    tipo: $scope.user.tipo, nombre: $scope.user.nombre};
                    cookiesService.SetCredentials(user);
                    
                    UserService.login();
                } else {
                    $(".msg").addClass('msg_error').removeClass('msg_ok').text(response['error']);
                    $('.msg').animate({'right': '300px'}, 300);
                }
            },
            'removedfile': function (file, serverFileName) {
                if (file.xhr.response) {
                    $('.msg').text('').removeClass('msg_ok');
                    $('.msg').text('').removeClass('msg_error');
                    var data = jQuery.parseJSON(file.xhr.response);
                    services.post("user", "delete_avatar", JSON.stringify({'filename': data}));
                }
            }
    }};

    $scope.submit = function () {
        var pais, prov, pob, tipo = null;
        if (!$scope.user.pais.sISOCode) { //el usuario no escoge pais
            pais = " ";
        }else{ //el usuario escoge pais
            pais = $scope.user.pais.sISOCode;
            if($scope.user.pais.sISOCode !== "ES"){
                prov = " ";
                pob = " ";
            }
        }
        
        if (!$scope.user.provincia.id) { //el usuario no escoge provincia
            prov = " ";
        }else{ //el usuario escoge provincia
            prov = $scope.user.provincia.id;
        }
        
        if (!$scope.user.poblacion.poblacion) { //el usuario no escoge poblacion
            pob = " ";
        }else{ //el usuario escoge poblacion
            pob = $scope.user.poblacion.poblacion;
        }
        
        if (!$scope.user.tipo) { 
            tipo = "client";
        }else{ 
            tipo = $scope.user.tipo;
        }
        
        //var data = JSON.stringify($scope.user);
        var data = {"usuario": $scope.user.usuario, "email": $scope.user.email, "nombre": $scope.user.nombre, 
        "apellidos": $scope.user.apellidos, "dni": $scope.user.dni, "password": $scope.user.password, 
        "date_birthday": $scope.user.date_birthday, "bank": $scope.user.bank, "pais": pais,
        "provincia": prov,"poblacion": pob, "avatar": $scope.user.avatar, "tipo": tipo};
        var data1 = JSON.stringify(data);
        //console.log(data);
        
        /*
        "usuario":"yomogan","email":"yomogan@gmail.com","nombre":"yomogan","apellidos":"yomogan","dni":"48287734Q","password":"",
        "date_birthday":"03/04/1977","bank":"1234567890","pais":{"sISOCode":"ES","sName":"Spain","$$hashKey":"object:264"},
        "provincia":{"id":"01","nombre":"Alava","$$hashKey":"object:313"},
        "poblacion":{"poblacion":"Alegria","$$hashKey":"object:385"},
        "avatar":"https://www.gravatar.com/avatar/d41d8cd98f00b204e9800998ecf8427ed41d8cd98f00b204e9800998ecf8427e?s=400&d=identicon&r=g"
        
        "usuario":"yomogan","email":"yomogan@gmail.com","nombre":"yomogan","apellidos":"yomogan","dni":"48287734Q","password":"yomogan2",
        "date_birthday":"03/04/1977","bank":"1234567890","pais":" ","provincia":" ","poblacion":" ",
        "avatar":"https://php-mvc-oo-yomogan.c9users.io/4_AngularJS/3_proj_final_AngularJS/JoinElderly/backend/media/flowers.png","tipo":"admin"
        */

        services.put("user", "modify", data1).then(function (response) {
            //console.log(response);
            //console.log(response.user[0].usuario);
            
            //limpiar el avatar de :80
            var avatar = response.user[0].avatar;
            var buscar = avatar.indexOf(":80");
            if(buscar !== -1){
                var avatar = avatar.replace(":80", "");
                response.user[0].avatar = avatar;
            }
            console.log(response.user[0].avatar);

            if (response.success) {
                cookiesService.SetCredentials(response.user[0]);
                UserService.login();
                if (tipo === "client") {
                    $timeout(function () {
                        $location.path($location.path());
                        CommonService.banner("Su perfil ha sido modificado satisfactoriamente", "");
                    }, 2000);
                } else if (tipo === "admin"){
                    $timeout(function () {
                        $location.path('/admin/list');
                        CommonService.banner("El usuario se ha modificado correctamente", "");
                    }, 2000);
                }
            } else {
                if (response.datos){
                    //console.log(response.datos);
                    $scope.AlertMessage = true;
                    $timeout(function () {
                        $scope.AlertMessage = false;
                    }, 3000);
                    $scope.user.user_error = response.datos.usuario;
                    $scope.user.email_error = response.datos.email;
                    $scope.user.nombre_error = response.datos.nombre;
                    $scope.user.surn_error = response.datos.apellidos;
                    $scope.user.pass_error = response.datos.password;
                    $scope.user.birth_error = response.datos.date_birthday;
                    $scope.user.bank_error = response.datos.bank;
                    $scope.user.dni_error = response.datos.dni;
                }
            }
        });
    };
});
