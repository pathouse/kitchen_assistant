(function () {
  var Controls = function (recipe, Presenter, SoundHandler) {
    this.recipe = recipe;
    this.currentStepNumber = 0;
    this.SoundHandler = new SoundHandler()
    this.Presenter = new Presenter(this.getAllTerms())
    this.actionHistory = []
    this.narrationIndex = 0
  };

  Controls.prototype.SECTIONS = ["equipment", "ingredients", "instructions", "vocabTerms"];

  Controls.prototype.goBackHistory = function () {
    var currentStep = this.actionHistory.pop()
    var previousStep = this.actionHistory.pop()
    this[_.get(previousStep, "action")](_.get(previousStep, "args"))
  },

  Controls.prototype.readNarration = function () {
    if (!this.activeNarration) { return }
    if (_.isString(this.activeNarration)) {
      this.SoundHandler.play([this.activeNarration])
    } else {
      var idx = this.narrationIndex
      if (idx === this.activeNarration.length - 1) {
        this.changeStep(1)
      }
      this.SoundHandler.play([this.activeNarration[idx]])
      this.narrationIndex++
    }
  }

  Controls.prototype.repeatNarration = function () {
    if (!this.activeNarration) { return }
    if (_.isString(this.activeNarration)) {
      this.SoundHandler.play([this.activeNarration])
    } else {
      var idx = this.narrationIndex
      this.SoundHandler.play([this.activeNarration[idx - 1]])
    }
  }

  Controls.prototype.readAllNarrations = function () {
    if (!this.activeNarration) { return }
    this.narrationIndex = 0
    this.SoundHandler.play(this.activeNarration)
  }

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
    this.actionHistory.push({ action: "readSection", args: section })
    var content;
    if (section === "name") {
      this.Presenter.displayRecipeName(this.recipe.name, this.recipe.image)
      this._updateActiveNarration(this.recipe.narration)
      this.readNarration()
    } else if (section === "instructions") {
      content = this._getSectionContent(section);
      this._updateActiveNarration(this.step.narration)
      this.Presenter.displayRecipeInstructions(content, this.step.title, this.step.image)
      this.readNarration()
    } else {
      var sectionNameNarrations = _.map(this._getSectionContent(section, "narration"), _.first)
      this._updateActiveNarration(sectionNameNarrations)
      content = this._getSectionContent(section, 'name');
      this.Presenter.displaySectionList(content, section)
    }
    // text to speach on the section name then description
  };

  Controls.prototype.describe = function(term) {
    this.actionHistory.push({ action: "describe", args: term })
    var termObject = this._findTerm(term)
    if (termObject) {
      this._updateActiveNarration(termObject.narration)
      this.Presenter.displayDescription(termObject.name, termObject.description)
      console.log(termObject)
      this.readAllNarrations()
    } else {
      console.log("Unable to find term [" + term + "]")
    }
  };

  Controls.prototype.show = function(term) {
    this.actionHistory.push({ action: "show", args: term })
    var termObject = this._findTerm(term)
    if (termObject) {
      this.Presenter.displayImage(termObject.media)
      console.log(termObject.media)
    } else {
      console.log("Unable to find term [" + term + "]")
    }
  };

  Controls.prototype.startTimer = function () {
    var onTick = function (ms) {
      this.Presenter.updateTimer(ms)
      var announcements = this.step.timer.announcements
      if (announcements) {
        var currentAnnouncement = _.find(announcements, { ms: ms })
        if (!currentAnnouncement) { return }
        this._updateActiveNarration(currentAnnouncement.narration)
        this.readNarration()
      }
    }.bind(this)
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
        onend   : this.SoundHandler.startAlarm.bind(this.SoundHandler)
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
      onend   : this.SoundHandler.startAlarm.bind(this.SoundHandler)
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
      this.SoundHandler.stopAlarm()
      this.Presenter.removeTimer()
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

  Controls.prototype._updateActiveNarration = function (narration) {
    this.narrationIndex = 0
    this.activeNarration = narration
  }

  Controls.prototype._findTerm = function(term) {
    var t = _.map(this.recipe.steps, function (step) {
      return _.map(_.without(this.SECTIONS, 'instructions'), function (section) {
        return _.find(step[section], { name: term })
      }.bind(this))
    }.bind(this))

    return _.first(_.compact(_.flatten(t)))
  };

  Controls.prototype._startAlarm = function () {
    this.Presenter.zeroTimer()
    this.SoundHandler.startAlarm()
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
