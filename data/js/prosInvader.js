/*
 * PROS INVADER 
 * 		Creator - Github:jthulliez
 *      Version - 1.0  
 */

// -- All the variables we are going to use in the game :
// ---- Is going to stock when we push a key ('left' or 'right' or 'q'or 'd')
var listOfKeysPressed = [];
// ---- Is going to be used to manage the background animation (stars moving in
// the background)
var backgroundPosition = 0;
var backgroundPositionplanet= 0;
// ---- Is going to manage the ship position on the board
var shipYPosition = 20;
var shipXPosition = 650;
// ---- Is going to manage the ship animation (for the engine flame)
var shipImgCpt = 1;

// ---- is going to manage the enemys (type 1)
var enemysShip = [];
// ---- is going to manage the yPosition of the ennemy block
var yEnemyPosition = 40;
var directionAnimation = -1;
// ---- is going to manage the bosses enemys

// ---- to manage the game
var score = 0;
var level = 1;
var SHIP_SPEED = 1500;
var gameLaunched = false;
var lifes = 3;
// ---- to manage the navigation (0: menu, 1:game, 2:scoreboard)
var current_screen = 0;

// ---- to manage the menu
var menu = 1;

var laser, laser2, laser3 = "";
var cptLaser = 1;
var boom, boom2, boom3 = "";
var cptBoom = 1;
var gameover = "";

$(document).ready(function() {
	// Is going to set the right height for the board
	putBoardOnFullSize();

	// If window is resized => resize the board height (should not be called the
	// d-day..)
	$(window).resize(function() {
		putBoardOnFullSize();
	});

	// handle keyboard events => key down is when key is pressed but not
	// released
	$(document).keydown(function(e) {
		// No F5 allowed...
		if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82)
			e.preventDefault();
		else
			listOfKeysPressed[e.keyCode] = true;
	});

	// handle keyboard events => key Up is when key is released
	$(document).keyup(function(e) {
		// No F5 allowed...
		if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82)
			e.preventDefault();
		else if (e.keyCode == 32)
			shot();
		else if (e.keyCode == 38)
			goUpMenu();
		else if (e.keyCode == 40)
			goDownMenu();
		else if (e.keyCode == 13)
			validateOnMenu();
		else
			listOfKeysPressed[e.keyCode] = false;
	});

	setInterval(function() {
		if (listOfKeysPressed[81] || listOfKeysPressed[37])
			goLeft();
		if (listOfKeysPressed[68] || listOfKeysPressed[39])
			goRight();
	}, 5);

	setInterval(function() {
		$("#ship").animate({
			"bottom" : shipYPosition + "px"
		}, 400, function() {
			if (shipYPosition == 10) {
				shipYPosition = 20;
			} else {
				shipYPosition = 10;
			}
		});
	}, 400);

	setInterval(function() {
		if (shipImgCpt == 4) {
			shipImgCpt = 0;
		}
		shipImgCpt++;
		$("#ship").css({
			"background-image" : "url('data/css/ship_" + shipImgCpt + ".png')"
		}, function() {

		});
	}, 100);
	launchBackgroundAnimation();
	majUIMenu();
	 laser = document.createElement('audio');
     laser.setAttribute('src', 'data/sounds/laser.wav');
     laser2 = document.createElement('audio');
     laser2.setAttribute('src', 'data/sounds/laser.wav');
     laser3 = document.createElement('audio');
     laser3.setAttribute('src', 'data/sounds/laser.wav');
     boom = document.createElement('audio');
     boom.setAttribute('src', 'data/sounds/grenade.wav');
     boom2 = document.createElement('audio');
     boom2.setAttribute('src', 'data/sounds/grenade.wav');
     boom3 = document.createElement('audio');
     boom3.setAttribute('src', 'data/sounds/grenade.wav');
     gameover = document.createElement('audio');
     gameover.setAttribute('src', 'data/sounds/gameover.mp3');
});

// -- ship methods :
// ---- go Left
function goLeft() {
	if ($("#ship").css("left").replace("px", "") > 0) {
		$("#ship").css({
			left : "-=3"
		});
	}
}
// ---- go Right
function goRight() {
	if ($("#ship").css("left").replace("px", "") < 1845) {
		$("#ship").css({
			left : "+=3"
		});
	}
}

