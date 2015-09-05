function ClockLetter(rows, columns, width, height) {
    this.letters = {
		ש: [
            ["12:30:0", "12:30:0", "12:30:0"],
            ["12:30:0", "12:30:0", "12:30:0"],
            ["3:0:0", "12:15:45", "9:0:0"]
        ],
        נ: [
            ["", "", "12:30:0"],
            ["", "", "12:30:0"],
            ["", "9:15:15", "9:0:0"]
        ],
        ה: [
            ["9:15:15", "9:15:15", "9:30:30"],
            ["6:30:30", "", "12:30:30"],
            ["12:30:30", "", "12:30:30"]
        ],
        ט: [
            ["12:30:30", "7.5:15:15", "9:30:30"],
            ["12:30:30", "", "12:30:30"],
            ["3:0:0", "9:15:15", "9:0:0"]
        ],
        ו: [
            ["", "12:30:30", ""],
            ["", "12:30:30", ""],
            ["", "12:30:30", ""]
        ],
        ב: [
            ["3:15:15", "9:15:15", "9:30:30"],
            ["", "", "12:30:30"],
            ["3:15:15", "9:15:15", "9:0:15"]
        ],
        1: [
            ["", "12:30:30", ""],
            ["", "12:30:30", ""],
            ["", "12:30:30", ""]
        ],
        2: [
            ["3:15:15", "9:15:15", "9:30:30"],
            ["6:15:15", "9:15:15", "9:0:0"],
            ["3:0:0", "9:15:15", "9:45:45"]
		],
        3: [
            ["3:15:15", "9:15:15", "9:30:30"],
            ["3:15:15", "9:15:15", "9:30:0"],
            ["3:15:15", "9:15:15", "9:0:0"]
		],
        4: [
            ["12:30:30", "", "12:30:30"],
            ["3:0:0", "9:15:15", "12:30:45"],
            ["", "", "12:30:30"]
		],
        5: [
            ["3:30:30", "9:15:15", "9:45:45"],
            ["3:0:0", "9:15:15", "9:30:30"],
            ["3:15:15", "9:15:15", "9:0:0"]
		]
    };
    this.rows = rows;
    this.columns = columns;
    this.table = document.createElement("table");
    this.currentTimes = new Array();
    var clockRadius = Math.min(width / columns, height / rows) / 2 - 3;

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        var curentRowTimes = new Array();
        for (var j = 0; j < columns; j++) {
            var td = document.createElement("td");
            var canvas = document.createElement("canvas");

            canvas.width = width / columns;
            canvas.height = height / rows;

            this.drawClock(canvas, width / columns / 2, height / rows / 2, clockRadius, null, null, null, true);

            td.appendChild(canvas);
            tr.appendChild(td);
        }

        this.table.appendChild(tr);
        this.currentTimes.push(curentRowTimes);
    }
}

ClockLetter.prototype.getHTMLElement = function () {
    return this.table;
}

ClockLetter.prototype.setLetter = function (letter, isUseAnimation) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            var time = this.letters[letter][i][j];
            var canvas = this.table.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].getElementsByTagName("canvas")[0];
            if (time) {
                time = time.split(":");
                this.drawClock(canvas, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 3, time[0], time[1], time[2], true, isUseAnimation ? 3500 : 0);
            } else {
                this.drawClock(canvas, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 3, null, null, null, true, 0);
            }
        }
    }

    return this;
};

ClockLetter.prototype.setTime = function (Hours, Minutes, Seconds) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            var self = this;
            var canvas = this.table.getElementsByTagName("tr")[i].getElementsByTagName("td")[j].getElementsByTagName("canvas")[0];
            this.currentTimes[i][j] = {
                Hours: Hours,
                Minutes: Minutes,
                Seconds: Seconds
            };
            this.drawClock(canvas, canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2 - 3, Hours, Minutes, Seconds, false, 0);
        }
    }

    return this;
};

