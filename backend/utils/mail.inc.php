<?php
header('Content-Type: text/html; charset=UTF-8');
function enviar_email($arr) {
    $html = '';
    $subject = '';
    $body = '';
    $ruta = '';
    $return = '';

    switch ($arr['type']) {
        case 'alta':
            $subject = 'Tu Alta en JoinElderly';
            $ruta = "<a href='http://".$_SERVER['HTTP_HOST']."/4_AngularJS/3_proj_final_AngularJS/JoinElderly/#/user/activar/" . $arr['token'] . "'>aqu&iacute;</a>";
            $body = 'Gracias por unirte a nuestra aplicaci&oacute;n. Para finalizar el registro, pulsa ' . $ruta;
            break;

        case 'modificacion':
            $subject = 'Tu Nuevo Password en JoinElderly';
            $ruta = "<a href='http://".$_SERVER['HTTP_HOST']."/4_AngularJS/3_proj_final_AngularJS/JoinElderly/#/user/cambiarpass/" . $arr['token'] . "'>aqu&iacute;</a>";
            $body = 'Para recordar tu password pulsa ' . $ruta;
            break;

        case 'contact':
            $subject = 'Tu Petici&oacute;n a JoinElderly ha sido enviada<br>';
            $ruta = '<a href="http://'.$_SERVER['HTTP_HOST'].'/4_AngularJS/3_proj_final_AngularJS/JoinElderly/#/"' . '>aqu&iacute;</a>';
            $body = 'Para visitar nuestra web, pulsa ' . $ruta;
            break;

        case 'admin':
            $subject = $arr['inputSubject'];
            $body = 'inputName: ' . $arr['inputName'] . '<br>' .
                    'inputEmail: ' . $arr['inputEmail'] . '<br>' .
                    'inputSubject: ' . $arr['inputSubject'] . '<br>' .
                    'inputMessage: ' . $arr['inputMessage'];
            break;
    }

    $html .= "<html>";
    $html .= "<head>";
    $html .= "<meta charset='utf-8' />
    <style>
            * {
                margin: 0;
                padding: 0;
                text-align: center;
              }

            body {
                margin: 0 auto;
                width: 600px;
                height: 300px;
            }
              
            header {
                padding: 20px;
                background-color: blue;
                color: white;
                padding-left: 20px;
                font-size: 25px;
            }
               
            section {
                padding-top: 50px;
                padding-left: 50px;
                margin-top: 3px;
                margin-bottom: 3px;
                height: 100px;
                background-color: ghostwhite;
              }
              
             footer {
                padding: 5px;
                padding-left: 20px;
                background-color: blue;
                color: white;
              }
        </style>";
    $html .= "</head>";
    $html .= "<body>";
    $html .= "<header>";
    $html .= "<p>" . $subject . "</p>";
    $html .= "</header>";
    $html .= "<section>";
    $html .= $body;
    $html .= "</section>";
    $html .= "<footer>";
    $html .= "<p>Enviado por JOINELDERLY</p>";
    $html .= "</footer>";
    $html .= "</body>";
    $html .= "</html>";

    set_error_handler('ErrorHandler');
    try {
        $mail = email::getInstance();
        $mail->name = $arr['inputName'];
        if ($arr['type'] === 'admin')
            $mail->address = 'ruralshoponti@gmail.com';
        else
            $mail->address = $arr['inputEmail'];
        $mail->subject = $subject;
        $mail->body = $html;
    } catch (Exception $e) {
        $return = 0;
    }
    restore_error_handler();

    /*
    if ($mail->enviar()) {
        $return = 1;
    } else {
        $return = 0;
    }
    return $return;
    */
    
    $return = $mail->enviar();
    return $return;
}
