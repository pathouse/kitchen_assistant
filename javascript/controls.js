(function () {
  var Controls = function (recipe, Presenter) {
    this.recipe = recipe;
    this.currentStepNumber = 0;
    this._getAudioContext();
    this.alarmReady = false
    this._loadAlarmAudio();
    this.Presenter = new Presenter(this.getAllTerms())
  };

  Controls.prototype.SECTIONS = ["equipment", "ingredients", "instructions", "vocabTerms"];

  Controls.prototype.changeStep = function (change) {
    this.currentStepNumber = this.currentStepNumber + change;
  };

  Controls.prototype.loadStep = function () {
    this.step = _.find(this.recipe.steps, { order: this.currentStepNumber });
  };

  Controls.prototype.read = function (sections) {
    _.each(sections, this.readSection.bind(this))
  };

  Controls.prototype.readSection = function (section) {
    var content;
    if (section === "name") {
      this.Presenter.displayRecipeName(this.recipe.name, this.recipe.image)
    } else if (section === "instructions") {
      content = this._getSectionContent(section);
      this.Presenter.displayRecipeInstructions(content, this.step.title, this.step.image)
    } else {
      content = this._getSectionContent(section, 'name');
      this.Presenter.displaySectionList(content, section)
    }
    // text to speach on the section name then description
  };

  Controls.prototype.describe = function(term) {
    var termObject = this._findTerm(term)
    if (termObject) {
      this.Presenter.displayDescription(termObject.name, termObject.description)
      console.log(termObject)
    } else {
      console.log("Unable to find term [" + term + "]")
    }
  };

  Controls.prototype.show = function(term) {
    var termObject = this._findTerm(term)
    if (termObject) {
      this.Presenter.displayImage(termObject.media)
      console.log(termObject.media)
    } else {
      console.log("Unable to find term [" + term + "]")
    }
  };

  Controls.prototype.startTimer = function () {
    if (this.activeTimer) {
      this.activeTimer.start()
      this.Presenter.timerStarted()
    } else if (this.step && this.step.timer) {
      this.activeTimer = new Timer({
        tick    : 1,
        ontick  : this.Presenter.updateTimer.bind(this.Presenter),
        onstart : function() { console.log('timer started') },
        onstop  : function() { console.log('timer stop') },
        onpause : function() { console.log('timer set on pause') },
        onend   : this._startAlarm.bind(this)
      });
      var timerDuration = this.step.timer.minutes * 60
      this.activeTimer.start(timerDuration)
      this.Presenter.displayTimer()
    }
  };

  Controls.prototype.extendTimer = function () {
    this.activeTimer = new Timer({
      tick    : 1,
      ontick  : function(ms) { console.log(ms + 'milliseconds left') },
      onstart : function() { console.log('timer started') },
      onstop  : function() { console.log('timer stop') },
      onpause : function() { console.log('timer set on pause') },
      onend   : this._startAlarm.bind(this)
    });
    var timerDuration = this.step.timer.extensionMinutes * 60
    // Correct way to do this is actually to add the extension to the duration of the active timer. this is a quick hack for limited functionality
    this.activeTimer.start(timerDuration)
  };

  Controls.prototype.pauseTimer = function () {
    if (this.activeTimer) {
      this.activeTimer.pause()
      this.Presenter.timerPaused()
    }
  };

  Controls.prototype.stopTimer = function () {
    if (this.activeTimer) {
      this.activeTimer.stop()
      this.Presenter.removeTimer()
    }
  };

  Controls.prototype.stopAlarm = function () {
    if (this.audioSource) {
      this.audioSource.stop()
      this.audioSource = null
    }
  };

  Controls.prototype.getAllTerms = function () {
    var sectionsWithTerms = _.without(this.SECTIONS, "instructions")
    return _.flatten(
      _.map(this.recipe.steps, function (step) {
        return _.flatten(
          _.map(sectionsWithTerms, function(section) {
            return _.map(step[section], 'name')
          })
        )
      })
    )
  };

  // PRIVATE

  Controls.prototype._findTerm = function(term) {
    var t = _.map(this.recipe.steps, function (step) {
      return _.map(_.without(this.SECTIONS, 'instructions'), function (section) {
        return _.find(step[section], { name: term })
      }.bind(this))
    }.bind(this))

    return _.first(_.compact(_.flatten(t)))
  };

  Controls.prototype._getAudioContext = function () {
    try {
      this.audioContext = window.AudioContext ? new AudioContext() : new webkitAudioContext()
    } catch (e) {
      alert("Web Audio Not Supported in this Browser");
    }
  };

  Controls.prototype._loadAlarmAudio = function () {
    if (!this.audioContext) { return }

    var request = new XMLHttpRequest();
    request.open("GET", "/media/alarm.wav", true);
    request.responseType = "arraybuffer";

    var onSuccess = function (buffer) {
      this.alarmBuffer = buffer;
      this.alarmReady = true
    }.bind(this);

    var onError = function (error) {
      console.log(error);
    };

    request.onload = function () {
      this.audioContext.decodeAudioData(request.response, onSuccess, onError);
    }.bind(this);

    request.send();
  };

  Controls.prototype._startAlarm = function () {
    if (this.alarmReady && !this.audioSource) {
      this.Presenter.zeroTimer()
      this.audioSource = this.audioContext.createBufferSource()
      this.audioSource.buffer = this.alarmBuffer
      this.audioSource.connect(this.audioContext.destination)
      this.audioSource.loop = true
      this.audioSource.start(0)
    } else {
      window.setTimeout(this._startAlarm.bind(this), 1000)
    }
  },

  Controls.prototype._getSectionContent = function (section, contentType) {
    var content;
    var sectionItems;
    if (section == "name") {
      content = this.recipe.name;
    } else {
      sectionItems = this.step ? this.step[section] : _.flatten(_.map(this.recipe.steps, section))
      if (_.isString(sectionItems)) {
        content = sectionItems
      } else {
        content = _.map(sectionItems, function(item) {
          return getItemContent(item, contentType)
        })
      }
    }
    return content
  };

  function getItemContent(item, contentType) {
    if (_.has(item, contentType)) {
      return _.get(item, contentType)
    } else {
      return itemContentError(item, contentType)
    }
  };

  function itemContentError(item, contentType) {
    return "No attribute [" + contentType + "] on [" + item + "]";
  }

  window.Controls = Controls;
})();
