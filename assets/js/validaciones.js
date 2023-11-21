// Se incluye la librería jQuery para el manejo de AJAX 
if (typeof jQuery == 'undefined') {
    document.write('<script src="https://code.jquery.com/jquery-3.6.4.min.js"><\/script>');
}
// Script JavaScript para manejar las solicitudes AJAX y cargar dinámicamente provincias y comunas -->
include(ajax.php)

// Función que se ejecuta cuando cambia la selección de la región
$(document).ready(function () {
    $('#region').change(function () {
        var regionId = $(this).val();

        // Realiza una solicitud AJAX para obtener las provincias de la región seleccionada
        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            data: { action: 'getProvincias', regionId: regionId },
            success: function (response) {
                // Actualiza el contenido del select de provincias con las opciones recibidas
                $('#provincia').html(response);
                // Limpia el select de comunas cuando se selecciona una nueva región
                $('#comuna').html('<option value="" disabled selected>Selecciona una comuna</option>');
            }
        });
    });

    // Función que se ejecuta cuando cambia la selección de la provincia
    $('#provincia').change(function () {
        var provinciaId = $(this).val();

        // Realiza una solicitud AJAX para obtener las comunas de la provincia seleccionada
        $.ajax({
            url: 'ajax.php',
            type: 'POST',
            data: { action: 'getComunas', provinciaId: provinciaId },
            success: function (response) {
                // Actualiza el contenido del select de comunas con las opciones recibidas
                $('#comuna').html(response);
            }
        });
    });
});
// Validaciones 
document.addEventListener('DOMContentLoaded', function () {
    // Event listener para el campo de "Nombre y Apellido"
    document.getElementById('nombre_apellido').addEventListener('input', validarNombreApellido);

    // Event listener para el campo de "Alias"
    document.getElementById('alias').addEventListener('input', validarAlias);

    // Event listener para el campo de "RUT"
    document.getElementById('rut').addEventListener('input', validarRUT);

    // Event listener para el campo de "Email"
    document.getElementById('email').addEventListener('input', validarEmail);

    // Event listener para el combo de "Región"
    document.getElementById('region').addEventListener('change', validarRegionComuna);

    // Event listener para el combo de "Comuna"
    document.getElementById('comuna').addEventListener('change', validarRegionComuna);

    // Event listener para el combo de "Candidato"
    document.getElementById('candidato').addEventListener('change', validarCandidato);

    // Event listener para los checkboxes de "Como se enteró de Nosotros"
    var checkboxesComoSeEntero = document.getElementsByName('como_se_entero[]');
    checkboxesComoSeEntero.forEach(function (checkbox) {
        checkbox.addEventListener('change', validarComoSeEntero);
    });

    // Función para validar el campo de "Nombre y Apellido"
    function validarNombreApellido() {
        var nombreApellidoInput = document.getElementById('nombre_apellido');
        var nombreApellidoValue = nombreApellidoInput.value;

        if (!nombreApellidoValue.trim()) {
            mostrarError('El Nombre y Apellido no debe quedar en blanco.');
        } else {
            quitarError();
        }
    }

    // Función para validar el campo de "Alias"
    function validarAlias() {
        var aliasInput = document.getElementById('alias');
        var aliasValue = aliasInput.value;

        if (aliasValue.length < 6 || !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(aliasValue)) {
            mostrarError('El Alias debe tener al menos 6 caracteres y contener letras y números.');
        } else {
            quitarError();
        }
    }

    // Función para validar el campo de "RUT"
    function validarRUT() {
        var rutInput = document.getElementById('rut');
        var rutValue = rutInput.value;

        document.getElementById('rut').addEventListener('input', function (e) {
            var rutInput = e.target;
            var formattedRut = rutInput.value.replace(/[^\dKk]/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
            rutInput.value = formattedRut;
        });

        if (!validarRUTChileno(rutValue)) {
            mostrarError('El RUT no es válido.');
        } else {
            quitarError();
        }
    }

    // Función para validar el campo de "Email"
    function validarEmail() {
        var emailInput = document.getElementById('email');
        var emailValue = emailInput.value;

        // Utiliza una expresión regular para validar el formato del correo electrónico
        var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(emailValue)) {
            mostrarError('El formato del correo electrónico no es válido.');
        } else {
            quitarError();
        }
    }

    // Función para validar los combos de "Región" y "Comuna"
    function validarRegionComuna() {
        var regionSelect = document.getElementById('region');
        var comunaSelect = document.getElementById('comuna');

        if (regionSelect.value === '' || comunaSelect.value === '') {
            mostrarError('Los campos Región y Comuna no deben quedar en blanco.');
        } else {
            quitarError();
        }
    }

    // Función para validar el combo de "Candidato"
    function validarCandidato() {
        var candidatoSelect = document.getElementById('candidato');

        if (candidatoSelect.value === '') {
            mostrarError('El campo Candidato no debe quedar en blanco.');
        } else {
            quitarError();
        }
    }

    // Función para validar los checkboxes de "Como se enteró de Nosotros"
    function validarComoSeEntero() {
        var checkboxesSeleccionados = Array.from(checkboxesComoSeEntero).filter(function (checkbox) {
            return checkbox.checked;
        });

        if (checkboxesSeleccionados.length < 2) {
            mostrarError('Debe elegir al menos dos opciones en "Como se enteró de Nosotros".');
        } else {
            quitarError();
        }
    }

    // Función para mostrar un mensaje de error
    function mostrarError(mensaje) {
        console.log(mensaje);
    }

    // Función para quitar el mensaje de error
    function quitarError() {
        // ID del elemento que muestra mensajes de error
        var elementoMensajeError = document.getElementById('mensajeError');

        // Verifica si el elemento existe antes de intentar ocultarlo o limpiar su contenido
        if (elementoMensajeError) {
            // Limpiar el contenido del mensaje
            elementoMensajeError.innerHTML = '';

        }
    }
});
