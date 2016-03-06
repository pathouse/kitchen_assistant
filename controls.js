var _ = require("lodash");

var Controls = {
  currentStep: 0,

  setRecipe: function(recipe) {
    this.recipe = recipe;
  },

  readStep: function () {
    var step = _.find(this.recipe.steps, { order: this.currentStep});
    this.readAll()
  },

  readAll: function () {
    this.read(["equipment", "ingredients", "instructions"])
  },

  read: function (section) {
    // text to speach on the section name then description
  }
}
