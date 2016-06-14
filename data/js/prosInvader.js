/*
 * PROS INVADER 
 * 		Creator - Github:jthulliez
 *      Version - 1.0  
 */

// -- All the variables we are going to use in the game :
// ---- Is going to stock when we push a key ('left' or 'right' or 'q'or 'd')
var listOfKeysPressed = [];
// ---- Is going to be used to manage the background animation (stars moving in the background)
var backgroundPosition = 0;
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

// ---- to manage the score
var score = 0;

// ---- to manage the navigation (0: menu, 1:game, 2:scoreboard)
var current_screen = 0;

// ---- to manage the menu
var menu = 1;




$(document).ready(function() {
	// Is going to set the right height for the board
	putBoardOnFullSize();
	
	// If window is resized => resize the board height (should not be called the d-day..)
	$( window ).resize(function() {
		putBoardOnFullSize();
	});
	
	// handle keyboard events => key down is when key is pressed but not released
	$(document).keydown(function(e) {
		// No F5 allowed...
		if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault();
		else listOfKeysPressed[e.keyCode] = true;
	});
	
	// handle keyboard events => key Up is when key is released
	$(document).keyup(function(e) {
		// No F5 allowed...
		if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault();
		else if (e.keyCode == 32) shot();
		else if (e.keyCode == 38) goUpMenu();
		else if (e.keyCode == 40) goDownMenu();
		else if(e.keyCode == 13) validateOnMenu();
		else listOfKeysPressed[e.keyCode] = false;
	});
	
	setInterval(function() {
		if (listOfKeysPressed[81] || listOfKeysPressed[37])
			goLeft();
		if (listOfKeysPressed[68] || listOfKeysPressed[39])
			goRight();
	}, 5);
	
	setInterval(function() {
		$("#ship").animate({
			"bottom": shipYPosition + "px"
		},400, function() {
			if(shipYPosition == 10){
				shipYPosition = 20;
			} else{
				shipYPosition = 10;
			}
		});
	}, 400);
	
	setInterval(function() {
		if(shipImgCpt == 4){
			shipImgCpt = 0;
		}
		shipImgCpt++;
		$("#ship").css({
			"background-image": "url('data/css/ship_" + shipImgCpt + ".png')"
		}, function() {
			
		});
	}, 100);
	launchBackgroundAnimation();
	majUIMenu();
});



//-- ship methods :
// ---- go Left
function goLeft() {
	if($("#ship").css("left").replace("px","") >0){
		$("#ship").css({
			left : "-=3"
		});
	}
}
// ---- go Right
function goRight() {
	if($("#ship").css("left").replace("px","") <1845){
		$("#ship").css({
			left : "+=3"
		});
	}
}

// ---- shot ONE bullet
function shot(){
	var wShot = $("#ship").css("left").replace("px","");
	$('<div></div>')
	.addClass('bullet')
	.css({
		left: (parseInt(wShot) + 27) + "px",
		bottom: 98
	})
	.appendTo($('#board'))
	.animate({
		top: -20
	},
	{
		duration: 1000,
		easing: 'linear',
		step: function(now, fx) {
			for(i=0;i<5;i++){
				for(j = 0; j < 11 ; j++){
					var idenemy = "enemy-" + i + "-" + j;
					if(enemysShip[idenemy] == true){
						if((parseInt(wShot)+ 27) >= (190 + (j*145))  && (parseInt(wShot)+ 27) <= (190 + (j+1)*145)-55){
							if((now) >= ((i*100)+yEnemyPosition)  && (now) <= ((i+1)*100)+yEnemyPosition){
								//console.log((parseInt(wShot)+ 27) + ":" + now + "<>" + (90 + (i*100)) + ":" + (i*100));
								enemysShip[idenemy] = false;
								score+=20;
								manageScore();
								//
								$("#"+idenemy).css({
									"background-image":"none",
									"border-radius":"50%",
									"border":"1px solid #C5C5C5"
								}).animate({
									height: 0,
									width:0,
									left:"+=45",
									top:"+=45",
								}, 200,function() {
									$(this).remove();
									checkEnemys();
								});
								
								
								$(this).stop().remove();
							}
						}else{
							
						}
					}
				}
			}
			// delete the bullet if it is out of the screen
			if(now == -20){
				$(this).remove();
			}
		}
   	},function() {
	});
}

