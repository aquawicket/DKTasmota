//PHP url input variables
//https://www.php.net/manual/en/reserved.variables.get.php

//https://www.w3schools.com/php/func_filesystem_file_put_contents.asp

<?php
//http://192.168.1.78:8000/DKFile.php?f=StringToFile
function StringToFile($file, $string)
{
	  echo file_put_contents($_GET["StringToFile"],"Hello World. Testing!");
}
if($_GET["StringToFile"])
{
	//var file = $_GET["file"];
	//var string = $_GET["string"];
	echo("StringToFile("+file+","+string+")");
}



