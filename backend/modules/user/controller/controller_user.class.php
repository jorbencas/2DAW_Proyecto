<?php
class controller_user {
    
    /**
     * Class constructor, includes all needed libraries
     */
    function __construct() {
        require_once(UTILS_USER . "functions.inc.php");
        include (LIBS . 'password_compat-master/lib/password.php');
        include (UTILS . 'upload.inc.php');
        $_SESSION['module'] = "user";
        require_once(LIBS . 'twitteroauth/twitteroauth.php');
    }
    
    /**
     * Create a new user
     * 
     * @param mixed[] $userJSON with the user info to be created
     * 
     * @return mixed[] returns array['success']=boolean with the result confirmation, if false returns array['typeErr']=string and array['error']=string with the error info too. 
     */
    public function signup_user() {
        $jsondata = array();
        $userJSON = $_POST;

        $result = validate_userPHP($userJSON);
        

        
        if ($result['resultado']) {
            $avatar = get_gravatar($result['email'], $s = 400, $d = 'identicon', $r = 'g', $img = false, $atts = array());
            $arrArgument = array(
                'usuario' => $result['datos']['usuario'],
                // 'nombre' => $result['datos']['nombre'],
                // 'apellidos' => $result['datos']['apellidos'],
                'email' => $result['datos']['email'],
                'password' => password_hash($result['datos']['password'], PASSWORD_BCRYPT),
                // 'date_birthday' => strtoupper($result['datos']['date_birthday']),
                // 'tipo' => $result['datos']['tipo'],
                // 'bank' => $result['datos']['bank'],
                 'avatar' => $avatar,
                // 'dni' => $result['datos']['dni'],
                'token' => ""
            );
            //////////////////////// repe user or email /////////////////
            set_error_handler('ErrorHandler');
            try {
                $arrValue = loadModel(MODEL_USER, "user_model", "count", array('column' => array('usuario'), 'like' => array($arrArgument['usuario'])));
                if ($arrValue[0]['total'] >= 1) {
                    $typeErr = 'Name';
                    $error = "Nombre de usuario no disponible";
                    
                    $jsondata["success"] = false;
                    $jsondata['typeErr'] = $typeErr;
                    $jsondata["error"] = $error;
                    echo json_encode($jsondata);
                    exit;
                }
                $arrValue = loadModel(MODEL_USER, "user_model", "count", array('column' => array('email'), 'like' => array($arrArgument['email'])));
                if ($arrValue[0]['total'] >= 1) {
                        $typeErr = 'Email';
                        $error = "Email ya registrado";
                        
                        $jsondata["success"] = false;
                        $jsondata['typeErr'] = $typeErr;
                        $jsondata["error"] = $error;
                        echo json_encode($jsondata);
                        exit;
                }
            } catch (Exception $e) {
                $arrValue = false;
            }
            restore_error_handler();
            ///////////////////////////////////////////////////////////////////
            
            //////////////////////// insert into - sendtoken /////////////////
            set_error_handler('ErrorHandler');
            try {
                $arrArgument['token'] = "Ver" . md5(uniqid(rand(), true));
                $arrValue = loadModel(MODEL_USER, "user_model", "create_user", $arrArgument);
            } catch (Exception $e) {
                $arrValue = false;
            }
            restore_error_handler();

            if ($arrValue) {
                sendtoken($arrArgument, "alta");
                $jsondata["success"] = true;
                echo json_encode($jsondata);
                exit;
            } else {
                $jsondata["success"] = false;
                $jsondata['typeErr'] = "error_server";
                echo json_encode($jsondata);
                exit;
            }
            ///////////////////////////////////////////////////////////////////
        } else {
            $jsondata["success"] = false;
            $jsondata['typeErr'] = "error";
            $jsondata["error"] = $result;
            echo json_encode($jsondata);
            exit;
        }
    }
    
    /**
     * Change to active the actual user 
     * 
     * @param string $_GET['param'] The token provided at the email, it must be the same as the one saved at the DB
     * 
     * @return mixed[] returns array['success']=boolean with the result confirmation, if true returns an array['user]=array with the user information
     */
    function verify() {
        if (substr($_GET['param'], 0, 3) == "Ver") {
            $arrArgument = array(
                'column' => array('token'),
                'like' => array($_GET['param']),
                'field' => array('activado'),
                'new' => array('1')
            );

            set_error_handler('ErrorHandler');
            try {
                $value = loadModel(MODEL_USER, "user_model", "update", $arrArgument);
            } catch (Exception $e) {
                $value['success'] = false;
            }
            if ($value) {
                $arrArgument = array(
                    'column' => array("token"),
                    'like' => array($_GET['param']),
                    'field' => array('*')
                );
                $user = loadModel(MODEL_USER, "user_model", "select", $arrArgument);
                $json['user'] = $user;
                $json['success'] = true;
                echo json_encode($json);
                exit();
            }
            restore_error_handler();
            echo json_encode($value);
        }
    }
    
