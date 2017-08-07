<?php
$address = $_GET['address'];
$c = file_get_contents($address);
header("Content-type: text/xml");
echo $c;
?>