(function (root, factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) define([], factory)
  else if (typeof exports === 'object') module.exports = factory()
  else root.Controls = factory(require("lodash"))
}(this, function (_) {

  var Controls = function (recipe) {
    this.recipe = recipe;
    this.currentStepNumber = 0;
    this.Timer = new Timer();
  };

  Controls.prototype.changeStep = function (change) {
    this.currentStepNumber = this.currentStepNumber + change;
  };

  Controls.prototype.loadStep = function () {
    this.step = _.find(this.recipe.steps, { order: this.currentStep});
  };

  Controls.prototype.readAll = function () {
    this.read(["equipment", "ingredients", "instructions"]);
  };

  Controls.prototype.read = function (sections) {
    _.each(sections, function (section) {
      var content = this._getSectionContent(section);
      // text to speach on the section name then description
    })
  };

  Controls.prototype.startTimer = function () {
    this.activeTimer = new Timer({
      tick    : 1,
      onstart : function() { console.log('timer started') },
      onstop  : function() { console.log('timer stop') },
      onpause : function() { console.log('timer set on pause') }
     // onend: activateAlarm
    });
    var timerDuration = this.step.timer.minutes * 60
    this.activeTimer.start(timerDuration)
  };

  Controls.prototype.extendTimer = function () {
    this.activeTimer = new Timer({
      tick    : 1,
      onstart : function() { console.log('timer started') },
      onstop  : function() { console.log('timer stop') },
      onpause : function() { console.log('timer set on pause') }
      // onend: activateAlarm
    });
    var timerDuration = this.step.timer.extensionMinutes * 60
    // Correct way to do this is actually to add the extension to the duration of the active timer. this is a quick hack for limited functionality
    this.activeTimer.start(timerDuration)
  };

  Controls.protototype.pauseTimer = function () {
    if (!this.activeTimer) return
    this.activeTimer.pause()
  };

  Controls.prototype.stopTimer = function () {
    if (!this.activeTimer) return
    this.activeTimer.stop()
  };

  Controls.prototype._getSectionContent = function (section) {
    var content;
    if (section == "name") {
      content = this.recipe.name;
    } else {
      var sectionList = this.recipe[section];
      content = this._arrayToSentences(
        _.map(sectionList, this._getItemContent)
      );
    }
  };

  Controls.prototype._arrayToSentences = function(array) {
    return _.join(array, ". ");
  };

  Controls.prototype._getItemContent = function (item) {
    return this._arrayToSentences([item.name, item.description]);
  };

  return Controls;
}
