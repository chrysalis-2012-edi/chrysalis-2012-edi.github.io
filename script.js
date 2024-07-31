document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById("revealCanvas"),
        ctx = canvas.getContext('2d'),
        brushRadius = (canvas.width / 100) * 5,
        img = new Image(),
        timerStarted = false,
        revealTimeout;

    if (brushRadius < 50) { brushRadius = 50 }

    img.src = 'sunrise.jpg';  // Path to the image that will be revealed

    img.onload = function() {
        // Set up the canvas with the first image as the background
        canvas.style.backgroundImage = 'url("girl.jpg")'; // Path to the first image
        canvas.style.backgroundSize = 'cover';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'destination-out';
    };

    function detectLeftButton(event) {
        if ('buttons' in event) {
            return event.buttons === 1;
        } else if ('which' in event) {
            return event.which === 1;
        } else {
            return event.button === 1;
        }
    }

    function getBrushPos(xRef, yRef) {
        var canvasRect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((xRef - canvasRect.left) / (canvasRect.right - canvasRect.left) * canvas.width),
            y: Math.floor((yRef - canvasRect.top) / (canvasRect.bottom - canvasRect.top) * canvas.height)
        };
    }

    function drawDot(mouseX, mouseY) {
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, brushRadius, 0, 2 * Math.PI, true);
        ctx.fillStyle = '#000';
        ctx.globalCompositeOperation = "destination-out";
        ctx.fill();
    }

    function startTimer() {
        if (!timerStarted) {
            timerStarted = true;
            revealTimeout = setTimeout(revealAll, 12000); // 12 seconds timer
        }
    }

    function revealAll() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
	img.src = 'girl.jpg'
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        document.querySelector("#revealContainer figcaption").innerHTML = "Alisa and Christos<br>January 22, 2025<br>We welcome our... baby girl!";
    }

    canvas.addEventListener("mousedown", function(e) {
        startTimer();
        isDrawing = true;
    });

    canvas.addEventListener("mouseup", function(e) {
        isDrawing = false;
    });

    canvas.addEventListener("mousemove", function(e) {
        if (isDrawing) {
            var brushPos = getBrushPos(e.clientX, e.clientY);
            var leftBut = detectLeftButton(e);
            if (leftBut == 1) {
                drawDot(brushPos.x, brushPos.y);
            }
        }
    }, false);

    canvas.addEventListener("touchstart", function(e) {
        startTimer();
        isDrawing = true;
        e.preventDefault();
    });

    canvas.addEventListener("touchend", function(e) {
        isDrawing = false;
        e.preventDefault();
    });

    canvas.addEventListener("touchmove", function(e) {
        if (isDrawing) {
            var touch = e.targetTouches[0];
            if (touch) {
                var brushPos = getBrushPos(touch.pageX, touch.pageY);
                drawDot(brushPos.x, brushPos.y);
            }
        }
        e.preventDefault();
    }, false);
});
