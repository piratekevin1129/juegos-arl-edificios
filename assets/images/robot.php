<?php 
$folder = 'salto-2';
$total = count(scandir($folder))-2;

for($i = 1;$i<=$total;$i++){
	$old = '';
	if($i<=9){
		$old = $folder.'/imagen000'.$i.'.png';
	}else{
		$old = $folder.'/imagen00'.$i.'.png';
	}
	$new = $folder.'/imagen'.$i.'.png';
	rename($old,$new);
}

?>