    /**
     * Create a new token for the user and send an email with the url to change the password
     * 
     * @param string $_POST['inputEmail'] the user's email that's password going to be changed
     * 
     * @return string returns the result confirmation and the text that's going to be displayed
     */
    public function process_restore() {
        $result = array();
        if (isset($_POST['inputEmail'])) {
            $result = validatemail($_POST['inputEmail']);
            if ($result) {
                $column = array(
                    'email'
                );
                $like = array(
                    $_POST['inputEmail']
                );
                $field = array(
                    'token'
                );

                $token = "Cha" . md5(uniqid(rand(), true));
                $new = array(
                    $token
                );
                $arrArgument = array(
                    'column' => $column,
                    'like' => $like,
                    'field' => $field,
                    'new' => $new
                );
                $arrValue = loadModel(MODEL_USER, "user_model", "count", $arrArgument);
                if ($arrValue[0]['total'] == 1) {
                    $arrValue = loadModel(MODEL_USER, "user_model", "update", $arrArgument);
                    if ($arrValue) {
                        //////////////// Envio del correo al usuario
                        $arrArgument = array(
                            'token' => $token,
                            'email' => $_POST['inputEmail']
                        );
                       // echo json_encode($arrArgument );
                        //die();
                        if (sendtoken($arrArgument, "modificacion"))
                            echo "true|Tu mensaje ha sido enviado correctamente ";
                        else
                            echo "false|Error en el servidor. Intentelo más tarde...";
                    }
                } else {
                    echo "false|El email introducido no existe ";
                }
            } else {
                echo "false|El email no es válido";
            }
        }
    }
    
    /**
     * Change the user's password
     * 
     * @param string $_POST['json'] Json filled with the new password and the token.
     * 
     * @return mixed[] returns array['success']=boolean with the result confirmation 
     */
    function update_pass() {
        $arrArgument = array(
            'column' => array('token'),
            'like' => array($_POST['token']),
            'field' => array('password'),
            'new' => array(password_hash($_POST['password'], PASSWORD_BCRYPT))
        );

        set_error_handler('ErrorHandler');
        try {
            $value = loadModel(MODEL_USER, "user_model", "update", $arrArgument);
        } catch (Exception $e) {
            $value = false;
        }
        restore_error_handler();

        if ($value) {
            $jsondata["success"] = true;
            echo json_encode($jsondata);
            exit;
        } else {
            $jsondata["success"] = false;
            echo json_encode($jsondata);
            exit;
        }
    }
    
    /**
     * Gets the user's information entering the username and the password if its active (verified)
     * 
     * @param mixed[] $user An array with the username and the password
     * 
     * @return mixed[] returns an array with the user's info, if it fails return an array['error']=boolean and array['datos']=string with the error's info.
     */
    public function login() {
        $user = $_POST;
        $column = array(
            'usuario'
        );
        $like = array(
            $user['usuario']
        );

        $arrArgument = array(
            'column' => $column,
            'like' => $like,
            'field' => array('password')
        );

        set_error_handler('ErrorHandler');
        try {
            $arrValue = loadModel(MODEL_USER, "user_model", "select", $arrArgument);
            $arrValue = password_verify($user['pass'], $arrValue[0]['password']);
        } catch (Exception $e) {
            $arrValue = "error";
        }
        restore_error_handler();

        if ($arrValue !== "error") {
            if ($arrValue) {
                set_error_handler('ErrorHandler');
                try {
                    $arrArgument = array(
                        'column' => array("usuario", "activado"),
                        'like' => array($user['usuario'], "1")
                    );
                    $arrValue = loadModel(MODEL_USER, "user_model", "count", $arrArgument);

                    if ($arrValue[0]["total"] == 1) {
                        $arrArgument = array(
                            'column' => array("usuario"),
                            'like' => array($user['usuario']),
                            'field' => array('*')
                        );
                        $user = loadModel(MODEL_USER, "user_model", "select", $arrArgument);
                        echo json_encode($user);
                        exit();
                    } else {
                        $value = array(
                            "error" => true,
                            "datos" => "El usuario no ha sido activado, revise su correo"
                        );
                        echo json_encode($value);
                        exit();
                    }
                } catch (Exception $e) {
                    $value = array(
                        "error" => true,
                        "datos" => 503
                    );
                    echo json_encode($value);
                }
            } else {
                $value = array(
                    "error" => true,
                    "datos" => "El usuario y la contraseña no coinciden"
                );
                echo json_encode($value);
            }
        } else {
            $value = array(
                "error" => true,
                "datos" => 503
            );
            echo json_encode($value);
        }
    }

