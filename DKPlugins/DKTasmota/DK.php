<?php
header('Access-Control-Allow-Origin: *');

////////////////////////
function DKINFO($string){
	echo $string;
}
if($_GET["x"]){
	$json = urldecode($_GET["x"]);
	$obj = json_decode($json);
    $func = $obj->func;
    $args = $obj->args;
    $args_length = count($args);
    $values = [];
    for($i=0; $i<$args_length; $i++){
        foreach($args[$i] as $key => $value){
            $values[$i] = $value;
        }
    }
    call_user_func_array($func,$values);

    /*
    //Show the function prototype
    $funcProto = $func."(";
    for($i=0; $i<$args_length; $i++){
        $arg = $args[$i];
        foreach($arg as $key => $value){
            $funcProto = $funcProto.$key;
            if($i<($args_length-1)){
            	$funcProto = $funcProto.",";
            }
        }
    }
    $funcProto = $funcProto.")";
    echo "\n".$funcProto."\n";
    */

    /*
    //Show the function call 
    $funcCall = $func."(";
    $values = [];
    for($i=0; $i<$args_length; $i++){
        $arg = $args[$i];
        foreach($arg as $key => $value){
            $funcCall = $funcCall.$value;
            $values[$i] = $value;
            if($i<($args_length-1)){
            	$funcCall = $funcCall.",";
            }
        }
    }
    $funcCall = $funcCall.")";
    echo "\n".$funcCall."\n";
    */
}

//http://192.168.1.78:8000/DKFile.php?f=StringToFile
function StringToFile($file, $data, $mode)
{    
    if($mode == "FILE_APPEND"){
        echo file_put_contents($file, $data, FILE_APPEND);
    }
    else{
    	echo file_put_contents($file, $data);
    }
}
/*
if($_GET["StringToFile"])
{
	//var file;
	//var string;
	echo StringToFile($_GET["StringToFile"]);
}
*/
/*
function GetTime()
{
	var str;
	str = "Today is " . date("Y/m/d") . "<br>";
    str += "Today is " . date("Y.m.d") . "<br>";
    str += "Today is " . date("Y-m-d") . "<br>";
    str += "Today is " . date("l");
    return "GetTime return string";
    
}
if($_GET["GetTime"])
{
	if(!$_GET["GetTime"]){ echo "DKERROR: GetTime variable empty"; die(); }
	echo GetTime();
}
*/
/*
if(isset($_GET['action'])){
    if(function_exists($_GET['action'])) {    
        $_GET['action']($_GET['param']);
    }
}
*/
/*
$func = filter_var($_GET["func"]);
call_user_func($func);
*/
?>