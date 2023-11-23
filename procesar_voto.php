<?php
require('validar_rut.php');
// Verifica si se ha enviado el formulario
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Obtén los datos del formulario
    $candidatoId = $_POST['candidato'];
    $regionId = $_POST['region'];
    $provinciaId = $_POST['provincia'];
    $comunaId = $_POST['comuna'];
    // Agrega otros campos del formulario según sea necesario

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
    $rutDuplicado = verificarRUTDuplicado($rut);
    if ($rutDuplicado) {
        $errores[] = "Ya se ha registrado un voto con este RUT.";
    }

    // Manejo de errores
    if (!empty($errores)) {
        foreach ($errores as $error) {
            echo $error . "<br>";
        }
    } else {
        // Si no hay errores, procesa el voto y guarda en la base de datos
        try {
            // Conexión a la base de datos
            include('db/connection.php');

            // Asegúrate de que el candidato y la región existan antes de insertar el voto
            $query = $conn->prepare("INSERT INTO votantes (candidato_id, region_id, provincia_id, comuna_id) VALUES (?, ?, ?, ?)");
            $query->execute([$candidatoId, $regionId, $provinciaId, $comunaId]);

            echo "¡Voto registrado con éxito!";
        } catch (PDOException $e) {
            echo "Error al procesar el voto: " . $e->getMessage();
        }
    }
}


// Función para verificar duplicación de votos por RUT
function verificarRUTDuplicado($rut) {
    // lógica para verificar si ya existe un voto con este RUT
    global $conn;

    try {
        // Preparar la consulta
        $query = $conn->prepare("SELECT COUNT(*) as count FROM votantes WHERE rut = ?");
        $query->execute([$rut]);

        // Obtener el resultado
        $result = $query->fetch(PDO::FETCH_ASSOC);

        // Verificar si hay algún registro con el mismo RUT
        return ($result['count'] > 0);
    } catch (PDOException $e) {
        // Manejar errores de la base de datos
        echo "Error al verificar duplicación de RUT: " . $e->getMessage();
        return false;
    }
}  return false;

?>
