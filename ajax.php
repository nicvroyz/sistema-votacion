<?php
// Incluye la conexión a la base de datos y funciones
include('db/connection.php');
include('db/functions.php');

// Verifica si se recibió una solicitud AJAX
if (isset($_POST['action'])) {
    // Maneja la solicitud de obtener provincias
    if ($_POST['action'] == 'get_provincias' && isset($_POST['region_id'])) {
        $regionId = $_POST['region_id'];
        $provincias = obtenerProvinciasPorRegion($regionId);

        // Genera las opciones de provincia
        foreach ($provincias as $provincia) {
            echo '<option value="' . $provincia['id'] . '">' . $provincia['provincia'] . '</option>';
        }
    }

    // Maneja la solicitud de obtener comunas
    elseif ($_POST['action'] == 'get_comunas' && isset($_POST['provincia_id'])) {
        $provinciaId = $_POST['provincia_id'];
        $comunas = obtenerComunasPorProvincia($provinciaId);

        // Genera las opciones de comuna
        foreach ($comunas as $comuna) {
            echo '<option value="' . $comuna['id'] . '">' . $comuna['comuna'] . '</option>';
        }
    }
}
?>