// ---- shot ONE bullet
function shot() {
	if (gameLaunched) {
		if(cptLaser ==1){
			laser.play();
			cptLaser++;
		}else if(cptLaser ==2){
			laser2.play();
			cptLaser++;
		}else{
			laser3.play();
			cptLaser=1;
		}
		
		var wShot = $("#ship").css("left").replace("px", "");
		$('<div></div>')
				.addClass('bullet')
				.css({
					left : (parseInt(wShot) + 27) + "px",
					bottom : 98
				})
				.appendTo($('#board'))
				.animate(
						{
							top : -20
						},
						{
							duration : 1000,
							easing : 'linear',
							step : function(now, fx) {
								for (i = 0; i < 5; i++) {
									for (j = 0; j < 11; j++) {
										var idenemy = "enemy-" + i + "-" + j;
										if (enemysShip[idenemy] == true) {
											if ((parseInt(wShot) + 27) >= (190 + (j * 145))
													&& (parseInt(wShot) + 27) <= (190 + (j + 1) * 145) - 55) {
												if ((now) >= ((i * 100) + yEnemyPosition)
														&& (now) <= ((i + 1) * 100)
																+ yEnemyPosition) {
													// console.log((parseInt(wShot)+
													// 27) + ":" +
													// now + "<>" + (90 +
													// (i*100)) + ":" +
													// (i*100));
													if(cptBoom == 1){
														boom.play();
														cptBoom++;
													}else if(cptBoom == 2){
														boom2.play();
														cptBoom++;
													}else{
														boom3.play();
														cptBoom=1;
													}
													
													enemysShip[idenemy] = false;
													score += 20;
													manageScore();
													//
													$("#" + idenemy)
															.css(
																	{
																		"background-image" : "url('data/css/boom.png')",
																		"background-repeat" : "no-repeat",
																		"background-size" : "100%"
																	})
															.animate(
																	{
																		height : 0,
																		width : 0,
																		"background-size" : "25%",
																		left : "+=45",
																		top : "+=45",
																	},
																	500,
																	function() {
																		$(this)
																				.remove();
																		checkEnemys();
																	});

													$(this).stop().remove();
												}
											} else {

											}
										}
									}
								}
								// delete the bullet if it is out of the screen
								if (now == -20) {
									$(this).remove();
								}
							}
						}, function() {
						});
	}
}

// -- ia methods :
// ---- create a wave of classic enemys
function createEnemysWave() {
	$("#enemy-wave").empty();
	$("#enemy-wave").css({
		"top" : "40px"
	})
	for (i = 0; i < 5; i++) {
		for (j = 0; j < 11; j++) {
			var idenemy = "enemy-" + i + "-" + j;
			$('<div></div>').attr('id', idenemy).addClass('enemy').css({
				left : 90 + (j * 145) + "px",
				top : (i * 100) + "px"
			}).appendTo($('#enemy-wave'));
			enemysShip[idenemy] = true;
		}
	}
	$("#enemy-wave").fadeIn(1000);
}
// ---- handle the move of the bloc enemys
var moveEnemyWaveThread = "";
function launchEnemyMove() {
	moveEnemyWaveThread = setInterval(function() {
		moveEnemyWave()
	}, SHIP_SPEED);
}

function moveEnemyWave() {
	yEnemyPosition += 15;
	$("#enemy-wave").animate({
		"top" : yEnemyPosition + "px",
		"left" : "+=" + (directionAnimation * 15)
	}, 200, function() {
		yEnemyPosition += 15;
		directionAnimation = directionAnimation * -1;
		$("#enemy-wave").animate({
			"top" : yEnemyPosition + "px",
			"left" : "+=" + (directionAnimation * 15)
		}, 200, function() {

		});
	});
}

// ---- handle the move of the bloc enemys
var shotEnemyThread = "";
function launchEnemyShot() {
	shotEnemyThread = setInterval(function() {
		shotEnemy()
	}, 700);
}

// ---- is gonna be the enemy shotter
function shotEnemy() {
	var breakPoint = false;
	for (i = 0; i < 5; i++) {
		for (j = 0; j < 11; j++) {
			var idenemy = "enemy-" + i + "-" + j;
			if (enemysShip[idenemy] == true) {
				var result = Math.floor((Math.random() * 12) + 1);
				if (result == 1) {
					$('<div></div>')
							.addClass('bullet-enemy')
							.css({
								left : 190 + 43 + (j * 145) + "px",
								top : yEnemyPosition + 87 + (i * 100) + "px"
							})
							.appendTo($('#board'))
							.animate(
									{
										top : 1500
									},
									{
										duration : 1500,
										easing : 'linear',
										step : function(now, fx) {
											var yBullet = parseInt($(this).css(
													"bottom").replace("px", ""));
											var xBullet = parseInt($(this).css(
													"left").replace("px", ""));
											var xShip = parseInt($("#ship")
													.css("left").replace("px",
															""));
											if (yBullet <= 90 && yBullet > 10) {
												if (xBullet >= xShip
														&& (xBullet - 10) <= (xShip + 75)) {
													shipTouched();
													$(this).remove();
												}
											}
										}
									});
					breakPoint = true;
					break;
				}

			}
			if (breakPoint) {
				return;
			}
		}
	}
}

