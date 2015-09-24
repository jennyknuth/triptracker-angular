// compute total distance for user here

// compute total $ for user here

app.filter('colorMap', function () {
  return function (input) {
    var color = {
      "rtd": "rgba(198,40,40, .5)",
      "carpool": "rgba( 213, 0, 249, .5)",
      "bus": "rgba(255,193,7, .5)",
      "dw": "rgba(101,31,255, .5)",
      "walk": "rgba(21,101,192, .5)",
      "bike": "rgba(0,121,107, .5)",
      "skate": "rgba(239,108,0, .5)"
    }
    return {'background-color': color[input]}

  };
});

app.filter('tripType', function () {
  return function (input) {
    var type = {
      "rtd": "rtd",
      "carpool": "carpool",
      "bus": "school bus",
      "dw": "drive/walk",
      "walk": "walk",
      "bike": "bike",
      "skate": "skate/scoot"
    }
    return type[input]
  }

})

app.filter('monthName', function () {
  return function (input) {
    var monthName = {
      0: "Jan",
      1: "Feb",
      2: "Mar",
      3: "Apr",
      4: "May",
      5: "Jun",
      6: "Jul",
      7: "Aug",
      8: "Sep",
      9: "Oct",
      10: "Nov",
      11: "Dec"
    }
    return monthName[input]
  }
})
