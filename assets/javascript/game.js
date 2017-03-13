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

		function setHeroes() {
			$("#char-1 .char-img").html(charObj.char1.img);
			$("#char-2 .char-img").html(charObj.char2.img);
			$("#char-3 .char-img").html(charObj.char3.img);
			$("#char-4 .char-img").html(charObj.char4.img);
		}

		function chooseHero() {
			var char;

			$("#heroes .char").on("click", function() {
				$("#heroes .char").off("click");
				char = charObj[($(this).attr("value"))];
				hero = char;
				char.hero = true;
				$("#char-1").html(char.img).addClass("hero");
				$("#char-2, #char-3, #char-4").hide();
				$("#hero-status").show();
				$("#hero-health").html(hero.hp);
				setEnemies();
			});
		}

		function setEnemies() {
			var j = 1;
			var char;
			
			for (var i = 1; i <= 4; i++) {
				char = charObj["char" + i];
				if (char.hero === false) {
					$("#enemy-" + j + " .char-img").html(char.img).attr("value", char.value);
					j++;
				}
			}
		}

		function chooseDefender() {
			var char;

			$(".enemy").on("click", function() {
				$(".enemy").off("click");
				char = getCharObj(charObj[($(this).attr("value"))]);
				console.log(this);
				defender = char;
				($(this)).hide();
				$("#defender-1 .char-img").html(char.img);
				gameReady = true;
			});
		}

		function getCharObj(val) {
			
		}

		function attack() {
			defender.hp = defender.hp - hero.ap;
			$("#defender-health").html(defender.hp);
			if (defender.hp > 0) {
				hero.hp = hero.hp - defender.cap;
				$("#hero-health").html(hero.hp);
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
		setHeroes();
		chooseHero();
		chooseDefender();

		$("#attack").on("click", function() {
			if (gameReady) {
				attack();
				updateStatus();
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