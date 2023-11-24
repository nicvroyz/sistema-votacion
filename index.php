<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Votación</title>
    <!-- CSS aquí -->
    <link rel="stylesheet" href="assets/css/styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>

</head>
<body>

<?php
// Se incluyen los archivos de conexión y funciones de la base de datos
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
<div class="container" max-width="500">
    <h1>Sistema de Votación</h1>
    <form id="votingForm" onsubmit="return validarFormulario();" action="procesar_voto.php" method="post">
        <!-- Campo para el nombre y apellido -->
        <div class="form-group">
            <label for="nombre_apellido">Nombre y Apellido:</label>
            <input type="text" name="nombre_apellido" id="nombre_apellido" class="form-control" placeholder="Ingrese su Nombre y Apellido" required>
            <div class="error" id="error-nombre_apellido"></div>
        </div>

        <!-- Campo para el RUT -->
        <div class="form-group">
            <label for="rut">RUT:</label>
            <input type="text" name="rut" id="rut" data-rut-duplicado="false" class="form-control" placeholder="Ingrese su RUT (sin puntos ni guiones)" required>
            <div class="error" id="error-rut"></div>

        </div>

        <!-- Campo para el correo electrónico -->
        <div class="form-group">
            <label for="email">Correo Electrónico:</label>
            <input id="email" type="email" name="email" class="form-control" placeholder="Ingrese su correo" required>
            <div class="error" id="error-email"></div>

        </div>

        <!-- Campo para el alias -->
        <div class="form-group">
            <label for="alias">Alias:</label>
            <input id="alias" type="text" name="alias" class="form-control" placeholder="Ingrese su Alias" required>
            <div class="error" id="error-alias"></div>

        </div>

        <!-- Select para la región -->
        <div class="form-group">
            <label for="region">Selecciona una región:</label>
            <select name="region" id="region" class="form-control" required>
                <option value="" disabled selected>Selecciona una región</option>
                <?php foreach ($regiones as $region): ?>
                    <option value="<?php echo $region['id']; ?>"><?php echo $region['region']; ?></option>
                <?php endforeach; ?>
            </select>
            <div class="error" id="error-region"></div>
        </div>

        <!-- Select para la provincia -->
        <div class="form-group">
            <label for="provincia">Selecciona una provincia:</label>
            <select name="provincia" id="provincia" class="form-control" required>
                <option value="" disabled selected>Selecciona una provincia</option>
            </select>
            <div class="error" id="error-provincia"></div>

        </div>

        <!-- Select para la comuna -->
        <div class="form-group">
            <label for="comuna">Selecciona una comuna:</label>
            <select name="comuna" id="comuna" class="form-control" required>
                <option value="" disabled selected>Selecciona una comuna</option>
            </select>
            <div class="error" id="error-comuna"></div>

        </div>

        <!-- Select para el candidato -->
        <div class="form-group">
            <label for="candidato">Selecciona un candidato:</label>
            <select name="candidato" id="candidato" class="form-control" required>
                <option value="" disabled selected>Selecciona un candidato</option>
                <?php foreach ($candidatos as $candidato): ?>
                    <option value="<?php echo $candidato['id']; ?>"><?php echo $candidato['nombre']; ?></option>
                <?php endforeach; ?>
            </select>
            <div class="error" id="error-candidato"></div>

        </div>

        <!-- Opciones "Cómo se enteró de nosotros" -->
        <div class="form-group">
            <label>Como se enteró de Nosotros:</label>
            <div class="form-check">
                <input type="checkbox" name="como_se_entero[]" value="Redes Sociales" class="form-check-input"> Redes Sociales
            </div>
            <div class="form-check">
                <input type="checkbox" name="como_se_entero[]" value="Prensa" class="form-check-input"> Prensa
            </div>
            <div class="form-check">
                <input type="checkbox" name="como_se_entero[]" value="Amigos/Familia" class="form-check-input"> Amigos/Familia
            </div>
            <div class="form-check">
                <input type="checkbox" name="como_se_entero[]" value="Otro" class="form-check-input"> Otro
            </div>
            <div class="error" id="error-como_se_entero"></div>

        </div>

        <!-- Botón de envío del formulario -->
        <input type="submit" value="Votar" class="btn btn-primary">
    </form>
    <div id="exito" class="exito"></div>
    <div id="error-container" class="error-container"></div>


</div>

<script src="ajax.php"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
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
        asignarValidaciones();
        $('#votingForm').on('submit', function (event) {
            // Evitar que se envíe el formulario si hay errores
            if (!validarFormulario()) {
                event.preventDefault();
                // Mostrar mensaje de error general
                alert('Por favor, corrija los errores antes de enviar el formulario.');
            } else {
                // Mostrar mensaje de éxito
                alert('¡Voto registrado con éxito!');
                // Puedes resetear el formulario aquí si es necesario
                $('#votingForm')[0].reset();
            }
        });


    function mostrarMensaje(response) {
        // Obtener el contenedor de mensajes de error
        var errorContainer = $('#error-container');

        // Limpiar mensajes anteriores
        errorContainer.empty();

        // Mostrar mensaje de éxito o error
        if (response.includes('¡Voto registrado con éxito!')) {
            // Mensaje de éxito (verde)
            errorContainer.html('<p class="alert alert-success">' + response + '</p>');

            // Limpiar el formulario
            $('#votingForm')[0].reset();
        } else {
            // Mensaje de error (rojo)
            errorContainer.html('<p class="alert alert-danger">' + response + '</p>');
        }
    }
});
</script>

</body>
</html>