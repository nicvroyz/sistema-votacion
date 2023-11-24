<?php
require('validar_rut.php');
require('db/connection.php');

// Verifica si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $candidatoId = $_POST['candidato'] ?? null;
    $regionId = $_POST['region'] ?? null;
    $provinciaId = $_POST['provincia'] ?? null;
    $comunaId = $_POST['comuna'] ?? null;
    $nombreApellido = $_POST['nombre_apellido'] ?? null;  // Agregado
    $rut = $_POST['rut'] ?? null;  // Agregado

    // Realiza las validaciones
    $errores = [];

    // Validación de Nombre y Apellido
    $nombreApellido = trim($_POST['nombre_apellido']);
    if (empty($nombreApellido)) {
        $errores[] = "Nombre y Apellido no deben quedar en blanco.";
    }

    // Validación de Alias
    $alias = trim($_POST['alias']);
    if (strlen($alias) <= 5 || !preg_match('/^[a-zA-Z0-9]+$/', $alias)) {
        $errores[] = "Alias debe tener más de 5 caracteres y contener letras y números.";
    }

    // Validación de RUT (formato Chile)
    $rut = trim($_POST['rut']);
    if (!validarRUTChileno($rut)) {
        $errores[] = "RUT no válido.";
    }

    // Validación de Email
    $email = trim($_POST['email']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errores[] = "Correo electrónico no válido.";
    }

    // Validación de Checkbox "Como se enteró de Nosotros"
    $opcionesComoSeEntero = isset($_POST['como_se_entero']) ? $_POST['como_se_entero'] : [];
    if (count($opcionesComoSeEntero) < 2) {
        $errores[] = "Debe elegir al menos dos opciones en 'Como se enteró de Nosotros'.";
    }

    // Validación de duplicación de votos por RUT
    try {
        $rutDuplicado = verificarRUTDuplicado($rut);
        if ($rutDuplicado) {
            $errores[] = "Ya se ha registrado un voto con este RUT.";
        }
    } catch (PDOException $e) {
        // Manejar errores de la base de datos
        echo "Error al verificar duplicación de RUT: " . $e->getMessage();
        throw $e;  // Lanza la excepción nuevamente
    }

    // Manejo de errores
    if (!empty($errores)) {
        // Almacena los errores en una variable para mostrar después
        $mensajeErrores = implode("<br>", $errores);
        echo $mensajeErrores;  // Puedes ajustar esta parte según tus necesidades
    } else {
        try {
            // Conexión a la base de datos 
            include('db/connection.php');

            $query = $conn->prepare("INSERT INTO votantes (rut, nombre, candidato_id, region_id, provincia_id, comuna_id) VALUES (?, ?, ?, ?, ?, ?)");
            $query->execute([$rut, $nombreApellido, $candidatoId, $regionId, $provinciaId, $comunaId]);

            // Si todo va bien, muestra un mensaje de éxito
            echo "¡Voto registrado con éxito!";
        } catch (PDOException $e) {
            // Si hay un error en la base de datos, muestra un mensaje de error
            echo "Error al procesar el voto: " . $e->getMessage();
        } finally {
            // Cerrar la conexión a la base de datos
            $conn = null;
        }
    }
}


// Función para verificar duplicación de votos por RUT
function verificarRUTDuplicado($rut) {
    // lógica para verificar si ya existe un voto con este RUT

    global $conn;

    // Preparar la consulta
    $query = $conn->prepare("SELECT COUNT(*) as count FROM votantes WHERE rut = ?");
    $query->execute([$rut]);
    // Obtener el resultado

    $result = $query->fetch(PDO::FETCH_ASSOC);
    // Verificar si hay algún registro con el mismo RUT


    return ($result['count'] > 0);
}

?>
