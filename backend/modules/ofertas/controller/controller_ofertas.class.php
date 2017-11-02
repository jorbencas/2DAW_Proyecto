<?php
class controller_ofertas {
    function __construct() {
    }

    /**
     *  We take all offers from BD and we return them
     * 
     * @return mixed[] Returns an array['success']=boolean and if it is true we return the array array['ofertas']=array with all offers.
     */
    function maploader() {
        set_error_handler('ErrorHandler');
        try {
            $arrValue = loadModel(MODEL_OFERTAS, "ofertas_model", "select", array('column' => array('false'), 'field' => array('*')));
        } catch (Exception $e) {
            $arrValue = false;
        }
        restore_error_handler();

        if ($arrValue) {
            $arrArguments['ofertas'] = $arrValue;
            $arrArguments['success'] = true;
            echo json_encode($arrArguments);
        } else {

            $arrArguments['success'] = false;
            $arrArguments['error'] = 503;
            echo json_encode($arrArguments);
        }
    }

    function getOffer() {
        set_error_handler('ErrorHandler');
        try {
            $arrValue = loadModel(MODEL_OFERTAS, "ofertas_model", "select", array('column' => array('idProduct'), 'like' => array($_GET['param']), 'field' => array('*')));
        } catch (Exception $e) {
            $arrValue = false;
        }
        restore_error_handler();

        if ($arrValue) {
            $arrArguments['ofertas'] = $arrValue[0];
            $arrArguments['success'] = true;
            echo json_encode($arrArguments);
        } else {

            $arrArguments['success'] = false;
            $arrArguments['error'] = 503;
            echo json_encode($arrArguments);
        }
    }
    function getCategory() {
        set_error_handler('ErrorHandler');
        try {
            $arrValue = loadModel(MODEL_OFERTAS, "ofertas_model", "selectCategory", array('column' => array('type'), 'like' => array($_GET['param']), 'field' => array('*')));
        } catch (Exception $e) {
            $arrValue = false;
        }
        restore_error_handler();

        if ($arrValue) {
            $arrArguments['ofertas'] = $arrValue;
            $arrArguments['success'] = true;
            echo json_encode($arrArguments);
        } else {

            $arrArguments['success'] = false;
            $arrArguments['error'] = 503;
            echo json_encode($arrArguments);
        }
    }

    // function join() {
    //     set_error_handler('ErrorHandler');
    //     try {
    //         $arrValue = loadModel(MODEL_OFERTAS, "ofertas_model", "update", array('column' => array('id'), 'like' => array($_GET['param']), 'field' => array('asistentes'), 'new' => array($_GET['param2'])));
    //     } catch (Exception $e) {
    //         $arrValue = false;
    //     }
    //     restore_error_handler();

    //     if ($arrValue) {
    //         $arrArguments['datos'] = $_GET['param2'];
    //         $arrArguments['success'] = true;
    //         echo json_encode($arrArguments);
    //     } else {
    //         $arrArguments['success'] = false;
    //         $arrArguments['error'] = 503;
    //         echo json_encode($arrArguments);
    //     }
    // }
}
