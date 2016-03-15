(function () {

  var AssistantRunner = function () {
    this._loadRecipeData()
  };

  // PRIVATE

  AssistantRunner.prototype._loadRecipeData = function () {
    var onLoadRecipeData = function (data) {
      this._controls = new Controls(data, Presenter, SoundHandler)
      this._commands = new Commands(this._controls)
      this._speechHandler = new SpeechHandler(this._commands, VoiceCommandDictionary)
    }.bind(this)

    $.getJSON("/data/recipe.json", onLoadRecipeData)
  };

  window.AssistantRunner = AssistantRunner
})()

var testRunner = new AssistantRunner



