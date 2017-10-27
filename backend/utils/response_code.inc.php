<?php
function response_code($code = NULL) {
    if ($code !== NULL) {
        switch ($code) {
            case 100: $text = 'Continue';
                break;
            case 101: $text = 'Switching Protocols';
                break;
            case 200: $text = 'OK';
                break;
            case 201: $text = 'Created';
                break;
            case 202: $text = 'Accepted';
                break;
            case 203: $text = 'Non-Authoritative Information';
                break;
            case 204: $text = 'No Content';
                break;
            case 205: $text = 'Reset Content';
                break;
            case 206: $text = 'Partial Content';
                break;
            case 300: $text = 'Multiple Choices';
                break;
            case 301: $text = 'Moved Permanently';
                break;
            case 302: $text = 'Moved Temporarily';
                break;
            case 303: $text = 'See Other';
                break;
            case 304: $text = 'Not Modified';
                break;
            case 305: $text = 'Use Proxy';
                break;
            case 400: $text = 'Bad Request';
                break;
            case 401: $text = 'Unauthorized';
                break;
            case 402: $text = 'Payment Required';
                break;
            case 403: $text = 'Forbidden';
                break;
            case 404: $text = 'Not Found';
                break;
            case 405: $text = 'Method Not Allowed';
                break;
            case 406: $text = 'Not Acceptable';
                break;
            case 407: $text = 'Proxy Authentication Required';
                break;
            case 408: $text = 'Request Time-out';
                break;
            case 409: $text = 'Conflict';
                break;
            case 410: $text = 'Gone';
                break;
            case 411: $text = 'Length Required';
                break;
            case 412: $text = 'Precondition Failed';
                break;
            case 413: $text = 'Request Entity Too Large';
                break;
            case 414: $text = 'Request-URI Too Large';
                break;
            case 415: $text = 'Unsupported Media Type';
                break;
            case 500: $text = 'Internal Server Error';
                break;
            case 501: $text = 'Not Implemented';
                break;
            case 502: $text = 'Bad Gateway';
                break;
            case 503: $text = 'Service Unavailable';
                break;
            case 504: $text = 'Gateway Time-out';
                break;
            case 505: $text = 'HTTP Version not supported';
                break;
            default:
                exit('Unknown http status code "' . htmlentities($code) . '"');
                break;
        }
    } else {
        $code = 200;
    }
    return $return = array('code' => $code, 'text' => $text);
}

function showErrorPage($code = 0, $message = "", $http = "", $num_http = 0) {
    switch ($code) {
        case 0:
            paint_template_error($message);
            die();
            break;
        case 1:
            loadView($num_http);
            break;
        case 2:
            $log = log::getInstance();
            $log->add_log_general($message, $_SESSION['module'], "response " . http_response_code()); //$text, $controller, $function
            $log->add_log_user($message, "", $_SESSION['module'], "response " . http_response_code()); //$msg, $username = "", $controller, $function

            $jsondata["error"] = $message;
            header($http, true, $num_http);
            echo json_encode($jsondata);
            exit;
            break;
        case 3:
            paint_template_search($message);
            die();
            break;
         case 4:
            require_once(VIEW_PATH_INC . "header.php");
            require_once(VIEW_PATH_INC . "menu.php");
            loadView($num_http);
            require_once(VIEW_PATH_INC . "footer.html");
            break;
    }
}

function ErrorHandler($errno, $errstr, $errfile, $errline) {
    $error = "";
    switch ($errno) {
        case E_NOTICE:
        case E_USER_NOTICE:
            $error = "Notice";
            break;
        case E_WARNING:
        case E_USER_WARNING:
            $error = "Warning";
            break;
        case E_ERROR:
        case E_USER_ERROR:
            $error = "Fatal Error";
            break;
        default:
            $error = "Unknown Error";
            break;
    }
    $msg = "ERROR: [$errno] $errstr\r\n" . "$error on line $errline in file $errfile\r\n";

    // $log = log::getInstance();
    // $log->add_log_general($msg, $_SESSION['module'], "response " . http_response_code()); //$text, $controller, $function
    // $log->add_log_user($msg, "", $_SESSION['module'], "response " . http_response_code()); //$msg, $username = "", $controller, $function
}
