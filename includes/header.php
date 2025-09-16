<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
  <link id="stylesheet" rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css">
  <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-thin-solid/css/uicons-thin-solid.css">

<header class="header" id="mainHeader">
  <a href="index.php">
    <img src="imagenes/logo.png" alt="Logo">
  </a>
  <nav>
    <ul>
      <li><a href="equipo.php"><i class="fi fi-rr-users-alt"></i> Docentes</a></li>
      <li><a href="Historia.php"><i class="fi fi-rr-chart-tree"></i></i> Salas</a></li>
      <li><a href="Quienes.php"><i class="fi fi-rr-e-learning"></i> Asignaturas</a></li>
      <li><a href="Quienes.php"><i class="fi fi-rr-document"></i> Reportes</a></li>
      <li><a href="Quienes.php"><i class="fi fi-rr-graduation-cap"></i> Generar salas</a></li>
    </ul>
  </nav>
</header>
