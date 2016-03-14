(function () {
  var Presenter = function (termList) {
    this.termList = termList
  }

  Presenter.prototype.displayTimer = function (ms) {
    var seconds = ms / 1000;
    var minutesRemaining = _.round(seconds / 60)
    var secondsRemaining = seconds % 60
    var timerMessage = minutesRemaining + ":" + secondsRemaining
    this._display(timerMessage, "#timerContainer");
    console.log(timerMessage + " - " + ms)
  }

  Presenter.prototype.displayImage = function (url) {
    $("#mainContainer").html('<div class="text-center"><img width="500" height="500" src="' + url + '"></div>')
  }

  Presenter.prototype.displayDescription = function (name, description) {
    debugger
    this.displaySectionList([name, description])
  }

  Presenter.prototype.displayRecipeName = function(name) {
    var htmlContent = tag("h3", "Today's Menu", "text-center")
    htmlContent += tag("p", name, "lead")
    var div = tag("div", htmlContent, "text-center")
    $("#mainContainer").html(htmlContent)
  }

  Presenter.prototype.displayRecipeInstructions = function (instructions) {
    this.displaySectionList(instructions.split("."), "instructions")
  }

  Presenter.prototype.displaySectionList = function (list, sectionName) {
    var isInstructions = sectionName === "instructions"
    var alignmentClass = isInstructions ? "text-left" : "text-center"
    var htmlContent = _.map(list, function(sentence) {
      return tag("li", _.trim(sentence), "lead")
    }.bind(this)).join("")
    var div = tag("ul", htmlContent, "list-unstyled " + alignmentClass)
    $("#mainContainer").html(div)
  }

  function tag(divType, content, classes) {
    return '<' + divType + ' class="' + classes + '">' + content + "</div>";
  };

  window.Presenter = Presenter
})()
