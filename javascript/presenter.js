(function () {
  var Presenter = function (termList) {
    this.termList = termList
  }

  Presenter.prototype.timerPaused = function () {
    $(".timer-header").html("PAUSED")
  }

  Presenter.prototype.removeTimer = function () {
    $(".timer-panel").remove()
  }

  Presenter.prototype.timerStarted = function () {
    $(".timer-header").html("Timer")
  }

  Presenter.prototype.updateTimer = function (ms) {
    var seconds = ms / 1000;
    var minutesRemaining = _.floor(seconds / 60)
    var secondsRemaining = _.round(seconds % 60)
    var timerMessage = minutesRemaining + ":" + secondsRemaining
    $(".timer-body").html(tag("h4", timerMessage, "text-center"))
  }

  Presenter.prototype.zeroTimer = function () {
    $(".timer-body").html(tag("h2", "0:00", "text-center"))
    $(".timer-header").html(tag("h2", "TIMES UP", "text-center text-danger"))
  }

  Presenter.prototype.displayTimer = function () {
    var panelBody = tag("div", "0:00", "panel-body timer-body")
    var panelHeader = tag("div", "Timer", "panel-heading timer-header")
    var htmlContent = tag("div", panelHeader + panelBody, "panel panel-default timer-panel" )
    $("#timerContainer").html(htmlContent)
  }

  Presenter.prototype.displayImage = function (url) {
    var htmlContent = imgTag(url)
    htmlContent = tag("div", htmlContent, "text-center")
    $("#mainContainer").html(htmlContent)
  }

  Presenter.prototype.displayDescription = function (name, description) {
    debugger
    this.displaySectionList([name, description])
  }

  Presenter.prototype.displayRecipeName = function(name, imgUrl) {
    var htmlContent = tag("h3", "Today's Menu", "text-center")
    htmlContent += tag("p", name, "lead")
    htmlContent += imgTag(imgUrl)
    var div = tag("div", htmlContent, "text-center")
    $("#mainContainer").html(htmlContent)
  }

  Presenter.prototype.displayRecipeInstructions = function (instructions, title, imageUrl) {
    this.displaySectionList(instructions.split("."), "instructions", title, imageUrl)
  }

  Presenter.prototype.displaySectionList = function (list, sectionName, title, imageUrl) {
    var isInstructions = sectionName === "instructions"
    var alignmentClass = isInstructions ? "text-left" : "text-center"
    var htmlContent = _.map(list, function(sentence) {
      return tag("li", _.trim(sentence), "lead")
    }.bind(this)).join("")
    var div = tag("ul", htmlContent, "list-unstyled " + alignmentClass)
    if (imageUrl) {
      div += imgTag(imageUrl)
    }
    if (title) {
      div = tag("h3", title, "text-center") + div
    }
    $("#mainContainer").html(div)
  }

  function tag(divType, content, classes) {
    return '<' + divType + ' class="' + classes + '">' + content + "</div>";
  };

  function imgTag(src) {
    return '<img src="' + src + '" style="max-width: 700px;"/>'
  }

  window.Presenter = Presenter
})()
