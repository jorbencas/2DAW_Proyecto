<?php
class ofertas_model {
    private $bll;
    static $_instance;

    private function __construct() {
        $this->bll = ofertas_bll::getInstance();
    }

    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }

    public function create_ofertas($arrArgument) {
        return $this->bll->create_ofertas_BLL($arrArgument);
    }
    
    public function update($arrArgument) {
        return $this->bll->update_BLL($arrArgument);
    }

    public function count($arrArgument) {
        return $this->bll->count_BLL($arrArgument);
    }
    
    public function select($arrArgument) {
        return $this->bll->select_BLL($arrArgument);
    }
}