ClockLetter.prototype.drawClock = function (Canvas, Cx, Cy, R, Hours, Minutes, Seconds, isNotCordinatedHands, animationDuration) {
    var c = Canvas;
    var ctx = c.getContext("2d");

    if (!isNotCordinatedHands) {
        if (Hours != null && Minutes != null) {
            Hours += (Minutes / 60);
            Minutes += (Seconds / 60);
        }
    }

    if (Hours != null) {
        Hours -= 3;
    }
    if (Minutes != null) {
        Minutes -= 15;
    }
    if (Seconds != null) {
        Seconds -= 15;
    }

    function drawClockHands(c, ctx, R, Hours, Minutes, Seconds, delta) {
        ctx.clearRect(0, 0, c.width, c.height);

        // Boundary
        // var img = new Image();
        // img.src = "clock1.png";
        // ctx.drawImage(img, 0, 0);

        // Middle spot
        if (Hours != null || Minutes != null || Seconds != null) {
            ctx.beginPath();
            ctx.lineWidth = R * 0.2;
            ctx.arc(Cx, Cy, 1, 0, 2 * Math.PI);
            ctx.stroke();
        }

        // Hours hand
        if (Hours != null) {
            ctx.beginPath();
            ctx.lineWidth = R * 0.16;
            ctx.lineCap = "round";
            ctx.moveTo(Cx, Cy);
            ctx.lineTo(Cx + (0.63 * R * Math.cos(30 * delta * Hours * Math.PI / 180)), Cy + (0.65 * R * Math.sin(30 * delta * Hours * Math.PI / 180)));
            ctx.stroke();
        }

        // Minutes
        if (Minutes != null) {
            ctx.beginPath();
            ctx.lineWidth = R * 0.16;
            ctx.lineCap = "round";
            ctx.moveTo(Cx, Cy);
            ctx.lineTo(Cx + (0.80 * R * Math.cos(6 * delta * Minutes * Math.PI / 180)), Cy + (0.85 * R * Math.sin(6 * delta * Minutes * Math.PI / 180)));
            ctx.stroke();
        }

        // Seconds
        if (Seconds != null) {
            ctx.beginPath();
            ctx.lineWidth = R * 0.11;
            ctx.lineCap = "round";
            ctx.moveTo(Cx, Cy);
            ctx.lineTo(Cx + (0.80 * R * Math.cos(6 * delta * Seconds * Math.PI / 180)), Cy + (0.85 * R * Math.sin(6 * delta * Seconds * Math.PI / 180)));
            ctx.lineTo(Cx + -(0.2 * R * Math.cos(6 * delta * Seconds * Math.PI / 180)), Cy + -(0.2 * R * Math.sin(6 * delta * Seconds * Math.PI / 180)));
            ctx.stroke();
        }
    }

    if (animationDuration > 0) {
        animate({
            delay: 80,
            duration: animationDuration,
            delta: function (progress) {
                return progress;
            },
            step: function (delta) {
                drawClockHands(c, ctx, R, Hours, Minutes, Seconds, delta);
            }
        });
    } else {
        drawClockHands(c, ctx, R, Hours, Minutes, Seconds, 1);
    }
};

function animate(opts) {

    var start = new Date();

    var timerId = setInterval(function () {
        var timePassed = new Date() - start;
        var progress = timePassed / opts.duration;

        if (progress > 1) {
            progress = 1;
        }

        var delta = opts.delta(progress);
        opts.step(delta);

        if (progress == 1) {
            clearInterval(timerId);
        }
    }, opts.delay || 10);
}

function getViewport() {
    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewPortWidth = window.innerWidth,
        viewPortHeight = window.innerHeight
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0) {
        viewPortWidth = document.documentElement.clientWidth,
        viewPortHeight = document.documentElement.clientHeight
    }

    // older versions of IE
    else {
        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
        viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
    }
    return [viewPortWidth, viewPortHeight];
}

function HappyNewYear() {
    var clockRadius = getViewport()[0] / 6;
    var board = document.getElementById("board");
    var clocks = new Array(
    new ClockLetter(3, 3, clockRadius, clockRadius),
    new ClockLetter(3, 3, clockRadius, clockRadius),
    new ClockLetter(3, 3, clockRadius, clockRadius),
    new ClockLetter(3, 3, clockRadius, clockRadius),
    new ClockLetter(3, 3, clockRadius, clockRadius),
    new ClockLetter(3, 3, clockRadius, clockRadius),
    new ClockLetter(3, 3, clockRadius, clockRadius));

    for (var i = 0; i < clocks.length; i++) {
        board.appendChild(clocks[i].getHTMLElement());
        if (i == 2) {
            board.appendChild(document.createElement("br"));
        }
    }

    var currentTimeTimerID = 0;

    function tik() {
        var d = new Date();
        for (var i = 0; i < clocks.length; i++) {
            clocks[i].setTime(d.getHours() - 12, d.getMinutes(), d.getSeconds());
        }
        currentTimeTimerID = setTimeout(tik, 1000);
    }

    var lastClockIndex = -1;
    var usedClockIndexes = new Array();
    var countDownNumber = 5;

    function countDown() {
        var clockIndex;
        do {
            clockIndex = Math.floor(Math.random() * clocks.length);
        } while (usedClockIndexes.indexOf(clockIndex) > -1);


        if (lastClockIndex > -1) {
            clocks[lastClockIndex].setTime(null, null, null);
        }
        clocks[clockIndex].setLetter(countDownNumber--, false);

        usedClockIndexes.push(clockIndex);

        lastClockIndex = clockIndex;
        currentTimeTimerID = setTimeout(countDown, 1000);
    }

    //tik();

    setTimeout(function () {
        setTimeout(function () {
            clocks[lastClockIndex].setTime(null, null, null);
            clearTimeout(currentTimeTimerID);
            var i = 0;
            clocks[i++].setLetter("ה", true);
            clocks[i++].setLetter("נ", true);
            clocks[i++].setLetter("ש", true);
            clocks[i++].setLetter("ה", true);
            clocks[i++].setLetter("ב", true);
            clocks[i++].setLetter("ו", true);
            clocks[i++].setLetter("ט", true);
        }, countDownNumber * 1000);
        countDown();
    }, 500);

}

HappyNewYear();