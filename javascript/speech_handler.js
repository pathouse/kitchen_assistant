(function () {
  var SpeechHandler = function (Commands) {
    this.Commands = Commands
    this._loadSpeechRecognition()
  }

  SpeechHandler.prototype.start = function () {
    this.recognition.start()
  }

  // PRIVATE

  SpeechHandler.prototype.COMMANDS_WITHOUT_ARGUMENTS = [
    {
      keywords: ["start cooking"],
      command: this.Commands.start
    },
    {
      keywords: ["next"],
      command: this.Commands.nextStep },
    {
      keywords: ["previous"],
      command: this.Commands.nextStep },
    {
      keywords: ["read all"],
      command: this.Commands.readAll },
    {
      keywords: ["instructions"],
      command: _.curry(this.Commands.read, ["instructions"])
    },
    {
      keywords: ["start timer", "timer"],
      command: this.Commands.startTimer
    },
    {
      keywords: ["stop timer", "stop"],
      command: this.Commands.stopTimer
    },
    {
      keywords: ["pause timer", "pause"],
      command: this.Commands.pauseTimer
    },
    {
      keywords: ["extend timer", "cook longer"],
      command: this.Commands.extendTimer
    },
    {
      keywords: ["alarm off"],
      command: this.Commands.silenceAlarm
    }
  ]

  SpeechHandler.prototype.COMMANDS_WITH_ARGUMENTS = [
    {
      prefixOptions: ["list"],
      argumentOptions: this.Commands.sectionList,
      command: this.Commands.read
    },
    {
      prefixOptions: ["describe"],
      argumentOptions: this.Commands.termsList,
      command: this.Commands.describe
    },
    {
      prefixOptions: ["show"],
      argumentOptions: this.Commands.termsList,
      command: this.Commands.show
    }
  ]

  SpeechHandler.prototype._loadSpeechRecognition = function () {
    if (!('webkitSpeechRecognition' in window)) {
      upgrade();
    } else {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = "en-US"

      this.recognition.onstart = function () {
        console.log("Speech Recognition Started")
      }

      this.recognition.onerror = function (event) {
        console.log("Recognition Error!")
        console.log(event)
      }

      this.recognition.onend = function () {
        console.log("Speech Recognition Stopped")
      }

      this.recognition.onresult = this.handleSpeechEvent
    }
  }
})()
