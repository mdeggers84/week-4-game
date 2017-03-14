$(document).ready(function() {
	// game function
	function game() {

		// character objects
		var charObj = {
			char1: {
				name: "Jon Snow",
				value: "char1",
				img: '<img src="assets/images/jon-snow.jpg" class="img-thumbnail" alt="Jon Snow">',
				imgLose: '<img src="assets/images/sothdoll.gif" class="img-thumbnail" alt="sloth">',
				hp: 100,
				maxHP: 100,
				ap: 10,
				baseAP: 10,
				cap: 10,
				hero: false
			},
			char2: {
				name: "Arya Stark",
				value: "char2",
				img: '<img src="assets/images/arya-stark.jpg" class="img-thumbnail" alt="Arya">',
				imgLose: '<img src="assets/images/sothdoll.gif" class="img-thumbnail" alt="sloth">',
				hp: 80,
				maxHP: 80,
				ap: 20,
				baseAP: 20,
				cap: 30,
				hero: false
			},
			char3: {
				name: "Sandor Clegane",
				value: "char3",
				img: '<img src="assets/images/sandor-clegane.jpg" class="img-thumbnail" alt="Sandor Clegane">',
				imgLose: '<img src="assets/images/sothdoll.gif" class="img-thumbnail" alt="sloth">',
				hp: 120,
				maxHP: 120,
				ap: 30,
				baseAP: 30,
				cap: 10,
				hero: false
			},
			char4: {
				name: "White Walker",
				value: "char4",
				img: '<img src="assets/images/white-walker.jpg" class="img-thumbnail" alt="White Walker">',
				imgLose: '<img src="assets/images/sothdoll.gif" class="img-thumbnail" alt="sloth">',
				hp: 5,
				maxHP: 5,
				ap: 0,
				baseAP: 0,
				cap: 15,
				hero: false
			}
		};

		var hero;
		var defender;
		var wins = 0;
		var losses = 0;
		var defeatedEnemies = 0;
		var heroSelected = false;
		var defenderSelected = false;
		var gameReady = false;
		var themeSong = document.getElementById("theme-song");
		var swordSlash = document.getElementById("sword-slash");

		function setBoard() {
			for (var i = 1; i <= 4; i++ ) {
				setChar("#char-" + i, charObj["char" + i]);
			}
		}

		function resetBoard() {
			defeatedEnemies = 0;
			heroSelected = false;
			defenderSelected = false;
			gameReady = false;

			hero.ap = hero.baseAP;

			$("#hero-attack, #defender-attack").empty();
			$("#game-status").empty();
			$("#hero-hp, #defender-hp").attr("style", "width: 100%;");

			$(".char-select").show();
			$("#replay, #status, .char-arena").hide();

			setBoard();
		}

		function nextRound() {
			defenderSelected = false;
			gameReady = false;

			$("#hero-attack, #defender-attack").empty();
			$("#game-status").empty();
			$("#defender, #next-round, #status").hide();
			$("#directions").html("Choose your next opponent");

		}

		function setChar(sel, obj) {
			obj.hp = obj.maxHP;
			$(sel + " .char-name").html(obj.name);
			$(sel + " .char-img").html(obj.img);
			$(sel + " .char-status").html("health: " + obj.hp);
		}

		function showHealth() {
			$("#hero-status").show();
			$("#hero-hp").attr("aria-valuenow", hero.hp).attr("aria-valuemax", hero.hp);

			$("#defender-status").show();
			$("#defender-hp").attr("aria-valuenow", defender.hp).attr("aria-valuemax", defender.hp);
		}

		function healthPercent(a, b) {
			return (a / b) * 100;
		}

		function attack() {
			var percent;

			defender.hp = defender.hp - hero.ap;
			percent = healthPercent(defender.hp, defender.maxHP);

			$("#hero-attack").html("You hit " + defender.name + " for <strong>" + hero.ap + "</strong>.");

			$("#defender .char-status").html("health: " + defender.hp);
			$("#defender-hp").attr("style", "width: " + percent + "%;");

			if (defender.hp > 0) {
				hero.hp = hero.hp - defender.cap;
				percent = healthPercent(hero.hp, hero.maxHP);

				$("#defender-attack").html(defender.name + " hit you for <strong>" + defender.cap + "</strong>.");

				$("#hero .char-status").html("health: " + hero.hp);
				$("#hero-hp").attr("style", "width: " + percent + "%;");
			}
			hero.ap += hero.baseAP;
		}

		function heroDeath() {
			losses++;

			$("#attack").hide();
			$("#replay").show();

			$("#hero .char-img").html(hero.imgLose);
			$("#game-status").html("You lose!! - Please try again!");
			$("#directions").html("You lose... :(");
			$("#losses").html("Losses: " + losses);
		}

		function defenderDeath() {
			defeatedEnemies ++;

			if (defeatedEnemies === 3) {
				wins++;
				$("#attack").hide();
				$("#replay").show();

				$("#defender .char-img").html(hero.imgLose);
				$("#game-status").html("Congratulations, you defeated all opponents!<br>Click to play again.");
				$("#directions").html("You Won the Game!");
				$("#wins").html("Wins: " + wins);
			} else {
				$("#attack").hide();
				$("#next-round").show();

				$("#defender .char-img").html(defender.imgLose);
				$("#game-status").html("You defeated " + defender.name + "! - click to start the next round.");
				$("#directions").html("You Won the Round!");
			}
			
		}

		// start function calls
		setBoard();
		themeSong.play();

		$("#chars .char").on("click", function () {
			if (heroSelected === false) {

				heroSelected = true;
				obj = charObj[($(this).attr("value"))];
				hero = obj;
				obj.hero = true;

				$($(this)).hide();
				$("#hero").show();
				setChar("#hero", obj);

				$("#directions").html("Choose your opponent");

			} else if (heroSelected === true && defenderSelected === false) {

				defenderSelected = true;
				obj = charObj[($(this).attr("value"))];
				defender = obj;

				($(this)).hide();
				$("#defender").show();
				$("#attack").show();
				$("#status").show();

				$("#defender-hp").attr("style", "width: 100%;");
				$("#directions").html("Fight!!");

				setChar("#defender", obj);
				showHealth();

				gameReady = true;

			}
		});

		$("#attack").on("click", function() {
			if (gameReady) {
				swordSlash.play();
				attack();
				if (hero.hp <= 0) {
					heroDeath();
				} else if (defender.hp <= 0) {
					defenderDeath();
				}
			}
		});

		$("#replay").on("click", function() {
			resetBoard();
		});

		$("#next-round").on("click", function() {
			nextRound();
		});
	}
	// end game function

	// initiate game
	game();
});