    /**
     * Gets an specific user
     * 
     * @param string $_GET['param'] the username we want to get all info
     * 
     * @return mixed[] returns array['success']=boolean with the result confirmation and array['user']=array if succeded
     * 
     */
    function profile_filler() {
        if (isset($_GET['param'])) {
            set_error_handler('ErrorHandler');
            try {
                $arrValue = loadModel(MODEL_USER, "user_model", "select", array(column => array('usuario'), like => array($_GET['param']), field => array('*')));
            } catch (Exception $e) {
                $arrValue = false;
            }
            restore_error_handler();

            if ($arrValue) {
                $jsondata["success"] = true;
                if ($_GET['param'] != '%%')
                    $jsondata['user'] = $arrValue[0];
                else
                    $jsondata['user'] = $arrValue;
                echo json_encode($jsondata);
                exit();
            } else {
                $jsondata["success"] = false;
                echo json_encode($jsondata);
                exit();
            }
        } else {
            $jsondata["success"] = false;
            echo json_encode($jsondata);
            exit();
        }
    }
    
    /**
     * Gets all country names and codes
     * 
     * @param boolean $_GET['param'] just for confirmation porposes.
     * 
     * @return string retuns 'error' if fails, if success returns a json filled with the requested data
     */
    function load_pais_user() {
        if ((isset($_GET["param"])) && ($_GET["param"] == true)) {
            $json = array();

            $url = 'http://www.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/ListOfCountryNamesByName/JSON';
            set_error_handler('ErrorHandler');
            try {
                $json = loadModel(MODEL_USER, "user_model", "obtain_paises", $url);
            } catch (Exception $e) {
                $json = false;
            }
            restore_error_handler();

            if ($json) {
                echo $json;
                exit;
            } else {
                $json = "error";
                echo $json;
                exit;
            }
        }
    }

    /**
     * Gets all spanish 'provincias'
     * 
     * @param boolean $_GET['param'] just for confirmation porposes
     * 
     * @return mixed[] returns array['provincias'], if fails it contains 'error', if succed returns a json with the data
     */
    function load_provincias_user() {
        if ((isset($_GET["param"])) && ($_GET["param"] == true)) {
            $jsondata = array();
            $json = array();

            set_error_handler('ErrorHandler');
            try {
                $json = loadModel(MODEL_USER, "user_model", "obtain_provincias");
            } catch (Exception $e) {
                $json = false;
            }
            restore_error_handler();

            if ($json) {
                $jsondata["provincias"] = $json;
                echo json_encode($jsondata);
                exit;
            } else {
                $jsondata["provincias"] = "error";
                echo json_encode($jsondata);
                exit;
            }
        }
    }

    /**
     * Gets all town names in an spanish area
     * 
     * @param int $idPoblac the id of the area
     * 
     * @return mixed[] retuns the @param if fails, if succed retuns the json filled
     */
    function load_poblaciones_user() {
        if (isset($_POST['idPoblac'])) {
            $jsondata = array();
            $json = array();

            set_error_handler('ErrorHandler');
            try {
                $json = loadModel(MODEL_USER, "user_model", "obtain_poblaciones", $_POST['idPoblac']);
            } catch (Exception $e) {
                $json = false;
            }
            restore_error_handler();

            if ($json) {
                $jsondata["poblaciones"] = $json;
                echo json_encode($jsondata);
                exit;
            } else {
                $jsondata["poblaciones"] = $_POST['idPoblac'];
                echo json_encode($jsondata);
                exit;
            }
        }
    }
    
    /**
     * To upload an img file
     * 
     * @return string returns the new img's path
     */
    function upload_avatar() {
        $result_avatar = upload_files();
        $_SESSION['avatar'] = $result_avatar;
        echo json_encode($result_avatar);
    }
    
    /**
     * Delete the avatar just uploaded at the dropzone
     * 
     * @return mixed[] Returns an array containing 'res' with a boolean value
     */
    function delete_avatar() {
        $_SESSION['avatar'] = array();
        $result = remove_files();
        if ($result === true) {
            echo json_encode(array("res" => true));
        } else {
            echo json_encode(array("res" => false));
        }
    }

