(function (root, factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) define([], factory)
  else if (typeof exports === 'object') module.exports = factory()
  else root.Commands = factory()
}(this, function () {

  var Commands = function (Controls) {
    this.Controls = Controls;
  }

  Commands.prototype.addControls = function (Controls) {
    this.Controls = Controls;
  },

  Commands.prototype.start = function () {
    this.Controls.loadStep();
    this.Controls.readAll();
  },

  Commands.prototype.move = function (direction) {
    this.Controls.changeStep(direction);
    this.Controls.loadStep();
    this.Controls.readAll();
  },

  Commands.prototype.read = function (sections) {
    this.Controls.read(sections);
  },

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
  };

  Commands.prototype.describe = function (item) {
  };

  Commands.prototype.list = function (itemType) {
  };

  Commands.prototype.show = function (item) {
  };

  return Commands;
}
