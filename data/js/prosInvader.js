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

var secondWaveInLevel = false;
var secondWaveInLevelCalled = false;
// ---- is going to manage the enemys (type 1)
var enemysShip = [];
// ---- is going to manage the yPosition of the ennemy block
var yEnemyPosition = 40;
var yBossPosition = 0;
var directionAnimation = -1;

var directionAnimationBoss = -1;
// ---- is going to manage the bosses enemys

// ---- to manage the game
var score = 0;
var level = 0;
var SHIP_SPEED = 800;
var gameLaunched = false;
var lifes = 3;
var gun = 1 // 1 : normal ; 2 : 3-shot ; 3 : rifle

var bossNumber = 1;
var bossLife = 20;
// ---- to manage the navigation (0: menu, 1:game, 2:scoreboard)
var current_screen = 0;

// ---- to manage the menu
var menu = 1;

// --- some flags
var isCreatingNewWave = false;
var isBoss = false;

var laser, laser2, laser3 = "";
var cptLaser = 1;
var boom, boom2, boom3 = "";
var cptBoom = 1;
var gameover = "";

var bossWidth = [257,320,300];

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
		$("#boss").animate({
			"top" : shipYPosition + "px"
		}, 400, function() {
			
		});
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
	launchBossMove();
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
								
								var xBoss = parseInt($("#enemy-boss" + bossNumber).css("left").replace("px",""));
								
								// Check if it touched the boss
								if(isBoss && wShot > xBoss && wShot < (xBoss+500) && now > shipYPosition && now < (shipYPosition + bossWidth[bossNumber-1])){
									bossTouched();
									$(this).stop().remove();
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

function bossTouched(){
	if(isBoss){
		bossLife--;
		if(bossLife == 0 && isBoss){
			isBoss = false;
		}
		$("#enemy-boss"+bossNumber).css({
			"background-image":"url(data/css/boss"+bossNumber+"_touched.png)"
		});
		setTimeout(function() {
			$("#enemy-boss"+bossNumber).css({
				"background-image":"url(data/css/boss"+bossNumber+".png)"
			});
			
			if(!isBoss){
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
				$("#enemy-boss"+bossNumber).css(
						{
							"background-image" : "url('data/css/boom.png')",
							"background-repeat" : "no-repeat",
							"background-size" : "80%"
						})
				.animate(
						{
							opacity : 0
						},
						800,function() {
							checkEnemys();
				});
			}
			
		}, 150);
		
	}
	
	
}


// -- ia methods :
// ---- create a wave of classic enemys
function createEnemysWave() {
		enemysShip = [];
		isCreatingNewWave = true;
		if(secondWaveInLevel || level == 0){
			level++;
			secondWaveInLevel = false;
		}
		
		$("#enemy-wave").empty();
		$("#enemy-wave").css({
			"top" : ((40 + (level*10))+"px")
		})
		for (i = 0; i < 5; i++) {
			for (j = 0; j < 11; j++) {
				
				/*
				 * LEVEL 1 
				 */
				if(level == 1 || level == 8 || level==14 || level ==13){
					if(i < 3 && j > 2 && j < 9 ){
						createEnemy(i,j);
					}else{
						var idenemy = "enemy-" + i + "-" + j;
						enemysShip[idenemy] = false;
					}
				}
				/*
				 * LEVEL 2 
				 */
				else if(level == 2){
					if(i <4 && j > 2 && j < 9 ){
						createEnemy(i,j);
						
					}else{
						var idenemy = "enemy-" + i + "-" + j;
						enemysShip[idenemy] = false;
					}
				}
				/*
				 * BOSS 1
				 */
				else if(level == 3){
					if(i > 2 && j > 1 && j < 10 ){
						createEnemy(i,j);
					}else{
						var idenemy = "enemy-" + i + "-" + j;
						enemysShip[idenemy] = false;
					}
				}
				/*
				 * LEVEL 4
				 */
				else if(level == 4){
					if(j > 1 && j < 10 ){
						createEnemy(i,j);
					}else{
						var idenemy = "enemy-" + i + "-" + j;
						enemysShip[idenemy] = false;
					}
				}
				/*
				 * LEVEL 5 
				 */
				else if(level == 5){
					if(i<4){
						createEnemy(i,j);
					}else{
						var idenemy = "enemy-" + i + "-" + j;
						enemysShip[idenemy] = false;
					}
				}
				/*
				 * BOSS 2
				 */
				else if(level == 6){
					if(i > 1 ){
						createEnemy(i,j);
					}else{
						var idenemy = "enemy-" + i + "-" + j;
						enemysShip[idenemy] = false;
					}
				}
				else{
					
					createEnemy(i,j);
				}
			}
		}
		yEnemyPosition = 40 + (level*10);
		directionAnimationBoss = -1;
		// Ajout du boss s'il existe
		if((level == 3 || level == 12 || level == 21) && !secondWaveInLevelCalled){
			bossNumber = 1;
			bossLife = 20;
			secondWaveInLevel = true;
			$("#enemy-boss1").css({
				"background-image" : "url('data/css/boss1.png')",
				"margin-top":"-150px"
			}).fadeIn(1500, function(){
				isBoss = true;
			}).animate({
				"margin-top" :"0px"
			}, 1500, function(){
				
			});
		}else if((level == 6 || level == 15 || level == 24  ) && !secondWaveInLevelCalled){
			bossNumber = 2;
			yEnemyPosition = 190;
			bossLife = 40;
			$("#enemy-boss2").css({
				"background-image" : "url('data/css/boss2.png')",
				"margin-top":"-150px"
			}).fadeIn(2000, function(){
				isBoss = true;
			}).animate({
				"margin-top" :"0px"
			}, 2000, function(){
				
			});
		}else if((level == 9 || level == 18 || level == 27  ) && !secondWaveInLevelCalled){
			bossNumber = 3;
			yEnemyPosition = 190;
			bossLife = 40;
			$("#enemy-boss3").css({
				"background-image" : "url('data/css/boss3.png')",
				"margin-top":"-150px"
			}).fadeIn(2000, function(){
				isBoss = true;
			}).animate({
				"margin-top" :"0px"
			}, 2000, function(){
				
			});
		}
		
		if(!secondWaveInLevelCalled){
			
			$("#enemy-wave").fadeIn(1000, function(){
				isCreatingNewWave = false;
			});
			
		}else{
			secondWaveInLevel = true;
			yEnemyPosition = 40 + (level*10);
			setTimeout(function(){$("#enemy-wave").fadeIn(1000, function(){
				isCreatingNewWave = false;
			});
			},100);
		}
}


function createEnemy(i,j){
	var result = Math.floor((Math.random() * 2) + 1);
	if (result == 1) {
	
		var idenemy = "enemy-" + i + "-" + j;
		$('<div></div>').attr('id', idenemy).addClass('enemy').css({
			left : 90 + (j * 145) + "px",
			top : (i * 100) + "px"
		}).appendTo($('#enemy-wave'));
		enemysShip[idenemy] = true;
	}else{
		var idenemy = "enemy-" + i + "-" + j;
		$('<div></div>').attr('id', idenemy).addClass('enemy2').css({
			left : 90 + (j * 145) + "px",
			top : (i * 100) + "px"
		}).appendTo($('#enemy-wave'));
		enemysShip[idenemy] = true;
	}
}
// ---- handle the move of the bloc enemys
var moveEnemyWaveThread = "";
function launchEnemyMove() {
	moveEnemyWaveThread = setInterval(function() {
		moveEnemyWave()
	}, SHIP_SPEED);
}

function moveEnemyWave() {
	if(!isCreatingNewWave){
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
				if(isCreatingNewWave){
					yEnemyPosition = 40 + (level*10);
				}
			});
		});
	}else{
		yEnemyPosition = 40 + (level*10);
		//console.log("yEnemyPosition : " + yEnemyPosition);
	}
}

