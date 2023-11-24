// Se incluye la librería jQuery para el manejo de AJAX 
if (typeof jQuery == 'undefined') {
    document.write('<script src="https://code.jquery.com/jquery-3.6.4.min.js"><\/script>');
}

// Validaciones 
// Funciones de validación en tiempo real
function asignarValidaciones() {
    // Event listener para el campo de "Nombre y Apellido"
    $('#nombre_apellido').on('input', function () {
        validarNombreApellido([]);
    });

    // Event listener para el campo de "RUT"
    $('#rut').on('input', function () {
        validarRUT([]);
        validarRUTDuplicado();
    });

    // Event listener para el campo de "Email"
    $('#email').on('input', function () {
        validarEmail([]);
    });

    // Event listener para el campo de "Alias"
    $('#alias').on('input', function () {
        validarAlias([]);
    });

    // Event listener para el combo de "Región", "Provincia" y "Comuna"
    $('#region, #provincia, #comuna').on('change', function () {
        validarRegionProvinciaComuna([]);
    });

    // Event listener para el combo de "Candidato"
    $('#candidato').on('change', function () {
        validarCandidato([]);
    });

    // Event listener para los checkboxes de "Como se enteró de Nosotros"
    $('input[name="como_se_entero[]"]').on('change', function () {
        validarComoSeEntero([]);
    });

    // Añadir más funciones de validación en tiempo real según tus necesidades
}

// Función para validar el campo de "Nombre y Apellido"
function validarNombreApellido(errores) {
    var nombreApellidoInput = 'nombre_apellido';
    var nombreApellidoValue = $('#' + nombreApellidoInput).val();

    if (!nombreApellidoValue.trim()) {
        errores.push('El Nombre y Apellido no debe quedar en blanco.');
        mostrarError('error-container', 'El Nombre y Apellido no debe quedar en blanco.');
    } else {
        quitarError('error-container');
    }
}

// Función para validar el campo de "Alias"
function validarAlias(errores) {
    var aliasInput = 'alias';
    var aliasValue = $('#' + aliasInput).val();

    if (aliasValue.length < 6 || !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(aliasValue)) {
        errores.push('El Alias debe tener al menos 6 caracteres y contener letras y números.');
        mostrarError('error-container', 'El Alias debe tener al menos 6 caracteres y contener letras y números.');
    } else {
        quitarError('error-container');
    }
}

// Función para validar el RUT duplicado
function validarRUTDuplicado() {
    var rutInput = 'rut';
    var rutValue = $('#' + rutInput).val();

    $.ajax({
        type: 'POST',
        url: 'procesar_voto.php',
        data: { action: 'validar_rut_duplicado', rut: rutValue },
        success: function (response) {
            if (response === 'true') {
                quitarError('error-container'); // El RUT no está duplicado
            } else {
                mostrarError('error-container', 'Ya se ha registrado un voto con este RUT.');
            }
        },
        error: function (error) {
            console.log(error);
            mostrarError('error-container', 'Error en la validación del RUT duplicado.');
        }
    });
}


// Función para validar el RUT
function validarRUT() {
    return new Promise(function (resolve, reject) {
        var rutInput = 'rut';
        var rutValue = $('#' + rutInput).val();

        $.ajax({
            type: 'POST',
            url: 'validar_rut.php',
            data: { rut: rutValue },
            success: function (response) {
                var errores = []; // Array para almacenar errores

                if (response === 'true') {
                    // Validar duplicado de RUT después de verificar su formato
                    validarRUTDuplicado()
                        .then(function () {
                            quitarError('error-container'); // Limpiar errores anteriores
                            resolve(true); // Ambas validaciones pasaron
                        })
                        .catch(function (error) {
                            errores.push(error); // Agregar error al array
                            mostrarErrores('error-container', errores);
                            reject(false); // Error en la validación de duplicado
                        });
                } else {
                    errores.push('El RUT no es válido.'); // Agregar error al array
                    mostrarErrores('error-container', errores);
                    reject(false); // El RUT no es válido
                }
            },
            error: function (error) {
                console.log(error);
                errores.push('Error en la validación del RUT.'); // Agregar error al array
                mostrarErrores('error-container', errores);
                reject(false); // Error en la validación del RUT
            }
        });
    });
}

// Función para validar el campo de "Email"
function validarEmail(errores) {
    var emailInput = 'email';
    var emailValue = $('#' + emailInput).val();

    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(emailValue)) {
        errores.push('El formato del correo electrónico no es válido.');
        mostrarError('error-container', 'El formato del correo electrónico no es válido.');
    } else {
        quitarError('error-container');
    }
}

// Función para validar los combos de "Región", "Provincia" y "Comuna"
function validarRegionProvinciaComuna(errores) {
    var regionSelect = 'region';
    var provinciaSelect = 'provincia';
    var comunaSelect = 'comuna';

    var regionValue = $('#' + regionSelect).val();
    var provinciaValue = $('#' + provinciaSelect).val();
    var comunaValue = $('#' + comunaSelect).val();

    if (regionValue === '' || provinciaValue === '' || comunaValue === '') {
        errores.push('Los campos Región, Provincia y Comuna no deben quedar en blanco.');
        mostrarError('error-container', 'Los campos Región, Provincia y Comuna no deben quedar en blanco.');
    } else {
        quitarError('error-container');
    }
}

// Función para validar el combo de "Candidato"
function validarCandidato(errores) {
    var candidatoSelect = 'candidato';

    if ($('#' + candidatoSelect).val() === '') {
        errores.push('El campo Candidato no debe quedar en blanco.');
        mostrarError('error-container', 'El campo Candidato no debe quedar en blanco.');
    } else {
        quitarError('error-container');
    }
}

// Función para validar los checkboxes de "Como se enteró de Nosotros"
function validarComoSeEntero(errores) {
    var checkboxesComoSeEntero = $('input[name="como_se_entero[]"]');
    var checkboxesMarcados = checkboxesComoSeEntero.filter(':checked').length;

    if (checkboxesMarcados < 2) {
        errores.push('Debe elegir al menos dos opciones en "Como se enteró de Nosotros".');
        mostrarErrores('error-container', errores);
    } else {
        quitarError('error-container');
    }
}

// Función para mostrar un mensaje de error
function mostrarError(contenedor, mensaje) {
    var errorContainer = $('#' + contenedor);
    errorContainer.empty();
    errorContainer.append('<p class="alert alert-danger">' + mensaje + '</p>');
    console.log(mensaje);
}

// Función para mostrar múltiples errores en el contenedor
function mostrarErrores(contenedor, errores) {
    var errorContainer = $('#' + contenedor);
    errorContainer.empty();
    for (var i = 0; i < errores.length; i++) {
        errorContainer.append('<p class="alert alert-danger">' + errores[i] + '</p>');
    }
    console.log(errores);
}

// Función para quitar el mensaje de error
function quitarError(contenedor) {
    $('#' + contenedor).empty();
}

// Función para quitar todos los mensajes de error del contenedor
function quitarErrores(contenedor) {
    $('#' + contenedor).empty();
}