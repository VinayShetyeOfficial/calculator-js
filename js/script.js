window.onload = function() {

	var input = document.getElementById('input');
	var operators = document.querySelectorAll('.operators div');
	var numbers = document.querySelectorAll('.numbers div');
	var clear = document.getElementById('clear');
	var del = document.getElementById('delete');
	var result = document.getElementById('result');
	var resultDisplayed = false;
	var keyPressedAudio = document.getElementById('keyPressed');

	/*----------- Start Simulation -----------*/

	var space = "&nbsp;&nbsp;&nbsp;";
	var message = "Starting";
	var dots = ".";

	var count = 0;
	var repeat = 0;
	var interval;

	/*--- Disabling keys during start simulation ---*/

	for (var i = 0; i < numbers.length; i++) {
		numbers[i].style.pointerEvents = "none";
	}

	for (var i = 0; i < operators.length; i++) {
		operators[i].style.pointerEvents = "none";
	}

	del.style.pointerEvents = "none";
	result.style.pointerEvents = "none";

	function starting() {
		
        if (count > 3) {
			count = 0;
			space = "&nbsp;&nbsp;&nbsp;";
		}

		if (count > 0) {
			space = space.replace("&nbsp;", dots);
		}

		document.getElementById('input').innerHTML = message + space;
		count++;
		repeat++;

		interval = setTimeout(starting, 300);

		if (repeat > 12) {
			stop();
		}
	}

	starting();

	function stop() {

		clearTimeout(interval);

		input.innerHTML = "";

		/*--- Enabling keys after start simulation ---*/

		for (var i = 0; i < numbers.length; i++) {
			numbers[i].style.pointerEvents = "auto";
		}

		for (var i = 0; i < operators.length; i++) {
			operators[i].style.pointerEvents = "auto";
		}

		del.style.pointerEvents = "auto";
		result.style.pointerEvents = "auto";
	}


	/*----------- Numbers keys in action -----------*/
	for (var i = 0; i < numbers.length; i++) {

		numbers[i].addEventListener("click", function(e) {

			/*--- Keypressed audio ---*/
			keyPressedAudio.currentTime = 0;
			keyPressedAudio.play();

			if (e.target.innerHTML != "C") {
				checkLimit();
			}

			var currentString = input.innerHTML;
			var lastChar = currentString[currentString.length - 1];

			if (resultDisplayed == false) {
				input.innerHTML += e.target.innerHTML;
			} 
            else if (lastChar == '+' || lastChar == '-' || lastChar == '×' || lastChar == '÷') {
				resultDisplayed = false;
				input.innerHTML += e.target.innerHTML;
			} 
            else {
				resultDisplayed = false;
				input.innerHTML = "";
				input.innerHTML += e.target.innerHTML;
			}
		});
	}

	/*----------- Operator keys in action -----------*/
	for (var i = 0; i < operators.length; i++) {

		operators[i].addEventListener("click", function(e) {

			/*--- Keypressed audio ---*/
			keyPressedAudio.currentTime = 0;
			keyPressedAudio.play();

			checkLimit();

			var currentString = input.innerHTML;
			var lastChar = currentString[currentString.length - 1];

			if (lastChar == '+' || lastChar == '-' || lastChar == '×' || lastChar == '÷') {
				var newString = currentString.substring(0, currentString.length - 1) + e.target.innerHTML;
				input.innerHTML = newString;
			} 
            else if (currentString.length == 0) {

				input.innerHTML += "!";

				for (var i = 0; i < numbers.length; i++) {
					numbers[i].style.pointerEvents = "none";
				}

				for (var i = 0; i < operators.length; i++) {
					operators[i].style.pointerEvents = "none";
				}

				del.style.pointerEvents = "none";
				result.style.pointerEvents = "none";

				setTimeout(clear, 1000);

				/*--- Clear function ---*/

				function clear() {

					input.innerHTML = "";

					for (var i = 0; i < numbers.length; i++) {
						numbers[i].style.pointerEvents = "auto";
					}

					for (var i = 0; i < operators.length; i++) {
						operators[i].style.pointerEvents = "auto";
					}

					del.style.pointerEvents = "auto";
					result.style.pointerEvents = "auto";
				}
			} 
            else {
				input.innerHTML += e.target.innerHTML;
			}
		});
	}

	/*----------- CheckInput String Limit -----------*/
	function checkLimit() {

		if (input.innerHTML.length >= 16) {
			alert("Maximum allowed limit reached");
			exit;
		}
	}

	/*----------- Delete Character -----------*/
	del.addEventListener('click', function() {

		/*--- Keypressed audio ---*/
		keyPressedAudio.currentTime = 0;
		keyPressedAudio.play();

		var currentString = input.innerHTML;
		currentString = currentString.substring(0, currentString.length - 1);
		input.innerHTML = currentString;

	});

	/*----------- Calculate Result -----------*/
	result.addEventListener('click', function() {

		/*--- Keypressed audio ---*/
		keyPressedAudio.currentTime = 0;
		keyPressedAudio.play();

		var currenString = input.innerHTML;

		if (input.innerHTML.length == 0) {

			input.innerHTML = "0";

			for (var i = 0; i < numbers.length; i++) {
				numbers[i].style.pointerEvents = "none";
			}

			for (var i = 0; i < operators.length; i++) {
				operators[i].style.pointerEvents = "none";
			}

			del.style.pointerEvents = "none";
			result.style.pointerEvents = "none";

			setTimeout(clear, 1000);
		}

		/*--- Clear function ---*/

		function clear() {

			input.innerHTML = currenString;

			for (var i = 0; i < numbers.length; i++) {
				numbers[i].style.pointerEvents = "auto";
			}

			for (var i = 0; i < operators.length; i++) {
				operators[i].style.pointerEvents = "auto";
			}

			del.style.pointerEvents = "auto";
			result.style.pointerEvents = "auto";
		}

		var inputString = input.innerHTML;
		var evaluation;

		if (inputString.search(/\×|\÷/g) != -1) {
			inputString = inputString.replace(/\×/g, "*");
			inputString = inputString.replace(/\÷/g, "/");
		}

		try {
			evaluation = eval(inputString);

			if (evaluation.toString().length > 13) {
				evaluation = evaluation.toExponential(1);
			}

			if (evaluation == 'Infinity') {

				evaluation += "!";

				for (var i = 0; i < numbers.length; i++) {
					numbers[i].style.pointerEvents = "none";
				}

				for (var i = 0; i < operators.length; i++) {
					operators[i].style.pointerEvents = "none";
				}

				del.style.pointerEvents = "none";
				result.style.pointerEvents = "none";

				setTimeout(clear, 1000);
			}

			input.innerHTML = evaluation;
			resultDisplayed = true;
		} catch (err) {

			input.innerHTML = "SyntaxError!";

			for (var i = 0; i < numbers.length; i++) {
				numbers[i].style.pointerEvents = "none";
			}

			for (var i = 0; i < operators.length; i++) {
				operators[i].style.pointerEvents = "none";
			}

			del.style.pointerEvents = "none";
			result.style.pointerEvents = "none";

			setTimeout(clear, 1500);
		}
	});

	/*----------- Clear Input ----------- */
	clear.addEventListener('click', function() {
		input.innerHTML = "";
	});
}