<?php

// Incluye la conexión a la base de datos
require('connection.php');

// Función para obtener las regiones
function obtenerRegiones() {
    global $conn;
    $query = $conn->query("SELECT id, region FROM regiones");
    return $query->fetchAll(PDO::FETCH_ASSOC);
}

// Función para obtener las provincias de una región específica
function obtenerProvinciasPorRegion($regionId) {
    global $conn;
    $query = $conn->prepare("SELECT id, provincia FROM provincias WHERE region_id = ?");
    $query->execute([$regionId]);
    return $query->fetchAll(PDO::FETCH_ASSOC);
}

// Función para obtener las comunas de una provincia específica
function obtenerComunasPorProvincia($provinciaId) {
    global $conn;
    $query = $conn->prepare("SELECT id, comuna FROM comunas WHERE provincia_id = ?");
    $query->execute([$provinciaId]);
    return $query->fetchAll(PDO::FETCH_ASSOC);
}

// Función para obtener candidatos

function obtenerCandidatos() {
    global $conn;
    $sql = "SELECT id, nombre, partido, descripcion FROM candidatos";
    $result = $conn->query($sql);

    $candidatos = [];
    if ($result->rowCount() > 0) {
        while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
            $candidatos[] = $row;
        }
    }
    return $candidatos;
}


?>