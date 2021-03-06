(function () {
  var VoiceCommandDictionary = function (Commands) {
    this.Commands = Commands
    this._init()
  }

  VoiceCommandDictionary.prototype._init = function () {
    this.SIMPLE_COMMANDS = [
      {
        keywords: ["what's for dinner",
                   "what's the name of this recipe",
                   "what is the name of this recipe",
                   "what's this called",
                   "what is this called"],
        command: "read",
        args: ["name"]
      },
      {
        keywords: ["start cooking", "let's get started"],
        command: "start"
      },
      {
        keywords: ["read",
                   "speak",
                   "what's next",
                   "okay what's next"],
        command: "say"
      },
      {
        keywords: ["what was that",
                   "can you repeat that",
                   "say again please",
                   "repeat that "],
        command: "sayAgain"
      },
      {
        keywords: ["read it all", "read everything"],
        command: "sayAll"
      },
      {
        keywords: ["Next Step"],
        command: "nextStep" },
      {
        keywords: ["previous", "previous step"],
        command: "previousStep"
      },
      {
        keywords: ["go back", "back"],
        command: "previousAction"
      },
      {
        keywords: ["instructions", "what do I do now", "back to instructions"],
        command: "read",
        args: ["instructions"]
      },
      {
        keywords: ["start timer", "timer"],
        command: "startTimer"
      },
      {
        keywords: ["stop timer", "stop"],
        command: "stopTimer"
      },
      {
        keywords: ["pause timer", "paws", "pause"], // kind of funny that 'pause' said by itself returns "paws"
        command: "pauseTimer"
      },
      {
        keywords: ["extend timer", "cook longer"],
        command: "extendTimer"
      },
      {
        keywords: ["alarm off", "off", "turn off alarm"],
        command: "silenceAlarm"
      },
      {
        keywords: ["what ingredients do I need"],
        command: "read",
        args: ["ingredients"]
      },
      {
        keywords: ["what equipment do I need"],
        command: "read",
        args: ["equipment"]
      }
    ]

    this.COMPLEX_COMMANDS = [
      {
        prefixOptions: ["list"],
        argumentOptions: this.Commands.sectionList,
        command: "read",
        modifyArguments: function(args) { return [args] }
      },
      {
        prefixOptions: ["what's", "describe"],
        argumentOptions: this.Commands.termsList,
        command: "describe"
      },
      {
        prefixOptions: ["display"],
        argumentOptions: this.Commands.termsList,
        command: "show"
      }
    ]
  }

  window.VoiceCommandDictionary = VoiceCommandDictionary
})()
