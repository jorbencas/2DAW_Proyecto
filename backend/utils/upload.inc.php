<?php
function upload_files() {
    $error = "";
    $copiarFichero = false;
    $extensiones = array('jpg', 'jpeg', 'gif', 'png', 'bmp');

    if (!isset($_FILES)) {
        $error .= 'No existe $_FILES ';
    }
    if (!isset($_FILES['file'])) {
        $error .= 'No existe $_FILES[file] ';
    }

    $imagen = $_FILES['file']['tmp_name'];
    $nom_fitxer = $_FILES['file']['name'];
    $mida_fitxer = $_FILES['file']['size'];
    $tipus_fitxer = $_FILES['file']['type'];
    $error_fitxer = $_FILES['file']['error'];

    if ($error_fitxer > 0) { // El error 0 quiere decir que se subió el archivo correctamente
        switch ($error_fitxer) {
            case 1: $error .= 'Fitxer major que upload_max_filesize ';
                break;
            case 2: $error .= 'Fitxer major que max_file_size ';
                break;
            case 3: $error .= 'Fitxer només parcialment pujat ';
                break;
            //case 4: $error .=  'No has pujat cap fitxer <br>';break; //assignarem a l'us default-avatar
        }
    }

    if ($_FILES['file']['size'] > 55000) {
        $error .= "Large File Size <br>";
    }

    if ($_FILES['file']['name'] !== "") {
        ////////////////////////////////////////////////////////////////////////////
        @$extension = strtolower(end(explode('.', $_FILES['file']['name']))); // Obtenemos la extensión, en minúsculas para poder comparar
        if (!in_array($extension, $extensiones)) {
            $error .= 'Sólo se permite subir archivos con estas extensiones: ' . implode(', ', $extensiones) . '';
        }
        ////////////////////////////////////////////////////////////////////////////
        //getimagesize falla si $_FILES['file']['name'] === ""
        if (!@getimagesize($_FILES['file']['tmp_name'])) {
            $error .= "Invalid Image File... <br>";
        }
        ////////////////////////////////////////////////////////////////////////////
        list($width, $height, $type, $attr) = @getimagesize($_FILES['file']['tmp_name']);
        if ($width > 500 || $height > 500) {
            $error .= "Maximum width and height exceeded. Please upload images below 100x100 px size ";
        }
    }

    ////////////////////////////////////////////////////////////////////////////
    $upfile = MEDIA_ROOT . $_FILES['file']['name'];
    if (is_uploaded_file($_FILES['file']['tmp_name'])) {
        if (is_file($_FILES['file']['tmp_name'])) {
            //$idUnico = microtime();
            //$nombreFichero = $idUnico . "-" . $_FILES['file']['name'];
            $copiarFichero = true;
            //$upfile = '../media/'.$nombreFichero;
        } else {
            $error .= "Invalid File...";
        }
    }

    if ($error == "") {
        if ($copiarFichero) {
            if (!move_uploaded_file($_FILES['file']['tmp_name'], $upfile)) {
                $error .= "<p>Error al subir la imagen.</p>";
                return $return = array('resultado' => false, 'error' => $error, 'datos' => "");
            }
            //$upfile = substr($upfile, 1); //$upfile = './media/'.$nombreFichero;
            $nombreFichero = $_FILES['file']['name'];
            $upfile = MEDIA_PATH . $nombreFichero;
            return $return = array('resultado' => true, 'error' => $error, 'datos' => $upfile);
        }
        return '';
    } else {
        return $return = array('resultado' => false, 'error' => $error, 'datos' => "");
    }
}

function remove_files() {
    $name = $_POST['filename'];
    if (file_exists(MEDIA_PATH . $name)) {
        unlink(MEDIA_PATH . $name);
        return true;
    } else {
        return false;
    }
}