    /**
     * Modify a user
     * 
     * @param string $_POST['json'] JSON encoded user's new information
     * 
     * @return mixed[] returns array['success']=boolean with the result confirmation, if true returns array['datos']=array with the new info too
     */
    function modify() {
        $jsondata = array();
        $userJSON = $_POST;
        $userJSON['password2'] = $userJSON['password'];
        $result = validate_userPHP($userJSON);
        if ($result['resultado']) {
            $arrArgument = array(
                'usuario' => $result['datos']['usuario'],
                'nombre' => $result['datos']['nombre'],
                'apellidos' => $result['datos']['apellidos'],
                'email' => $result['datos']['email'],
                'password' => password_hash($result['datos']['password'], PASSWORD_BCRYPT),
                'date_birthday' => strtoupper($result['datos']['date_birthday']),
                'tipo' => $result['datos']['tipo'],
                'bank' => $result['datos']['bank'],
                'avatar' => $_SESSION['avatar']['datos'],
                'dni' => $result['datos']['dni'],
                'pais' => $result['datos']['pais'],
                'provincia' => $result['datos']['provincia'],
                'poblacion' => $result['datos']['poblacion']
            );
            $arrayDatos = array(
                column => array(
                    'email'
                ),
                like => array(
                    $arrArgument['email']
                )
            );
            $j = 0;
            foreach ($arrArgument as $clave => $valor) {
                if ($valor != "") {
                    $arrayDatos['field'][$j] = $clave;
                    $arrayDatos['new'][$j] = $valor;
                    $j++;
                }
            }

            set_error_handler('ErrorHandler');
            try {
                $arrValue = loadModel(MODEL_USER, "user_model", "update", $arrayDatos);
            } catch (Exception $e) {
                $arrValue = false;
            }
            restore_error_handler();
            if ($arrValue) {
                //$jsondata["success"] = true;
                //echo json_encode($jsondata);
                //exit;
                
                set_error_handler('ErrorHandler');
                $arrArgument = array(
                    'column' => array("usuario"),
                    'like' => array($arrArgument['usuario']),
                    'field' => array('*')
                );
                $user = loadModel(MODEL_USER, "user_model", "select", $arrArgument);
                restore_error_handler();
                $jsondata["success"] = true;
                $jsondata['user'] = $user;
                echo json_encode($jsondata);
                exit();
            } else {
                $jsondata["success"] = false;
                echo json_encode($jsondata);
            }
        } else {
            $jsondata["success"] = false;
            $jsondata['datos'] = $result;
            echo json_encode($jsondata);
        }
    }

    /**
     * Create a user or log in (depends if exists in DB) when the acces comes from FB or Twitter
     * 
     * @param mixed[] $user user data to be processed
     * 
     * @return mixed[] if succed returns the user data encoded, if fails returns array('error' => boolean, 'datos' => int), 'datos' is the error code. 
     */
    function social_signin() {
        $user = $_POST;
        if ($user['twitter']) {
            $user['apellidos'] = "";
            //$user['email'] = "";
            //$mail = $user['user_id'] . "@gmail.com";
        }
        set_error_handler('ErrorHandler');
        try {
            $arrValue = loadModel(MODEL_USER, "user_model", "count", array('column' => array('usuario'), 'like' => array($user['id'])));
        } catch (Exception $e) {
            $arrValue = false;
        }
        restore_error_handler();

        if (!$arrValue[0]["total"]) {
            if (!$user['avatar'])
                $user['avatar'] = 'http://graph.facebook.com/' . ($user['id']) . '/picture';

            $arrArgument = array(
                'usuario' => $user['id'],
                'nombre' => $user['nombre'],
                'apellidos' => $user['apellidos'],
                'email' => $user['email'],
                'tipo' => 'client',
                'avatar' => $user['avatar'],
                'activado' => "1"
            );

            set_error_handler('ErrorHandler');
            try {
                $value = loadModel(MODEL_USER, "user_model", "create_user", $arrArgument);
            } catch (Exception $e) {
                $value = false;
            }
            restore_error_handler();
        } else
            $value = true;

        if ($value) {
            set_error_handler('ErrorHandler');
            $arrArgument = array(
                'column' => array("usuario"),
                'like' => array($user['id']),
                'field' => array('*')
            );
            $user = loadModel(MODEL_USER, "user_model", "select", $arrArgument);
            restore_error_handler();
            echo json_encode($user);
        } else {
            echo json_encode(array('error' => true, 'datos' => 503));
        }
    }
}
