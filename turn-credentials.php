<?php
	$stun_server = "stun:<stun-server>:<stun-port>";
	$turn_server = "turns:<turn-server>:<https-turn-port>";
	$turn_expiry = 86400;
	$turn_username = time() + $turn_expiry;
	$turn_secret = '<turn-server static-auth-secret>';
	$turn_password = base64_encode ( hash_hmac ( 'sha1', $turn_username, $turn_secret, true ) );

	$arr = array('1' => $turn_username, '2' => $turn_password, '3' => $stun_server, '4' => $turn_server);
	echo json_encode($arr);
?>