//-- ia methods :
// ---- create a wave of classic enemys
function createEnemysWave(){
	$("#enemy-wave").empty();
	$("#enemy-wave").css({"top":"40px"})
	for(i=0;i<5;i++){
		for(j = 0; j < 11 ; j++){
			var idenemy = "enemy-" + i + "-" + j;
			$('<div></div>')
			.attr('id',idenemy)
			.addClass('enemy')
			.css({
				left: 90 + (j*145) + "px",
				top: (i*100) + "px"
			}).appendTo($('#enemy-wave'));
			enemysShip[idenemy] = true;
		}
	}
	$("#enemy-wave").fadeIn(1000);
}
// ---- handle the move of the bloc enemys
var moveEnemyWaveThread = "";
function launchEnemyMove(){
	moveEnemyWaveThread = setInterval(function(){ moveEnemyWave() }, 1500);
}

function moveEnemyWave(){
	yEnemyPosition += 15;
	$("#enemy-wave").animate({
		"top": yEnemyPosition+"px",
		"left": "+=" + (directionAnimation * 15)
	},200,function(){
		yEnemyPosition += 15;
		directionAnimation = directionAnimation * -1;
		$("#enemy-wave").animate({
			"top": yEnemyPosition+"px",
			"left": "+=" + (directionAnimation * 15)
		},200,function(){
			
		});
	});
}

//---- handle the move of the bloc enemys
var shotEnemyThread = "";
function launchEnemyShot(){
	shotEnemyThread = setInterval(function(){ shotEnemy() }, 700);
}

// ---- is gonna be the enemy shotter
function shotEnemy(){
	var breakPoint = false;
	for(i=0;i<5;i++){
		for(j = 0; j < 11 ; j++){
			var idenemy = "enemy-" + i + "-" + j;
			if(enemysShip[idenemy] == true){
				var result = Math.floor((Math.random() * 10) + 1); 
				if(result == 1){
					$('<div></div>')
					.addClass('bullet-enemy')
					.css({
						left: 190 + 43 + (j*145) + "px",
						top: yEnemyPosition + 87 + (i*100) + "px"
					})
					.appendTo($('#board'))
					.animate({
						top: 1500
					},2500);
					breakPoint = true;
					break;
				}
				if(breakPoint){
					return;
				}
			}
		}
	}
}

// ---- is gonna check every enemys of this wave... 
//      if they are all dead it means that the level is done
function checkEnemys(){
	var allDead = true;
	for(i=0;i<5;i++){
		for(j = 0; j < 11 ; j++){
			var idenemy = "enemy-" + i + "-" + j;
			if(enemysShip[idenemy] == true){
				allDead = false;
				break;
			}
			if(!allDead){
				break;
			}
		}
	}
	
	if(allDead){
		$("#enemy-wave").css({"display":"none"});
		$("#level-number").empty().append("1");
		$("#message").fadeIn(500);
		setTimeout(function(){
			$("#message").fadeOut(500);
		}, 3000);
		
		clearInterval(moveEnemyWaveThread);
		setTimeout(function(){
			yEnemyPosition = 40;
			createEnemysWave();
			launchEnemyMove();
		}, 4000);
	}	
}

// -- game control: 
// ---- launch game
function launchGame(){
	$(".menu").css({"display":"none"});
	$("#score").css({"display":"inline"});
	$("#lifes").css({"display":"inline"});
	
	createEnemysWave();
	launchEnemyMove();
	launchEnemyShot();
	
}

// -- util methods : 
// ---- will resize the board height to match the screen size
function putBoardOnFullSize(){
	$("#board").css({
		height : $( window ).height() + "px"
	});
}
// ---- 
function manageScore(){
	var scoreTxt = "" + score;
	var lengthScore = scoreTxt.length;
	
	for(i=lengthScore; i<8 ; i++){
		scoreTxt = "0" + scoreTxt;
	}
	
	$("#score-player").empty().append(scoreTxt);
	
}
// ---- will launch the background animation
function launchBackgroundAnimation(){
	setInterval(function() {
		backgroundPosition += 3;
		$("#board").css({
			"background-position": ("center " + backgroundPosition + "px")
		}, function() {
			if(backgroundPosition == 2560){
				backgroundPosition=0;
			}
		});
	}, 50);
}

function validateOnMenu(){
	if(menu==1){
		launchGame();
	}
}

function goUpMenu(){
	if(menu>1){
		menu--;
	}
	majUIMenu();
}

function goDownMenu(){
	if(menu<2){
		menu++;
	}
	majUIMenu();
}

function majUIMenu(){
	$(".choice").css({"color":"white"});
	$("#choice_" + menu).css({"color":"red"});
}