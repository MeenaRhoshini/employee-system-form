<?php

class Database {
    private $host = 'localhost';
    private $port = '5432';
    private $db_name = 'employee_management';
    private $username = 'postgres';
    private $password = 'password';
    private static $instance = null;

    private function __construct() {}

    public static function getInstance() {
        if (self::$instance === null) {
            try {
                self::$instance = new PDO(
                    "pgsql:host=" . self::getEnv('DB_HOST', 'localhost') . 
                    ";port=" . self::getEnv('DB_PORT', '5432') . 
                    ";dbname=" . self::getEnv('DB_NAME', 'employee_management'),
                    self::getEnv('DB_USER', 'postgres'),
                    self::getEnv('DB_PASS', 'password'),
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]
                );
                self::$instance->exec("SET NAMES 'utf8'");
            } catch (PDOException $exception) {
                error_log($exception->getMessage(), 3, __DIR__ . '/error_log.log');
                die('Database connection error. Please try again later.');
            }
        }
        return self::$instance;
    }

    private static function getEnv($key, $default = null) {
        return getenv($key) ?: $default;
    }
}
?>