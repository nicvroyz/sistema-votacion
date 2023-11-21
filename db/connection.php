<?php
    $host = 'localhost';
    $dbname = 'sisvotacion_db';
    $username = 'user_db';
    $password = 'sisvotacion23';

    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        echo "Error de conexión: " . $e->getMessage();
        die();
    }
?>