<?php
class controller_contact {
    public function __construct() {
        $_SESSION['module'] = "contact";
    }
    
    /**
     * Send an email to client with the information that's filled in the form and send a copy to admin
     * 
     * @return mixed[] Return an array containing a token, a name, an email, a subject and a message which has been filled
     * by the user previously
     */

    public function process_contact() {
        if ($_POST['token'] === "contact_form") {
            //////////////// Send the email to client
            $arrArgument = array(
                'type' => 'contact',
                'token' => '',
                'inputName' => $_POST['inputName'],
                'inputEmail' => $_POST['inputEmail'],
                'inputSubject' => $_POST['inputSubject'],
                'inputMessage' => $_POST['inputMessage']
            );
            set_error_handler('ErrorHandler');
            try {
                /*
                if (enviar_email($arrArgument)) {
                    $value = true;
                } else {
                    $value = false;
                }*/
                
                enviar_email($arrArgument);
                
            } catch (Exception $e) {
                $value = false;
            }
            restore_error_handler();


            //////////////// Send the email to admin of the app web
            $arrArgument = array(
                'type' => 'admin',
                'token' => '',
                'inputName' => $_POST['inputName'],
                'inputEmail' => "segui.guerola@gmail.com",
                'inputSubject' => $_POST['inputSubject'],
                'inputMessage' => $_POST['inputMessage']
            );
            set_error_handler('ErrorHandler');
            try {
                /*
                if (enviar_email($arrArgument) && $value) {
                    echo "true|Tu mensaje ha sido enviado correctamente ";
                } else {
                    echo  "false|Error en el servidor. Intentelo más tarde...";
                }*/
                
                sleep(5);
                enviar_email($arrArgument);
                echo "true|Tu mensaje ha sido enviado correctamente";
                
            } catch (Exception $e) {
                echo "false|Error en el servidor. Intentelo más tarde...";
            }
            restore_error_handler();
        } else {
            echo  "false|Error en el servidor. Intentelo más tarde...";
        }
    }

}
