<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Votación</title>
    <!-- CSS aquí -->
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>

<?php
// Se incluyen los archivo's de conexión y funciones de la base de datos
require('db/connection.php');
require('db/functions.php');
// Se obtienen las regiones y los candidatos desde la base de datos
$regiones = obtenerRegiones();
// Obtener el primer ID de región (puedes ajustar esto según tus necesidades)
$primerIdRegion = $regiones[0]['id'];

// Obtener provincias basadas en el primer ID de región
$provincias = obtenerProvinciasPorRegion($primerIdRegion);

// Obtener comunas basadas en el primer ID de provincia
$comunas = obtenerComunasPorProvincia($provincias[0]['id']);

$candidatos = obtenerCandidatos();
?>

<!-- Formulario de votación -->
<div class="container">
    <h1>Sistema de Votación</h1>
    <form id="votingForm" action="procesar_voto.php" method="post">
        <!-- Campo para el nombre y apellido -->
        <label for="nombre_apellido">Nombre y Apellido:</label>
        <input type="text" name="nombre_apellido" required>

        <!-- Campo para el RUT -->
        <label for="rut">RUT:</label>
        <input type="text" name="rut" id="rut" placeholder="Ingrese su RUT (sin puntos ni guiones)" required>

        <!-- Campo para el correo electrónico -->
        <label for="email">Correo Electrónico:</label>
        <input type="email" name="email" required>

        <!-- Campo para el alias -->
        <label for="alias">Alias:</label>
        <input type="text" name="alias" required>

            <!-- Select para la región -->
        <label for="region">Selecciona una región:</label>
        <select name="region" id="region" required>
            <option value="" disabled selected>Selecciona una región</option>
            <?php foreach ($regiones as $region): ?>
                <option value="<?php echo $region['id']; ?>"><?php echo $region['region']; ?></option>
            <?php endforeach; ?>
        </select>

        <!-- Select para la provincia -->
        <label for="provincia">Selecciona una provincia:</label>
        <select name="provincia" id="provincia" required>
            <option value="" disabled selected>Selecciona una provincia</option>
        </select>

        <!-- Select para la comuna -->
        <label for="comuna">Selecciona una comuna:</label>
        <select name="comuna" id="comuna" required>
            <option value="" disabled selected>Selecciona una comuna</option>
        </select>

        <!-- Select para el candidato -->
        <label for="candidato">Selecciona un candidato:</label>
        <select name="candidato" id="candidato" required>
            <option value="" disabled selected>Selecciona un candidato</option>
            <?php foreach ($candidatos as $candidato): ?>
                <option value="<?php echo $candidato['id']; ?>"><?php echo $candidato['nombre']; ?></option>
            <?php endforeach; ?>
        </select>

        <!-- Opciones "Cómo se enteró de nosotros" -->
        <label>Como se enteró de Nosotros:</label>
        <input type="checkbox" name="como_se_entero[]" value="Redes Sociales"> Redes Sociales
        <input type="checkbox" name="como_se_entero[]" value="Prensa"> Prensa
        <input type="checkbox" name="como_se_entero[]" value="Amigos/Familia"> Amigos/Familia
        <input type="checkbox" name="como_se_entero[]" value="Otro"> Otro

        <!-- Botón de envío del formulario -->
        <input type="submit" value="Votar">
    </form>
</div>

<script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
<script src="ajax.php"></script>
<script src="assets/js/validations.js"></script>
<script>
    $(document).ready(function () {
        // Cuando se selecciona una región, cargar las provincias
        $('#region').change(function () {
            var regionId = $(this).val();
            $.ajax({
                type: 'POST',
                url: 'ajax.php',
                data: { action: 'get_provincias', region_id: regionId },
                success: function (response) {
                    $('#provincia').html(response);
                }
            });
        });

        // Cuando se selecciona una provincia, cargar las comunas
        $('#provincia').change(function () {
            var provinciaId = $(this).val();
            $.ajax({
                type: 'POST',
                url: 'ajax.php',
                data: { action: 'get_comunas', provincia_id: provinciaId },
                success: function (response) {
                    $('#comuna').html(response);
                }
            });
        });
    });
</script>
<script>
    $(document).ready(function() {
        $('#votingForm').submit(function(event) {
            // Evitar que el formulario se envíe normalmente
            event.preventDefault();

            // Serializar los datos del formulario
            var formData = $(this).serialize();

            // Enviar la solicitud AJAX
            $.ajax({
                type: 'POST',
                url: 'procesar_voto.php',
                data: formData,
                success: function(response) {
                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });
    });
</script>

</body>
</html>