//---- handle the move of the bloc boss
var moveBossWaveThread = "";
function launchBossMove() {
	moveBossWaveThread = setInterval(function() {
		moveBossWave()
	}, 10000);
	moveBossWave();
}

function moveBossWave() {
	if(isBoss){
	
		$("#enemy-boss" + bossNumber).animate({
			"left" : "+=" + (directionAnimationBoss * 550)
		}, 4500, function() {
			$("#enemy-boss" + bossNumber).animate({
				"left" : "-=" + (directionAnimationBoss * 550)
			}, 4500, function() {
				directionAnimationBoss = directionAnimationBoss * -1;
			});
		});
	
	}
}


// ---- handle the move of the bloc enemys
var shotEnemyThread = "";
function launchEnemyShot() {
	shotEnemyThread = setInterval(function() {
		shotEnemy()
	}, 500);
}

// ---- is gonna be the enemy shotter
function shotEnemy() {
	shotBoss();
	var breakPoint = false;
	for (i = 0; i < 5; i++) {
		for (j = 0; j < 11; j++) {
			var idenemy = "enemy-" + i + "-" + j;
			if (enemysShip[idenemy] == true) {
				var coeff =  (level / 2);
				if(coeff > 5){
					coeff=5;
				}
				var result = Math.floor((Math.random() * 7 - coeff) + 1);
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


function shotBoss(){
	if(isBoss){
		var result = Math.floor((Math.random() * 4) + 1);
		if (result < 3) {
			if(bossNumber == 1){
				
				var xBoss = $("#enemy-boss" + bossNumber).css("left").replace("px","");
				launchBossShot(parseInt(xBoss) + 115,shipYPosition + 262,"-");
				launchBossShot(parseInt(xBoss) + 125,shipYPosition + 262,"0");
				launchBossShot(parseInt(xBoss) + 125,shipYPosition + 262,"+");
				
				
			}else if(bossNumber == 2){
				var xBoss = $("#enemy-boss" + bossNumber).css("left").replace("px","");
				launchBossShot(parseInt(xBoss) + 115,shipYPosition + 262,"-");
				launchBossShot(parseInt(xBoss) + 115,shipYPosition + 262,"0");
				launchBossShot(parseInt(xBoss) + 115,shipYPosition + 262,"+");
				
			}
		}else{
			if(bossNumber == 1){
				var xBoss = $("#enemy-boss" + bossNumber).css("left").replace("px","");
				
				launchBossShot(parseInt(xBoss) + 365,shipYPosition + 262,"-");
				launchBossShot(parseInt(xBoss) + 365,shipYPosition + 262,"0");
				launchBossShot(parseInt(xBoss) + 365,shipYPosition + 262,"+");
				
			}else if(bossNumber == 2){
				var xBoss = $("#enemy-boss" + bossNumber).css("left").replace("px","");
				launchBossShot(parseInt(xBoss) + 375,shipYPosition + 262,"-");
				launchBossShot(parseInt(xBoss) + 375,shipYPosition + 262,"0");
				launchBossShot(parseInt(xBoss) + 375,shipYPosition + 262,"+");
			}
		}
		
		
		//Dans tous les cas si on est sur le boss 2 :
		if(bossNumber == 2){
			var xBoss = $("#enemy-boss" + bossNumber).css("left").replace("px","");
			launchBossShot(parseInt(xBoss) + 250,shipYPosition + 337,"-");
			launchBossShot(parseInt(xBoss) + 250,shipYPosition + 387,"0");
			launchBossShot(parseInt(xBoss) + 250,shipYPosition + 387,"+");
		}
	}
}


function launchBossShot(i,j,directionx){
	if(directionx != "0"){
		$('<div></div>')
		.addClass('bullet-boss')
		.css({
			"left" : i + "px",
			"top" : j + "px"
		})
		.appendTo($('#board'))
		.animate(
				{
					left : directionx+"=1500",
					top : "+=1500"
				},
				{
					duration : 2500,
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
	}else{
		$('<div></div>')
		.addClass('bullet-boss')
		.css({
			"left" : i + "px",
			"top" : j + "px"
		})
		.appendTo($('#board'))
		.animate(
				{
					top : "+=1500"
				},
				{
					duration : 2500,
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

	if (allDead  && !isBoss && !isCreatingNewWave && secondWaveInLevel) {
		
		isCreatingNewWave = true;
		secondWaveInLevelCalled = false;
		$("#enemy-wave").css({
			"display" : "none"
		});
		$("#level-number").empty().append(level);
		$("#level-number-next").empty().append((level)+1);
		$("#message").fadeIn(500);
		setTimeout(function() {
			$("#message").fadeOut(500);
		}, 2000);
		
		yEnemyPosition = 40 + (level*10);
		
		//clearInterval(moveEnemyWaveThread);
		setTimeout(function() {
			if(isCreatingNewWave){
				createEnemysWave();
			}
		}, 3100);
			
	}
	
	if (allDead  && !isBoss && !isCreatingNewWave && !secondWaveInLevel) {
		$("#enemy-wave").css({
			"display" : "none"
		});
		secondWaveInLevelCalled = true;
		isCreatingNewWave = true;
		yEnemyPosition = 40 + (level*10);
		setTimeout(function() {
			if(isCreatingNewWave){
				createEnemysWave();
			}
		}, 1000);
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
	level = 14;
	gameLaunched = true;
	current_screen = 1;
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