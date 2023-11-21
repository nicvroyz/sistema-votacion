<?php
// validar_rut.php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $rut = $_POST['rut'];

    // Realiza la validación del RUT según tu lógica
    $esValido = validarRUTChileno($rut);

    // Devuelve la respuesta al cliente
    echo $esValido ? 'valido' : 'invalido';
}

function validarRUTChileno($rut) {
        // Elimina puntos y guiones del RUT
        $rut = preg_replace('/[^0-9kK]/', '', $rut);
   
        // Verifica que el RUT tenga un formato válido
        if (empty($rut) || !ctype_digit($rut)) {
            return false;
        }
    
        // Divide el RUT en número y dígito verificador
        $numero = substr($rut, 0, -1);
        $dv = strtoupper(substr($rut, -1));
    
        // Calcula el dígito verificador esperado
        $m = 0;
        $s = 1;
        for (; $numero; $numero = floor($numero / 10)) {
            $s = ($s + $numero % 10 * (9 - $m++ % 6)) % 11;
        }
        $dv_esperado = chr($s ? $s + 47 : 75);
    
        // Compara el dígito verificador esperado con el proporcionado
        return $dv == $dv_esperado;
        }
    
       // Ejemplo de uso
       $rut = "12.345.678-9";
       if (validarRUTChileno($rut)) {
           echo "El RUT es válido.";
       } else {
           echo "El RUT no es válido.";
       }
   
    // Devuelve true si el RUT es válido, false en caso contrario
    return true;

?>
