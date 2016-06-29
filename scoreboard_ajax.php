<?php
$bdd = new PDO('mysql:host=localhost;dbname=prosinvader;charset=utf8', 'root', '');

$reponse = $bdd->query('SELECT * FROM score ORDER BY id DESC LIMIT 15');
while ($donnees = $reponse->fetch())
{
?>

<div class="lignescore">
	<div class="playername">
	<?php 
	$str = strtr($donnees["name"],'áàâäãåçéèêëíìîïñóòôöõúùûüýÿ', 'aaaaaaceeeeiiiinooooouuuuyy');
	echo $str; ?>
	</div>
	<div class="playerScore">
	<?php echo $donnees["score"]; ?> Points
	</div>
	<div class="cb">
	</div>
</div>

<?php 

}

?>