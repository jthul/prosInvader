<?php
	$score = $_POST["score"];
	$player = $_POST["player"];
	echo $score;
	echo $player;
	
	$bdd = new PDO('mysql:host=localhost;dbname=prosinvader;charset=utf8', 'root', '');
	$req = $bdd->prepare('INSERT INTO score(name,score) VALUES(:name, :score)');
	$req->execute(array(
			'name' => $player,
			'score' => $score
	));
	
	header('Location: index.php?saved=true');
?>