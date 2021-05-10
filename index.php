<?php
	$stun_server = "stun:<stun-server>:3478";
	$turn_server = "turn:<turn-server>:5349";
	$turn_expiry = 86400;
	$turn_username = time() + $turn_expiry;
	$turn_secret = '<static-auth-secret from turn-server config>';
	$turn_password = base64_encode ( hash_hmac ( 'sha1', $turn_username, $turn_secret, true ) );

	function callback($buffer)
	{
		global $stun_server, $turn_server, $turn_username, $turn_password;
		$buffer = str_replace("xxx_stun_servers_xxx", $stun_server, $buffer);
		$buffer = str_replace("xxx_turn_servers_xxx", $turn_server, $buffer);
		$buffer = str_replace("xxx_username_xxx", $turn_username, $buffer);
		$buffer = str_replace("xxx_password_xxx", $turn_password, $buffer);
		return ($buffer);
	}
	ob_start("callback");
	include 'index.html';
	ob_end_flush();
?>
