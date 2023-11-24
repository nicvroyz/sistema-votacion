// Se incluye la librería jQuery para el manejo de AJAX 
if (typeof jQuery == 'undefined') {
    document.write('<script src="https://code.jquery.com/jquery-3.6.4.min.js"><\/script>');
}

// Validaciones 
// Funciones de validación en tiempo real
function asignarValidaciones() {
    // Event listener para el campo de "Nombre y Apellido"
    $('#nombre_apellido').on('input', validarNombreApellido);

    // Event listener para el campo de "RUT"
    $('#rut').on('input', function () {
        validarRUT();
        validarRUTDuplicado();
    });

    // Event listener para el campo de "Email"
    $('#email').on('input', validarEmail);

    // Event listener para el campo de "Alias"
    $('#alias').on('input', validarAlias);

    // Event listener para el combo de "Región", "Provincia" y "Comuna"
    $('#region, #provincia, #comuna').on('change', validarRegionProvinciaComuna);

    // Event listener para el combo de "Candidato"
    $('#candidato').on('change', validarCandidato);

    // Event listener para los checkboxes de "Como se enteró de Nosotros"
    $('input[name="como_se_entero[]"]').on('change', validarComoSeEntero);

    // Añadir más funciones de validación en tiempo real según tus necesidades
}


    // Función para validar el campo de "Nombre y Apellido"
    function validarNombreApellido() {
        var nombreApellidoInput = 'nombre_apellido';
        var nombreApellidoValue = $('#' + nombreApellidoInput).val();

        if (!nombreApellidoValue.trim()) {
            mostrarError(nombreApellidoInput, 'El Nombre y Apellido no debe quedar en blanco.');
        } else {
            quitarError(nombreApellidoInput);
        }
    }

    // Función para validar el campo de "Alias"
    function validarAlias() {
        var aliasInput = 'alias';
        var aliasValue = $('#' + aliasInput).val();

        if (aliasValue.length < 6 || !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(aliasValue)) {
            mostrarError(aliasInput, 'El Alias debe tener al menos 6 caracteres y contener letras y números.');
        } else {
            quitarError(aliasInput);
        }
    }

    // Función para validar el campo de "RUT"
    function validarRUT() {
        var rutInput = 'rut';
        var rutValue = $('#' + rutInput).val();

        // Realizar una solicitud AJAX
        $.ajax({
            type: 'POST',
            url: 'validar_rut.php', 
            data: { rut: rutValue },
            success: function (response) {
                if (response === 'true') {
                    // Validar duplicado de RUT después de verificar su formato
                    validarRUTDuplicado(rutInput, rutValue);
                } else {
                    mostrarError(rutInput, 'El RUT no es válido.');
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    // Función para validar el campo de "Email"
    function validarEmail() {
        var emailInput = 'email';
        var emailValue = $('#' + emailInput).val();

        // Utiliza una expresión regular para validar el formato del correo electrónico
        var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(emailValue)) {
            mostrarError(emailInput, 'El formato del correo electrónico no es válido.');
        } else {
            quitarError(emailInput);
        }
    }

    // Función para validar los combos de "Región", "Provincia" y "Comuna"
    function validarRegionProvinciaComuna() {
        var regionSelect = 'region';
        var provinciaSelect = 'provincia';
        var comunaSelect = 'comuna';

        var regionValue = $('#' + regionSelect).val();
        var provinciaValue = $('#' + provinciaSelect).val();
        var comunaValue = $('#' + comunaSelect).val();

        if (regionValue === '' || provinciaValue === '' || comunaValue === '') {
            mostrarError('error-container', 'Los campos Región, Provincia y Comuna no deben quedar en blanco.');
            return false;
        } else {
            quitarError('error-container');
            return true;
        }
    }

    // Función para validar el combo de "Candidato"
    function validarCandidato() {
        var candidatoSelect = 'candidato';

        if ($('#' + candidatoSelect).val() === '') {
            mostrarError('error-container', 'El campo Candidato no debe quedar en blanco.');
        } else {
            quitarError('error-container');
        }
    }

    // Función para validar los checkboxes de "Como se enteró de Nosotros"
    function validarComoSeEntero() {
        var checkboxesComoSeEntero = $('input[name="como_se_entero[]"]');
        
        // Contar cuántos checkboxes están marcados
        var checkboxesMarcados = checkboxesComoSeEntero.filter(':checked').length;

        if (checkboxesMarcados < 2) {
            // Mostrar error
            mostrarError('error-container', 'Debe elegir al menos dos opciones en "Como se enteró de Nosotros".');
        } else {
            // No hay error, quitar mensaje de error
            quitarError('error-container');
        }
    }

    // Función para validar el RUT duplicado
    function validarRUTDuplicado(rutInput, rutValue) {
        $.ajax({
            type: 'POST',
            url: 'procesar_voto.php', 
            data: { action: 'validar_rut_duplicado', rut: rutValue },
            success: function (response) {
                if (response === 'true') {
                    quitarError(rutInput); // El RUT no está duplicado
                } else {
                    mostrarError(rutInput, 'Ya se ha registrado un voto con este RUT.');
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    // Función para mostrar un mensaje de error
    function mostrarError(contenedor, mensaje) {
        // Muestra los mensajes de error en el contenedor de errores
        var errorContainer = $('#' + contenedor);
    
        // Borra mensajes anteriores
        errorContainer.empty();
    
        // Agrega el nuevo mensaje de error
        errorContainer.append('<p class="alert alert-danger">' + mensaje + '</p>');
    
        // Loguea el mensaje en la consola para propósitos de depuración
        console.log(mensaje);
    }

    // Función para quitar el mensaje de error
    function quitarError(contenedor) {
        // Limpia el contenido del contenedor de errores
        $('#' + contenedor).empty();
    }

    // Validación final del formulario antes de enviarlo al servidor
    function validarFormulario() {
        var esValido = true;
    
        esValido = esValido && validarNombreApellido();
        esValido = esValido && validarRUT();
        esValido = esValido && !validarRUTDuplicado();
        esValido = esValido && validarEmail();
        esValido = esValido && validarAlias();
        esValido = esValido && validarRegionProvinciaComuna();
        esValido = esValido && validarCandidato();
        esValido = esValido && validarComoSeEntero();
    
        return esValido;
    };
