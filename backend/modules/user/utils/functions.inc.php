<?php
function validate_userPHP($value) {
    $filtro = array(
        'usuario' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^.{4,20}$/')
        ),
        'nombre' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^\D{3,30}$/')
        ),
        'apellidos' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^\D{4,120}$/')
        ),
        'email' => array(
            'filter' => FILTER_CALLBACK,
            'options' => 'validatemail'
        ),
        'password' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^.{6,12}$/')
        ),
        'date_birthday' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/\d{2}.\d{2}.\d{4}$/')
        ),
        'bank' => array(
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => array('regexp' => '/^.{4,20}$/')
        )
    );

    $resultado = filter_var_array($value, $filtro);
    $resultado['password2'] = $value['password2'];
    $resultado['dni'] = $value['dni'];
    $resultado['tipo'] = $value['tipo'];
    $resultado['avatar'] = $value['avatar'];
    $resultado['pais'] = $value['pais'];
    $resultado['provincia'] = $value['provincia'];
    $resultado['poblacion'] = $value['poblacion'];
    $resultado = validateUsers($resultado);
    return $resultado;
}

function validateUsers($resultado) {
    if (!$resultado['usuario']) {
        $result['usuario'] = 'Usuario debe tener de 4 a 20 caracteres';
        $result['resultado'] = false;
        
    } elseif (!$resultado['nombre']) {
        $result['nombre'] = 'Nombre debe tener de 3 a 30 letras';
        $result['resultado'] = false;
      
    } elseif (!$resultado['apellidos']) {
        $result['apellidos'] = 'Apellidos debe tener de 4 a 120 letras';
        $result['resultado'] = false;
       
    } elseif (!$resultado['email']) {
        $result['email'] = 'El email debe contener de 5 a 50 caracteres y debe ser un email valido';
        $result['resultado'] = false;
       
    } elseif (!$resultado['password'] || $resultado['password'] != $resultado['password2']) {
        $result['password'] = 'Password debe tener de 6 a 12 caracteres y las dos contrasenyas deben ser iguales';
        $result['resultado'] = false;
       
    } elseif (!$resultado['date_birthday']) {
        $result['date_birthday'] = 'Formato fecha mm/dd/yy';
        $result['resultado'] = false;
      
    } elseif (validate_age($resultado['date_birthday']) < 18) {
        $result['date_birthday'] = 'Debe ser mayor de 18 años';
        $result['resultado'] = false;
       
    } elseif (!$resultado['bank']) {
        $result['bank'] = 'Datos bancarios incorrectos';
        $result['resultado'] = false;
       
    } elseif (!validate_dni($resultado['dni'])) {
        $result['dni'] = 'DNI inválido';
        $result['resultado'] = false;
       
    } elseif (!preg_match('/^[a-zA-Z_]*$/', $resultado['pais']) && $resultado['pais'] !== " ") {
        $result['pais'] = 'pais introducido no válido';
        $result['resultado'] = false;
       
    } elseif (!preg_match('/^[a-zA-Z0-9, _]*$/', $resultado['provincia']) && $resultado['provincia'] !== " ") {
        $result['provincia'] = 'provincia introducida no válida';
        $result['resultado'] = false;
       
    } elseif (!preg_match('/^[a-zA-Z0-9, _]*$/', $resultado['poblacion']) && $resultado['poblacion'] !== " ") {
        $result['poblacion'] = 'poblacion introducida no válida';
        $result['resultado'] = false;
       
    } else {
        $result['resultado'] = true;
        $result['datos']=$resultado;
    }
    return $result;
}

function validatemail($email) {
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        if (filter_var($email, FILTER_VALIDATE_REGEXP, array('options' => array('regexp' => '/^.{5,50}$/')))) {
            return $email;
        }
    }
    return false;
}

function validate_age($date) {
    list($día_one, $mes_one, $anio_one) = split('/', $date);
    $dateOne = new DateTime($anio_one . "-" . $mes_one . "-" . $día_one);
    $now = new Datetime('today');
    $interval = $dateOne->diff($now);
    return $interval->y;
}

function get_gravatar($email, $s = 80, $d = 'wavatar', $r = 'g', $img = false, $atts = array()) {
    $email = trim($email);
    $email = strtolower($email);
    $email_hash = md5($email);

    $url = "http://www.gravatar.com/avatar/" . $email_hash;
    $url .= md5(strtolower(trim($email)));
    $url .= "?s=$s&d=$d&r=$r";
    if ($img) {
        $url = '<img src="' . $url . '"';
        foreach ($atts as $key => $val)
            $url .= ' ' . $key . '="' . $val . '"';
        $url .= ' />';
    }
    return $url;
}

function validate_dni($dni) {
    $letra = substr($dni, -1);
    $numeros = substr($dni, 0, -1);
    if (substr("TRWAGMYFPDXBNJZSQVHLCKE", $numeros % 23, 1) == $letra && strlen($letra) == 1 && strlen($numeros) == 8) {
        return true;
    } else {
        return false;
    }
}

function sendtoken($arrArgument, $type) {
    $mail = array(
        'type' => $type,
        'token' => $arrArgument['token'],
        'inputEmail' => $arrArgument['email']
    );
    set_error_handler('ErrorHandler');
    try {
        enviar_email($mail);
        return true;
    } catch (Exception $e) {
        return false;
    }
    restore_error_handler();
}
