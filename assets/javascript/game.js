$(document).ready(function() {
	// game function
	function game() {

		// character objects
		var charObj = {
			char1: {
				name: "Jon Snow",
				value: "char1",
				img: '<img src="assets/images/jon-snow.jpg" class="img-thumbnail" alt="Jon Snow">',
				imgLose: '<img src="assets/images/skull.jpg" class="img-thumbnail" alt="skull">',
				hp: 100,
				maxHP: 100,
				ap: 20,
				baseAP: 20,
				cap: 30
			},
			char2: {
				name: "Arya Stark",
				value: "char2",
				img: '<img src="assets/images/arya-stark.jpg" class="img-thumbnail" alt="Arya">',
				imgLose: '<img src="assets/images/skull.jpg" class="img-thumbnail" alt="skull">',
				hp: 80,
				maxHP: 80,
				ap: 25,
				baseAP: 25,
				cap: 40
			},
			char3: {
				name: "The Hound",
				value: "char3",
				img: '<img src="assets/images/sandor-clegane.jpg" class="img-thumbnail" alt="Sandor Clegane">',
				imgLose: '<img src="assets/images/skull.jpg" class="img-thumbnail" alt="skull">',
				hp: 120,
				maxHP: 120,
				ap: 15,
				baseAP: 15,
				cap: 28
			},
			char4: {
				name: "White Walker",
				value: "char4",
				img: '<img src="assets/images/white-walker.jpg" class="img-thumbnail" alt="White Walker">',
				imgLose: '<img src="assets/images/skull.jpg" class="img-thumbnail" alt="skull">',
				hp: 140,
				maxHP: 140,
				ap: 13,
				baseAP: 13,
				cap: 25
			}
		};

		// global variables
		var hero;
		var defender;
		var interval;
		var wins = 0;
		var losses = 0;
		var defeatedEnemies = 0;
		var heroSelected = false;
		var defenderSelected = false;
		var gameReady = false;
		
		// sets up character selection row
		function setBoard() {
			for (var i = 1; i <= 4; i++ ) {
				setChar("#char" + i, charObj["char" + i]);
			}
		}

		// works with setBoard and other functions to prevent some duplicate code
		function setChar(sel, obj) {
			obj.hp = obj.maxHP;
			$(sel + " .char-name").html(obj.name);
			$(sel + " .char-img").html(obj.img);
			$(sel + " .char-status").html("health: " + obj.hp);
		}

		// once a hero and defender are selected, displays and sets healthbar values
		function showHealth() {
			$("#hero-status").show();
			$("#hero-hp").attr("aria-valuenow", hero.hp).attr("aria-valuemax", hero.hp);

			$("#defender-status").show();
			$("#defender-hp").attr("aria-valuenow", defender.hp).attr("aria-valuemax", defender.hp);
		}

		// executed when attack button is clicked - adjusts health, hero ap, and health bar percentage
		function attack() {

			defender.hp = defender.hp - hero.ap;
			healthPercent(defender.hp, defender.maxHP, "#defender-hp");

			$("#hero-attack").html("You hit " + defender.name + " for <strong>" + hero.ap + "</strong>.");
			$("#defender .char-status").html("health: " + defender.hp);

			if (defender.hp > 0) {
				hero.hp = hero.hp - defender.cap;
				healthPercent(hero.hp, hero.maxHP, "#hero-hp");

				$("#defender-attack").html(defender.name + " hit you for <strong>" + defender.cap + "</strong>.");
				$("#hero .char-status").html("health: " + hero.hp);

			}
			hero.ap += hero.baseAP;
		}

		// finds percentage for health bar
		function healthPercent(a, b, sel) {
			var percent = (a / b) * 100;
			$(sel).attr("style", "width: " + percent + "%;");

			// changes color when health drops below 50% and 25%
			if (percent <= 25) {
				$(sel).attr("class", "progress-bar progress-bar-danger");
			} else if (percent <= 50) {
				$(sel).attr("class", "progress-bar progress-bar-warning");
			}

		}

		// executed when player loses - calls reset / tracks losses
		function heroDeath() {
			losses++;
			$("#theme-song").animate({volume: 0}, 2000);

			$("#attack-btn").attr("disabled", true);
			$("#replay").show();

			$("#hero .char-img").html(hero.imgLose);
			$("#game-status").html("You lose!! - Please try again!");
			$("#directions").html("You lose... :(");
			$("#losses").html("Losses: " + losses);
		}

		// executed on defender death - if all are dead, resets game. could be made more dynamic in case of additional opponents
		function defenderDeath() {
			defeatedEnemies ++;

			if (defeatedEnemies === 3) {
				wins++;
				$("#theme-song").animate({volume: 0}, 2000);
				$("#attack-btn").attr("disabled", true);
				$("#replay").show();

				$("#defender .char-img").html(hero.imgLose);
				$("#game-status").html("Congratulations, you defeated all opponents!<br>Click to play again.");
				$("#directions").html("You Won the Game!");
				$("#wins").html("Wins: " + wins);
			} else {
				$("#attack-btn").attr("disabled", true);
				$("#next-round").show();

				$("#defender .char-img").html(defender.imgLose);
				$("#game-status").html("You defeated " + defender.name + "! - click to start the next round.");
				$("#directions").html("You Won the Round!");
			}
			
		}

		// called when either hero or all opponents are defeated via replay button
		function resetBoard() {
			defeatedEnemies = 0;
			heroSelected = false;
			defenderSelected = false;
			gameReady = false;

			hero.ap = hero.baseAP;

			$("#hero-attack, #defender-attack").empty();
			$("#game-status").empty();
			$("#hero-hp, #defender-hp").attr("style", "width: 100%;").attr("class", "progress-bar progress-bar-success");

			$(".char-select").show();
			$("#replay, #attack, #status, .char-arena").hide();

			setBoard();
		}

		// called via next-round button when an opponent is defeated, but more remain
		function nextRound() {
			defenderSelected = false;
			gameReady = false;

			$("#hero-attack, #defender-attack").empty();
			$("#game-status").empty();
			$("#defender, #next-round, #status, #attack").hide();
			$("#directions").html("Choose your next opponent");

		}

		// start function calls
		setBoard();

		// click events for selecting hero and current defender
		$("#chars .char").on("click", function () {
			// prevents hero selection if one has already been chosen
			if (heroSelected === false) {

				heroSelected = true;
				obj = charObj[($(this).attr("id"))];
				hero = obj;
				
				$("#theme-song").prop("currentTime", 0).prop("volume", 1);
				$("#theme-song")[0].play();

				$($(this)).hide(); // Hides selected div as the hero div is populated, simulating movement
				$("#hero").show();
				setChar("#hero", obj);

				$("#directions").html("Choose your opponent");

				// verifies hero has been chosen and defender has not
			} else if (heroSelected === true && defenderSelected === false) {

				defenderSelected = true;
				obj = charObj[($(this).attr("id"))];
				defender = obj;

				($(this)).hide();
				$("#defender").show();
				$("#attack").show();
				$("#attack-btn").attr("disabled", false);
				$("#status").show();

				$("#defender-hp").attr("style", "width: 100%;").attr("class", "progress-bar progress-bar-success");
				$("#directions").html("Fight!!");

				setChar("#defender", obj);
				showHealth();

				gameReady = true; // flags that both a hero and defender have been selected, enabling the attack phase

			}
		});

		// calls attack function on click an monitors character health for win/lose states
		$("#attack-btn").on("click", function() {
			if (gameReady) {
				$("#sword-slash")[0].play();
				attack();
				if (hero.hp <= 0) {
					heroDeath();
				} else if (defender.hp <= 0) {
					defenderDeath();
				}
			}
		});

		// full reset when game is either won or lost
		$("#replay-btn").on("click", function() {
			resetBoard();
		});

		// partial reset that allows selecting next opponent
		$("#next-round-btn").on("click", function() {
			nextRound();
		});

		// :)
		$("#scoreboard").hover(function() {
			$("#wins, #losses").hide();
			$("#sloth").show();
		}, function() {
			$("#wins, #losses").show();
			$("#sloth").hide();
		});
	}
	// end game function

	// initiate game
	game();
});