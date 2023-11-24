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
    var timerId; // Variable para almacenar el ID del temporizador
    $('#rut').on('input', function () {
        // Limpiar temporizador anterior
        clearTimeout(timerId);
        
        // Configurar un nuevo temporizador
        timerId = setTimeout(function () {
            validarRUT();
            validarRUTDuplicado();
        }, 500); // Establecer un retraso de 500 milisegundos (ajusta según sea necesario)
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

function validarAlias(errores) {
    var aliasInput = 'alias';
    var aliasValue = $('#' + aliasInput).val();

    console.log('Valor del Alias:', aliasValue);

    if (aliasValue.length < 6 || !/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/.test(aliasValue)) {
        errores.push('Alias debe tener al menos 6 caracteres y contener letras y números.');
        mostrarError('error-container', 'Alias debe tener al menos 6 caracteres y contener letras y números.');
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


function validarRUT() {
    return new Promise(function (resolve, reject) {
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
                    validarRUTDuplicado(rutInput, rutValue)
                        .then(function () {
                            quitarError('error-container'); // Limpiar errores anteriores
                            resolve(); // Ambas validaciones pasaron
                        })
                        .catch(function (error) {
                            mostrarError('error-container', error);
                            reject(error); // Error en la validación de duplicado
                        });
                } else {
                    mostrarError('error-container', 'El RUT no es válido.');
                    reject('El RUT no es válido.');
                }
            },
            error: function (error) {
                console.log(error);
                mostrarError('error-container', 'Error en la validación del RUT.');
                reject('Error en la validación del RUT.');
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
    
    // Contar cuántos checkboxes están marcados
    var checkboxesMarcados = checkboxesComoSeEntero.filter(':checked').length;

    if (checkboxesMarcados < 2) {
        // Agregar error al array
        errores.push('Debe elegir al menos dos opciones en "Como se enteró de Nosotros".');
        // Mostrar errores después de completar todas las validaciones
        mostrarErrores('error-container', errores);
        return false;
    } else {
        // No hay error, quitar mensaje de error
        quitarError('error-container');
        return true;
    }
}

// Función para mostrar un mensaje de error
function mostrarError(contenedor, mensaje) {
    var errorContainer = $('#' + contenedor);
    errorContainer.empty().removeClass('is-valid').addClass('is-invalid');
    errorContainer.append('<p class="alert alert-danger error-message">' + mensaje + '</p>');

    console.log(mensaje);
}
// Función para mostrar múltiples errores en el contenedor y aplicar clase de Bootstrap
function mostrarErrores(contenedor, errores) {
    // Muestra los mensajes de error en el contenedor de errores
    var errorContainer = $('#' + contenedor);

    // Borra mensajes anteriores y clases de Bootstrap
    errorContainer.empty().removeClass('is-valid').addClass('is-invalid');

    // Agrega los nuevos mensajes de error
    for (var i = 0; i < errores.length; i++) {
        errorContainer.append('<p class="alert alert-danger">' + errores[i] + '</p>');
    }

    // Loguea los mensajes en la consola para propósitos de depuración
    console.log(errores);
}
// Función para quitar el mensaje de error y marcar el campo como válido
function quitarError(contenedor, inputId) {
    // Limpia el contenido del contenedor de errores
    $('#' + contenedor).empty().removeClass('is-invalid').addClass('is-valid');
    // También elimina cualquier elemento con la clase error-message
    $('.error-message').remove();

}

// Función para quitar todos los mensajes de error del contenedor y marcar el campo como válido
function quitarErrores(contenedor) {
    // Limpia el contenido del contenedor de errores y aplica clase de Bootstrap
    var errorContainer = $('#' + contenedor).empty();
    errorContainer.removeClass('is-invalid').addClass('is-valid');
}

function validarFormulario() {
    quitarErrores('error-container');
    var errores = [];

    // Llama a las funciones de validación y agrega los errores al array
    validarNombreApellido(errores);
    validarRUT(errores);
    validarEmail(errores);
    validarAlias(errores);
    validarRegionProvinciaComuna(errores);
    validarCandidato(errores);
    validarComoSeEntero(errores);

    // Si hay errores, muéstralos en el contenedor y evita el envío del formulario
    if (errores.length > 0) {
        mostrarErrores('error-container', errores);
        return false;
    }

    // Si no hay errores, continúa con el envío del formulario (puedes agregar aquí la lógica AJAX si es necesario)
    console.log('Formulario válido. Enviando...');
    return true;
}