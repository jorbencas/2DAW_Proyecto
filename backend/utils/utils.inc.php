<?php
function debug($array) { 
    echo "<pre>";
    print_r($array);
    echo "</pre><br>";
}

function redirect($url) {
    die('<script>top.location.href="' . $url . '";</script>');
}

function close_session() {
    $_SESSION = array(); // Destruye todas las variables de la sesión
    session_destroy(); // Destruye la sesión
}

function amigable($url, $return = false) {
    $amigableson = URL_AMIGABLES;
    $link = "";
    $i = 0;
    if ($amigableson) {
        $url = explode("&", str_replace("?", "", $url));
        foreach ($url as $key => $value) {
            $aux = explode("=", $value);

            $link .= "/" . $aux[1];
        }
    } else {
        $link = "/index.php" . $url;
    }
    if ($return) {
        return $link;
    }
    echo $link;
}
