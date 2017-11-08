app.factory("cookiesService", ['$cookies', 'localstorageService',
    function ($cookies, localstorageService) {
        var service = {};
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.GetCredentials = GetCredentials;
        service.Base64_encode = Base64_encode;
        service.Base64_decode = Base64_decode;
        service.GetCredentials_decode = GetCredentials_decode;
        service.GetCredentials_encode = GetCredentials_encode;
        return service;

        function SetCredentials(user) {
            //encriptar data
            var usuario = Base64_encode(user.usuario);
            var tipo = Base64_encode(user.tipo);
            var nombre = Base64_encode(user.nombre);
            
            //almacenarlos en la cookie session
            $cookies.putObject("session", 
            {usuario: usuario, avatar: user.avatar, tipo: tipo, nombre: nombre}, 
            {expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)});
            
            //almacenarlos en localstorage
            user = GetCredentials_encode(user);
            localstorageService.Create(user).then(function (response) {
                //console.log(response.success);
                if (response.success) {
                    console.log(response.message);
                } else {
                    console.log(response.message);
                }
            });
        }

        function ClearCredentials() {
            $cookies.remove("session");
        }
        
        function GetCredentials() {
            //al cargarse la pagina por primera vez, user es undefined
            var user = $cookies.getObject("session");
            if (user) { //si no es undefined
                //console.log(user); //datos encriptados
                user = GetCredentials_decode();
                //console.log(user); //datos no encriptados
            }
            return user;
        }
        
        function GetCredentials_encode(user) {
            var usuario = Base64_encode(user.usuario);
            var tipo = Base64_encode(user.tipo);
            var nombre = Base64_encode(user.nombre);
            return {usuario: usuario, avatar: user.avatar, tipo: tipo, nombre: nombre};
        }
        
        function GetCredentials_decode() {
            var usuario = Base64_decode($cookies.getObject("session").usuario);
            var tipo = Base64_decode($cookies.getObject("session").tipo);
            var nombre = Base64_decode($cookies.getObject("session").nombre);
            return {usuario: usuario, avatar: $cookies.getObject("session").avatar, tipo: tipo, nombre: nombre};
        }
        
        function Base64_encode(input) {
            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
    
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
    
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
    
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
    
                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        }
        
        function Base64_decode(input) {
            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
    
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
    
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
    
                output = output + String.fromCharCode(chr1);
    
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
    
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        }
    }]);
