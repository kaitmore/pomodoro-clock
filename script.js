$(document).ready(function() {
  var output = $(".timer");
  //flags
  var clockFlag = true;
  var pauseClicked = true;
  //set inital lengths
  var sessionLength = 25;
  var breakLength = 5;
 var audio = new Audio('http://www.threecaster.com/wavy/dkbell.wav');
 
  //output default timings to timer
  output.text(sessionLength + ":00");
  $("#pause").hide();
  //User set session length
  $('#seshDown, #seshUp').click(function() {
    if (this.id === "seshUp") {
      ++sessionLength;
      $("#sessionDisplay").text(sessionLength);
      $(".timer").text(sessionLength + ":00");
    } else {
      if (sessionLength > 1) {
        --sessionLength;
        $("#sessionDisplay").text(sessionLength);
        $(".timer").text(sessionLength + ":00");
      }
    }

  });
  //User set break length
  $('#breakDown, #breakUp').click(function() {
    if (this.id === "breakUp") {
      ++breakLength;
      $("#breakDisplay").text(breakLength);
    } else {
      if (breakLength > 1) {
        --breakLength;
        $("#breakDisplay").text(breakLength);
      }
    }
  });

  //Start button
  $("#start").click(function() {
    //grab lengths for timer and set lengths in Clock object
    var sLen = $("#sessionDisplay").text() * 60;
    var bLen = $("#breakDisplay").text() * 60;
    Clock.totalSeconds = sLen;
    Clock.lengths = [sLen, bLen];
    Clock.start();
    $("#start").hide();
    $("#pause").show();
    $(".userSet").hide();
    audio.play();
  });
  //pause button

  $("#pause").click(function() {

    if (pauseClicked) {
      pauseClicked = false;
      Clock.pause();
      $("#pause").text("RESUME");
      output.addClass("stop");

    } else if (!pauseClicked) {
      Clock.resume();
      $("#pause").text("PAUSE");
      output.removeClass("stop").addClass("go");
      pauseClicked = true;
    }
  });
  //reset button, resets clock to user inputted values
  $("#reset").click(function() {
    Clock.pause();
    output.text(sessionLength + ":00");
    output.removeClass("stop").removeClass("go");
    $("#start").show();
    $("#pause").hide();
    $(".userSet").show();
  });

  //clock object
  var Clock = {
    totalSeconds: 0,

    start: function() {
      var self = this;

      this.interval = setInterval(function() {

        self.totalSeconds -= 1;
        //calcuate min/sec
        var minutes = Math.floor(self.totalSeconds / 60 % 60);
        var seconds = parseInt(self.totalSeconds % 60);
        //format min/sec
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        //output timer
        if (clockFlag === true) {
          output.removeClass("stop").addClass("go").text(minutes + ":" + seconds);
        } else {
          output.removeClass("go").addClass("stop").text(minutes + ":" + seconds);
        }

        if (self.totalSeconds === 0 && clockFlag) {
          self.totalSeconds = self.lengths[1];
          clockFlag = false;
          audio.play();
        } else if (self.totalSeconds === 0 && !clockFlag) {
          self.totalSeconds = self.lengths[0];
          clockFlag = true;
          audio.play();
        }
      }, 1000);
    },

    pause: function() {
      clearInterval(this.interval);
      delete this.interval;
    },

    resume: function() {
      if (!this.interval) this.start();
    }
  };

});