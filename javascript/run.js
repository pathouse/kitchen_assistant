var onLoadRecipeData = function (data) {
  var controls = new Controls(data)
  var commands = new Commands(controls)
}

$.getJSON("/data/recipe.json", onLoadRecipeData)

