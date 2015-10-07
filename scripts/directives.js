
app.directive('d3Example', ['d3Service','$window', function(d3Service, $window) {
  return {
    restrict: 'EA',
    // directive code
    scope: {
      data: '=', // this data is equal to the data in the directive, onClick is equal to the on-click in the directive
      // the
      onClick: '&'  // parent execution binding
    },
    link: function(scope, element, attrs) {
      console.log('hello from horizontal bar directive link', element[0]);

      d3Service.d3().then(function(d3) {
        // our d3 code will go here:
        console.log('attrs', attrs)

        var margin = parseInt(attrs.margin) || 20,
        barHeight = parseInt(attrs.barHeight) || 20,
        barPadding = parseInt(attrs.barPadding) || 5;

        var svg = d3.select(element[0])
          .append("svg")
          .style('width', '100%');

        // Browser onresize event
        window.onresize = function() {
          scope.$apply();
        };

        // Watch for resize event
        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data);
        });

        // watch for data changes and re-render
        scope.$watch('data', function(newVals, oldVals) {
          return scope.render(newVals);
        }, true);

        scope.render = function(data) {
          // our custom d3 code

          // remove all previous items before render
          svg.selectAll('*').remove();
          console.log('svg working variable: ', svg);

          // If we don't pass any data, return out of the element
          if (!data) return;

          // setup variables
          var width = d3.select(element[0]).node().offsetWidth - margin,
              // calculate the height
              height = scope.data.length * (barHeight + barPadding),
              // Use the category20() scale function for multicolor support
              color = d3.scale.category20(),
              // our xScale
              xScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d) {
                  return d.score;
                })])
                .range([0, width]);

          // set the height based on the calculations above
          svg.attr('height', height);

          //create the rectangles for the bar chart
          svg.selectAll('rect')
            .data(data).enter()
              .append('rect')
              .attr('height', barHeight)
              .attr('width', 140)
              .attr('x', Math.round(margin/2))
              .attr('y', function(d,i) {
                return i * (barHeight + barPadding);
              })
              .attr('fill', function(d) { return color(d.score); })
              .on('click', function(d, i) {
                return scope.onClick({item: d});
              })
              .transition()
                .duration(1000)
                .attr('width', function(d) {
                  return xScale(d.score);
                });
          }
      });
    }
  }
}]);

app.directive('d3HeatMap', ['d3Service','$window', function(d3Service, $window) {
  return {
    restrict: 'EA',
    // directive code
    scope: {
      data: '=', // this data is equal to the data in the directive, onClick is equal to the on-click in the directive
      onClick: '&'  // parent execution binding
    },
    link: function(scope, element, attrs) {
      console.log('hello from heat map directive link', element[0]);

      d3Service.d3().then(function(d3) {
        // our d3 code will go here:

        var margin = { top: 20, right: 0, bottom: 20, left: 20 },
            width = 500 - margin.left - margin.right,
            height = 100 - margin.top - margin.bottom,
            gridSize = Math.floor(width / 38),
            legendElementWidth = gridSize*5,
            colors = ["#651FFF", "#FF1744", "#FFD600", "#D500F9", "#FF6D00", "#64DD17", "#00B8D4"],
            days = ["M", "T", "W", "T", "F"],
            weeks = ["A", "", "S", "", "", "", "O", "", "", "", "N", "", "", "", "D", "", "", "", "J", "", "", "", "F", "", "", "", "M", "", "", "", "A", "", "", "", "M", "", "", ""];

        var grid = d3.select(element[0])
            .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Browser onresize event
        window.onresize = function() {
          scope.$apply();
        };

        // Watch for resize event
        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          scope.render(scope.data, grid);
        });

        // watch for data changes and re-render
        scope.$watch('data', function(newVals, oldVals) {
          return scope.render(newVals, grid);
        }, true);

        scope.render = function(data, grid) {
          // our custom d3 code

          // remove all previous items before render
          grid.selectAll('*').remove();

          // If we don't pass any data, return out of the element
          if (!data) return;

          data.forEach(function(d) {
              d.day = moment(d.date, "MM/DD/YYYY").day()
              d.week = moment(d.date, "MM/DD/YYYY").week()
            })

          var colorScale = d3.scale.ordinal()
              .domain(['dw', 'rtd', 'bus', 'carpool', 'skate', 'bike', 'walk'])
              .range(colors);

            var dayLabels = grid.selectAll(".dayLabel")
                .data(days)
                .enter().append("text")
                  .text(function (d) { return d; })
                  .attr("x", 0)
                  .attr("y", function (d, i) { return i * gridSize; })
                  .style("text-anchor", "middle")
                  .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                  .attr("class", "mono");

            // var timeLabels = grid.selectAll(".weekLabel")
            //     .data(weeks)
            //     .enter().append("text")
            //       .text(function(d) {
            //         return d; })
            //       .attr("x", function(d, i) { return i * gridSize; })
            //       .attr("y", 0)
            //       .style("text-anchor", "middle")
            //       .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            //       .attr("class", "mono");

            var heatMap = grid.selectAll(".week")
                .data(data)
                .enter().append("rect")
                .attr("x", function(d) { return (d.week - 1) * gridSize; })
                .attr("y", function(d) { return (d.day - 1) * gridSize; })
                .attr("rx", 6)
                .attr("ry", 6)
                .attr("class", "week bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

            heatMap.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.type); })
                .style("fill-opacity", "50%");

            heatMap.append("title").text(function(d) {
              var title = d.date + ' ' + d.type
              return title; });

            // var legend = grid.selectAll(".legend")
            //     .data(colorScale.domain(), function(d) { return d; })
            //     .enter().append("g")
            //     .attr("class", "legend");
            //
            // legend.append("rect")
            //   .attr("x", function(d, i) { return legendElementWidth * i; })
            //   .attr("y", height)
            //   .attr("width", legendElementWidth)
            //   .attr("height", gridSize)
            //   .attr("class", "bordered")
            //   .attr("rx", 4)
            //   .attr("ry", 4)
            //   .style("fill", function(d, i) { return colors[i]; })
            //   .style("fill-opacity", "50%");
            //
            // legend.append("text")
            //   .attr("class", "mono")
            //   .text(function(d) { return d; })
            //   .attr("x", function(d, i) { return (legendElementWidth * i) + 10; })
            //   .attr("y", height + (gridSize/1.5 ));
          }
      });
    }
  }
}]);

