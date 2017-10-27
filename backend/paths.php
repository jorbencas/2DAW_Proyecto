<?php
//PROYECTO
define('PROJECT', '/2DAW_Proyecto/backend');

//SITE_ROOT
define('SITE_ROOT', $_SERVER['DOCUMENT_ROOT'] . PROJECT);

//SITE_PATH
define('SITE_PATH', 'http://' . $_SERVER['HTTP_HOST'] . PROJECT);

// //log
// define('USER_LOG_DIR', SITE_ROOT . '/log/user/Site_User_errors.log');
// define('GENERAL_LOG_DIR', SITE_ROOT . '/log/general/Site_General_errors.log');

//production
define('PRODUCTION', true);

//model
define('MODEL_PATH', SITE_ROOT . '/model/');

//modules
define('MODULES_PATH', SITE_ROOT . '/modules/');

//resources
define('RESOURCES', SITE_ROOT . '/resources/');

//media
define('MEDIA_ROOT', SITE_ROOT . '/media/');
define('MEDIA_PATH', SITE_PATH . '/media/');

//utils
define('UTILS', SITE_ROOT . '/utils/');

//Activacio URL amigables
define('URL_AMIGABLES', TRUE);

//libs
define('LIBS', SITE_ROOT . '/libs/');

//classes
define('CLASSES', SITE_ROOT . '/classes/');

//model users
define('UTILS_USER', SITE_ROOT . '/modules/user/utils/');
define('MODEL_USER', SITE_ROOT . '/modules/user/model/model/');

//model ofertas
define('MODEL_OFERTAS', SITE_ROOT . '/modules/ofertas/model/model/');
