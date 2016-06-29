<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta charset="UTF-8"/> 
	<title>Pros Invader</title>
	<link rel="stylesheet" type="text/css" media="screen" href="data/css/prosInvader.css"/>
</head>
<body>
 <audio controls style="display:none;" id="music1">
  	<source src="data/sounds/music1.mp3" type="audio/mp3" >
  		Your browser does not support the audio element.
	</audio> 
	
<audio controls style="display:none;" id="music2">
  	<source src="data/sounds/music2.mp3" type="audio/mp3" >
  		Your browser does not support the audio element.
	</audio> 
	
	<div id="bg-stars">
	</div>
	
	
	<div id="bg-planet">
	</div>
	
	<div id="board">
		<div id="logo" class="menu"></div>
		<div id="keyboard" class="menu"></div>
		<div id="menu" class="menu">
			<ul>
				<li>
					<div class="choice" id="choice_1">Nouvelle partie</div>
				</li>
				<li>
					<div class="choice" id="choice_2">Tableau des scores</div>
				</li>
			</ul>
		</div>
		<div id="lifes"></div>
		<div id="score">SCORE : <span id="score-player">00000000</span></div>
		<div id="message">Level <span id="level-number"></span> is done ! <br/> Brace yourself,<br/> <span class="bigmessage">level <span id="level-number-next"></span> is coming !</span> <br/> <img src="data/css/victoriousGuy.gif" alt="photo julien"></div>
		<div id="messageBoss">Level <span id="level-number"></span> is done ! <br/> Brace yourself,<br/> <span class="bigmessage">Boss is coming !</span> <br/> <img src="data/css/victoriousGuy.gif" alt="photo julien"></div>
		
		<div id="gameOver">GAME OVER <br/> You loose...<br/> Entrez votre nom : <br/><form action="submitScore.php" id="submitplayer" method="post"><input type="hidden" name="score" id="scoreInput"> <input type="text" id="player" name="player" autocomplete="off"/><input type="text" id="eviterEnter" autocomplete="off"/></form> <img src="data/css/losingGuy.gif" alt="photo julien"></div>
		<div id="calque"></div>
		<div id="bonus"></div>
		<div id="ship"><div id="shield"></div> <div id="bonusPoint"></div><div id="malusPoint"></div></div>
		<div id="enemy-wave"></div>
		<div id="enemy-elite"></div>
		<div id="boss">
			<div id="enemy-boss1" class="boss"></div>
			<div id="enemy-boss2" class="boss"></div>
			<div id="enemy-boss3" class="boss"></div>
		</div>
		
		<?php
			if(isset($_GET["saved"])) {
		?>
			<div id="Saved">Score dans la base ! <br/> Next player please !</div>
		
		<?php
			}
		?>
		
	</div>
	<div id="hurt"></div>
	<script src="data/js/jquery.js"></script>
	<script src="data/js/prosInvader.js"></script>
	
</body>
</html>