app.directive('d3StackedBar', ['d3Service','$window', function(d3Service, $window) {
  return {
    restrict: 'EA',
    // directive code
    replace: false,
    scope: {
      data: '=', // this data is equal to the data in the directive, onClick is equal to the on-click in the directive
      // the
      onClick: '&'  // parent execution binding
    },
    link: function(scope, element, attrs) {
      console.log('hello from stacked bar directive link', attrs.data);

      d3Service.d3().then(function(d3) {
        // our d3 code will go here:

        // var margin = parseInt(attrs.margin) || 60,
        var margin = {top: 80, right: 150, bottom: 200, left: 50},
        barWidth = parseInt(attrs.barWidth) || 40,
        barPadding = parseInt(attrs.barPadding) || 20,
        width = (650 - margin.left - margin.right),
        height = (600 - margin.top - margin.bottom);

        var chart = d3.select(element[0])
          .append("svg")
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Browser onresize event
        window.onresize = function() {
          scope.$apply();
        };

        // Watch for resize event
        scope.$watch(function() {
          return angular.element($window)[0].innerWidth;
        }, function() {
          console.log('one');
          scope.render(scope.data, chart);
        });

        // watch for data changes and re-render
        scope.$watch('data', function(newVals, oldVals) {
          console.log('two');
          return scope.render(newVals, chart);
        }, true);

        scope.render = function(data, chart) {
          console.log("rendering now!");
          // our custom d3 code

          // remove all previous items before render
          chart.selectAll('*').remove();

          // If we don't pass any data, return out of the element
          if (!data) return;

          // setup variables
          // var height = d3.select(element[0]).node().offsetWidth - margin;
          // var height = 550;

          // calculate the width
          // var width = (scope.data.length * (barWidth + barPadding) - (margin * 4));

          // xScale
          var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .15);
                // .domain(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

          // yScale
          var y = d3.scale.linear()
              .rangeRound([height, 0]);

          // colorScale
          var color = d3.scale.ordinal()
              .range(["#651FFF", "#FF1744", "#FFD600", "#D500F9", "#FF6D00", "#64DD17", "#00B8D4"])
              .domain(['dw', 'rtd', 'bus', 'carpool', 'skate', 'bike', 'walk']);

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

          var formatMonth = function(d) {
              return monthName[d];
              }

          var formatSchool = function(d) {
              return d;
              }

          var formatData;
          attrs.data === "schoolData" ? formatData = formatSchool : formatData = formatMonth

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")
              .tickFormat(formatData); // choose which data set to format based on attrs.data

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .tickFormat(d3.format("d"));

            data.forEach(function(d) {
              var y0 = 0;
              d.types = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
              d.total = d.types[d.types.length - 1].y1;
            });

            if (attrs.data === "schoolData") {
              data.sort(function(a, b) { return b.total - a.total; });
            }

            x.domain(data.map(function(d) {return d.column}));

            y.domain([0, d3.max(data, function(d) { return d.total; })]);

            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
              .selectAll("text")
                .attr("y", 0)
                .attr("x", -9)
                .attr("dy", ".35em")
                .attr("transform", "rotate(-90)")
                .style("text-anchor", "end");

            chart.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", 16)
                // .attr("dy", ".5em")
                .style("text-anchor", "start")
                .attr("class", "legend")
                .text("Trips");

            var column = chart.append("g")
                .selectAll(".column")
                .data(data)
              .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + x(d.column) + ",0)"; });

            column.selectAll("rect")
                .data(function(d) { return d.types; })
              .enter().append("rect")
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.y1); })
                .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                .style("fill", function(d) { return color(d.name); })
                .append("title").text(function(d) {
                  var title = (d.y1 - d.y0) + ' ' + d.name + ' ' + "trips"
                  return title; });

            var legend = chart.selectAll(".legend")
                .data(['dw', 'rtd', 'bus', 'carpool', 'skate', 'bike', 'walk', ''].reverse())
              .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width + 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", width + 50)
                .attr("y", 10)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function(d) { return d; });
          }
      });
    }
  }
}]);
