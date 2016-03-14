(function () {
  var Commands = function (Controls) {
    this.Controls = Controls;
    this._loadTerms()
  }

  Commands.prototype.start = function () {
    this.Controls.loadStep();
    this.Controls.read(["instructions"]);
  };

  Commands.prototype.nextStep = function () {
    this._move(1)
  };

  Commands.prototype.previousStep = function () {
    this._move(-1)
  };

  Commands.prototype._move = function (direction) {
    this.Controls.changeStep(direction);
    this.Controls.loadStep();
    this.Controls.read(["instructions"]);
  };

  Commands.prototype.read = function (sections) {
    this.Controls.read(sections);
  };

  Commands.prototype.startTimer = function () {
    this.Controls.startTimer();
  };

  Commands.prototype.stopTimer = function () {
    this.Controls.stopTimer();
  };

  Commands.prototype.pauseTimer = function () {
    this.Controls.pauseTimer();
  };

  Commands.prototype.extendTimer = function () {
    this.Controls.extendTimer();
  };

  Commands.prototype.silenceAlarm = function () {
    this.Controls.stopAlarm();
  };

  Commands.prototype.describe = function (term) {
    this.Controls.describe(term)
  };

  Commands.prototype.show = function (term) {
    this.Controls.show(term)
  };

  // USED BY SPEECH HANDLER

  Commands.prototype._loadTerms = function () {
    this.sectionList = this.Controls.SECTIONS
    this.termsList = this.Controls.getAllTerms()
  }

  window.Commands = Commands
})();
