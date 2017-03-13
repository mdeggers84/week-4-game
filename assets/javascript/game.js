$(document).ready(function() {
	// game function
	function game() {

		// character objects
		var charObj = {
			char1: {
				name: "Jon Snow",
				value: "char1",
				img: '<img src="assets/images/jon-snow.jpg" alt="Jon Snow">',
				hp: 100,
				maxHP: 100,
				ap: 10,
				cap: 10,
				hero: false,
				enemy: "",
				dead: false
			},
			char2: {
				name: "Arya Stark",
				value: "char2",
				img: '<img src="assets/images/arya-stark.jpg" alt="Arya">',
				hp: 80,
				maxHP: 80,
				ap: 20,
				cap: 30,
				hero: false,
				enemy: "",
				dead: false
			},
			char3: {
				name: "Sandor Clegane",
				value: "char3",
				img: '<img src="assets/images/sandor-clegane.jpg" alt="Sandor Clegane">',
				hp: 120,
				maxHP: 120,
				ap: 30,
				cap: 10,
				hero: false,
				enemy: "",
				dead: false
			},
			char4: {
				name: "White Walker",
				value: "char4",
				img: '<img src="assets/images/white-walker.jpg" alt="White Walker">',
				hp: 5,
				maxHP: 5,
				ap: 0,
				cap: 15,
				hero: false,
				enemy: "",
				dead: false
			}
		};

		var hero;
		var defender;
		var gameReady = false;

		function setBoard() {
			for (var i = 1; i <= 4; i++ ) {
				setChar("#char-" + i, charObj["char" + i]);
			}
		}

		function setChar(sel, obj) {
			$(sel + " .char-name").html(obj.name);
			$(sel + " .char-img").html(obj.img);
			$(sel + " .char-status").html("health: " + obj.hp);
		}

		function chooseHero() {
			var obj;

			$("#heroes .char").on("click", function() {
				$("#heroes .char").off("click");
				obj = charObj[($(this).attr("value"))];
				hero = obj;
				obj.hero = true;

				$("#char-1 .char-img").html(obj.img);
				$("#char-1").addClass("hero");
				$("#char-2, #char-3, #char-4").hide();

				setEnemies();
			});
		}

		function setEnemies() {
			var j = 1;
			var obj;

			for (var i = 1; i <= 4; i++) {
				obj = charObj["char" + i];

				if (obj.hero === false) {
					setChar("#enemy-" + j, obj);
					$("#enemy-" +j).attr("value", "char" + i).show();
					j++;
				}

			}
		}

		function chooseDefender() {
			var obj;

			$(".enemy").on("click", function() {
				$(".enemy").off("click");
				obj = charObj[($(this).attr("value"))];
				defender = obj;
				($(this)).hide();
				setChar("#defender-1", obj);
				$("#defender-1").show().addClass("defender");
				$("#defender-status").show();
				showHealth();
				gameReady = true;
			});
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

		// fix this
		function attack() {
			var percent;

			defender.hp = defender.hp - hero.ap;
			percent = healthPercent(defender.hp, defender.maxHP);

			$("#defender-1 .char-status").html(defender.hp);
			$("#defender-hp").attr("style", "width: " + percent + "%;");

			if (defender.hp > 0) {
				hero.hp = hero.hp - defender.cap;
				percent = healthPercent(hero.hp, hero.maxHP);

				$("#char-1 .char-status").html(hero.hp);
				$("#hero-hp").attr("style", "width: " + percent + "%;");

				if (hero.hp > 0) {
					hero.ap += hero.ap;
				} else {
					heroDeath();
				}
			} else {
				defenderDeath();
			}
		}

		function heroDeath() {
			alert("you lose");
		}

		function defenderDeath() {
			alert("you win");
		}

		// start function calls
		setBoard();
		chooseHero();
		chooseDefender();

		$("#attack").on("click", function() {
			if (gameReady) {
				attack();
				// updateStatus();
				if (hero.hp <= 0) {
					heroDeath();
				} else if (defender.hp <= 0) {
					defenderDeath();
				}
			}
		});
	}
	// end game function

	// initiate game
	game();
});