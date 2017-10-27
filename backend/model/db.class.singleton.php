<?php
class Db {
    private $servidor;
    private $usuario;
    private $password;
    private $base_datos;
    private $link;
    private $stmt;
    private $array;
    static $_instance;

    private function __construct() {
        $this->setConexion();
        $this->conectar();
    }

    private function setConexion() {
        require_once 'conf.class.singleton.php';
        $conf = Conf::getInstance();

        $this->servidor = $conf->_hostdb;
        $this->base_datos = $conf->_db;
        $this->usuario = $conf->_userdb;
        $this->password = $conf->_passdb;
    }

    private function __clone() {
        
    }

    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }

    private function conectar() {
        $this->link = new mysqli($this->servidor, $this->usuario, $this->password);
        $this->link->select_db($this->base_datos);
    }

    public function ejecutar($sql) {
        $this->stmt = $this->link->query($sql);
        return $this->stmt;
    }

    public function listar($stmt) {
        $this->array = array();
        while ($row = $stmt->fetch_array(MYSQLI_ASSOC)) {
            array_push($this->array, $row);
        }
        return $this->array;
    }

}
