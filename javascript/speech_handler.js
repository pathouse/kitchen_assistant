(function () {
  var SpeechHandler = function (Commands, Dictionary) {
    this.Commands = Commands
    this.Dictionary = new Dictionary(Commands)
    this._loadSpeechRecognition()
    this._bindRecordButton()
  }

  // PRIVATE

  SpeechHandler.prototype._loadSpeechRecognition = function () {
    if (!('webkitSpeechRecognition' in window)) {
      upgrade();
    } else {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = "en-US"
      this.recognition.onstart = this._onSpeechStart.bind(this)
      this.recognition.onerror = this._onSpeechError
      this.recognition.onend = this._onSpeechEnd.bind(this)
      this.recognition.onresult = this._onSpeechEvent.bind(this)
    }
  }

  SpeechHandler.prototype._onSpeechStart = function () {
    $("#recordButton").text("Recording...")
    console.log("Speech Recognition Started")
    this.activeTranscript = ""
  }

  SpeechHandler.prototype._onSpeechEnd = function () {
    $("#recordButton").text("Record")
    console.log("Speech Recognition Stopped")
    this._interpretTranscript()
  }

  SpeechHandler.prototype._onSpeechError = function (event) {
    console.log("Recognition Error!")
    console.log(event)
  }

  SpeechHandler.prototype._onSpeechEvent = function (event) {
    for (var i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        this.activeTranscript += event.results[i][0].transcript
      }
    }
    console.log(this.activeTranscript)
  }

  SpeechHandler.prototype._interpretTranscript = function () {
    var transcript = this.activeTranscript
    var simpleCommandExecuted = this._findAndExecuteSimpleCommand(transcript)
    if (!simpleCommandExecuted) {
      this._findAndExecuteComplexCommand(transcript)
    }
  }

  SpeechHandler.prototype._bindRecordButton = function () {
    var onHandlerClick = function () {
      this.recognition.start()
    }.bind(this)

    $("#recordButton").click(onHandlerClick)
  }

  SpeechHandler.prototype._findAndExecuteSimpleCommand = function (transcript) {
    var matchingCommand = _.find(this.Dictionary.SIMPLE_COMMANDS, function (command) {
      var downcased = _.map(command.keywords, _.lowerCase)
      return _.includes(downcased, _.lowerCase(transcript))
    })
    if (matchingCommand) {
      this.Commands[matchingCommand.command](matchingCommand.args)
    }
  }

  SpeechHandler.prototype._findAndExecuteComplexCommand = function (transcript) {
    var transcriptWords = _.map(transcript.split(" "), _.lowerCase)
    var firstWord = transcriptWords.shift()

    var matchingCommand = _.find(this.Dictionary.COMPLEX_COMMANDS, function (command) {
      var downcaseOptions = _.map(command.prefixOptions, _.lowerCase)
      return _.includes(downcaseOptions, firstWord)
    })

    if (matchingCommand) {
      var matchingTerm = _.find(matchingCommand.argumentOptions, function (option) {
        return _.lowerCase(option) === transcriptWords.join(" ")
      })
      if (matchingTerm) {
        if (matchingCommand.modifyArguments) {
          matchingTerm = matchingCommand.modifyArguments(matchingTerm)
        }
        this.Commands[matchingCommand.command](matchingTerm)
      }
    }
  }

  window.SpeechHandler = SpeechHandler
})()
