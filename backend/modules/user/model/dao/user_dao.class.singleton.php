<?php
class user_dao {
    static $_instance;

    private function __construct() {
        
    }

    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }

    public function create_user_DAO($db, $arrArgument) {
        $usuario = $arrArgument['usuario'];
        $dni = $arrArgument['dni'];
        $nombre = $arrArgument['nombre'];
        $apellidos = $arrArgument['apellidos'];
        $email = $arrArgument['email'];
        $password = $arrArgument['password'];
        $date_birthday = $arrArgument['date_birthday'];
        $tipo = $arrArgument['tipo'];
        $bank = $arrArgument['bank'];
        $avatar = $arrArgument['avatar'];
        $pais = " ";
        $provincia = " ";
        $poblacion = " ";
        $valoracion = " ";
        $token = $arrArgument['token'];
        if ($arrArgument['activado'])
            $activado = $arrArgument['activado'];
        else
            $activado = 0;

        $sql = "INSERT INTO usuarios (usuario, email, nombre, apellidos, dni,"
                . " password, date_birthday, tipo, bank, pais, provincia, poblacion, avatar, valoracion, activado, token"
                . " ) VALUES ('$usuario', '$email', '$nombre',"
                . " '$apellidos', '$dni', '$password', '$date_birthday', '$tipo', '$bank','$pais','$provincia','$poblacion', '$avatar', '$valoracion', '$activado','$token')";
        return $db->ejecutar($sql);
    }

    public function obtain_paises_DAO($url){
          $ch = curl_init();
          curl_setopt ($ch, CURLOPT_URL, $url);
          curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
          curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
          $file_contents = curl_exec($ch);

          $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
          curl_close($ch);
          $accepted_response = array(200, 301, 302);
          if(!in_array($httpcode, $accepted_response)){
            return FALSE;
          }else{
            return ($file_contents) ? $file_contents : FALSE;
          }
    }

    public function obtain_provincias_DAO() {
        $json = array();
        $tmp = array();

        $provincias = simplexml_load_file(RESOURCES . "provinciasypoblaciones.xml");
        $result = $provincias->xpath("/lista/provincia/nombre | /lista/provincia/@id");
        for ($i = 0; $i < count($result); $i+=2) {
            $e = $i + 1;
            $provincia = $result[$e];
            $tmp = array(
                'id' => (string) $result[$i], 'nombre' => (string) $provincia
            );
            array_push($json, $tmp);
        }
        return $json;
    }

    public function obtain_poblaciones_DAO($arrArgument) {
        $json = array();
        $tmp = array();

        $filter = (string) $arrArgument;
        $xml = simplexml_load_file(RESOURCES . 'provinciasypoblaciones.xml');
        $result = $xml->xpath("/lista/provincia[@id='$filter']/localidades");

        for ($i = 0; $i < count($result[0]); $i++) {
            $tmp = array(
                'poblacion' => (string) $result[0]->localidad[$i]
            );
            array_push($json, $tmp);
        }
        return $json;
    }

    public function count_DAO($db, $arrArgument) {
        /* $arrArgument is composed by 2 array ("column" and "like"), this iterates 
         * the number of positions the array have, this way we get a method that builds a
         * custom sql to select with the needed arguments
         */
        $i = count($arrArgument['column']);
        $sql = "SELECT COUNT(*) as total FROM usuarios WHERE ";

        for ($j = 0; $j < $i; $j++) {
            if ($i > 1 && $j != 0)
                $sql.=" AND ";
            $sql .= $arrArgument['column'][$j] . " like '" . $arrArgument['like'][$j] . "'";
        }

        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function select_DAO($db, $arrArgument) {
        $i = count($arrArgument['column']);
        $k = count($arrArgument['field']);
        $sql1 = "SELECT ";
        $sql2 = " FROM usuarios WHERE ";

        for ($j = 0; $j < $i; $j++) {
            if ($i > 1 && $j != 0)
                $sql.=" AND ";
            $sql .= $arrArgument['column'][$j] . " like '" . $arrArgument['like'][$j] . "'";
        }

        for ($l = 0; $l < $k; $l++) {
            if ($l > 1 && $k != 0)
                $fields.=", ";
            $fields .= $arrArgument['field'][$l];
        }

        $sql = $sql1 . $fields . $sql2 . $sql;
        $stmt = $db->ejecutar($sql);
        return $db->listar($stmt);
    }

    public function update_DAO($db, $arrArgument) {
        /*
         * @param= $arrArgument( column => array(colum),
         *                          like => array(like),
         *                          field => array(field),
         *                          new => array(new)
         *                      );
         */
        $i = count($arrArgument['field']);
        $k = count($arrArgument['column']);

        $sql1 = "UPDATE usuarios SET ";
        $sql2 = "  WHERE ";

        for ($j = 0; $j < $i; $j++) {
            if ($i > 1 && $j != 0)
                $change.=", ";
            $change .= $arrArgument['field'][$j] . "='" . $arrArgument['new'][$j] . "'";
        }
        for ($l = 0; $l < $k; $l++) {
            if ($k > 1 && $l != 0)
                $sql.=" AND ";
            $sql .= $arrArgument['column'][$l] . " like '" . $arrArgument['like'][$l] . "'";
        }

        $sql = $sql1 . $change . $sql2 . $sql;
        return $db->ejecutar($sql);
    }
}