// ---- is gonna check every enemys of this wave...
// if they are all dead it means that the level is done
function checkEnemys() {
	var allDead = true;
	for (i = 0; i < 5; i++) {
		for (j = 0; j < 11; j++) {
			var idenemy = "enemy-" + i + "-" + j;
			if (enemysShip[idenemy] == true) {
				allDead = false;
				break;
			}
			if (!allDead) {
				break;
			}
		}
	}

	if (allDead) {
		$("#enemy-wave").css({
			"display" : "none"
		});
		$("#level-number").empty().append(level);
		level++;
		$("#message").fadeIn(500);
		setTimeout(function() {
			$("#message").fadeOut(500);
		}, 3000);

		clearInterval(moveEnemyWaveThread);
		setTimeout(function() {
			yEnemyPosition = 40;
			createEnemysWave();
			launchEnemyMove();
		}, 4000);
	}
}

// -- game control:
// ---- launch game
function launchGame() {
	$(".menu").css({
		"display" : "none"
	});
	$("#score").css({
		"display" : "inline"
	});
	$("#lifes").css({
		"display" : "inline"
	});
	gameLaunched = true;
	createEnemysWave();
	launchEnemyMove();
	launchEnemyShot();
	launchCheckWave();
}

function gameOver() {
	gameover.play();
	gameLaunched = false;
	clearInterval(checkWaveThread);
	clearInterval(moveEnemyWaveThread);
	clearInterval(shotEnemyThread);
	$("#enemy-wave").fadeOut(1000);
	$("#gameOver").fadeIn(1000);
	$("#calque").fadeIn(1000)

}

function checkWave() {
	var isGameOver = false;
	// We are going to check every enemy
	for (i = 0; i < 5; i++) {
		for (j = 0; j < 11; j++) {
			var idenemy = "enemy-" + i + "-" + j;
			if (enemysShip[idenemy] == true) {
				if ((parseInt($("#" + idenemy).css("top").replace("px", "")) + 90 + yEnemyPosition) >= (parseInt($(
						"#ship").css("top").replace("px", "")))) {
					isGameOver = true;
					break;
				}
				if (isGameOver) {
					break;
				}
			}
			if (isGameOver) {
				break;
			}
		}
	}

	if (isGameOver) {
		gameOver();
	}
}

function shipTouched(){
	$("#hurt").fadeIn(200)
	.fadeOut(200);
	lifes--;
	$("#lifes").css("width",(lifes * 42)+"px")
	if(lifes == 0){
		gameOver();
	}
}

var checkWaveThread = "";
function launchCheckWave() {
	checkWaveThread = setInterval(function() {
		checkWave()
	}, 200);
}

// -- util methods :
// ---- will resize the board height to match the screen size
function putBoardOnFullSize() {
	$("#board").css({
		height : $(window).height() + "px"
	});
}
// ----
function manageScore() {
	var scoreTxt = "" + score;
	var lengthScore = scoreTxt.length;

	for (i = lengthScore; i < 8; i++) {
		scoreTxt = "0" + scoreTxt;
	}

	$("#score-player").empty().append(scoreTxt);

}
// ---- will launch the background animation
function launchBackgroundAnimation() {
	setInterval(function() {
		backgroundPosition += 3;
		$("#bg-stars").css({
			"background-position" : ("center " + backgroundPosition + "px")
		}, function() {
			if (backgroundPosition == 2560) {
				backgroundPosition = 0;
			}
		});
	}, 50);
	setInterval(function() {
		backgroundPositionplanet += 2;
		$("#bg-planet").css({
			"background-position" : ("center " + backgroundPositionplanet + "px")
		}, function() {
			if (backgroundPositionplanet == 8000) {
				backgroundPositionplanet = 0;
			}
		});
	}, 50);
}

function validateOnMenu() {
	if (menu == 1 && current_screen == 0) {
		launchGame();
	}
}

function goUpMenu() {
	if (menu > 1) {
		menu--;
	}
	majUIMenu();
}

function goDownMenu() {
	if (menu < 2) {
		menu++;
	}
	majUIMenu();
}

function majUIMenu() {
	$(".choice").css({
		"color" : "white"
	});
	$("#choice_" + menu).css({
		"color" : "red"
	});
}