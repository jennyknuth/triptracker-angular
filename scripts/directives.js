
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
      console.log('hello from stacked bar directive link', element[0]);
      console.log(attrs);

      d3Service.d3().then(function(d3) {
        // our d3 code will go here:

        var margin = parseInt(attrs.margin) || 20,
        // margin = {top: 20, right: 20, bottom: 30, left: 40},
        barWidth = parseInt(attrs.barWidth) || 120,
        barPadding = parseInt(attrs.barPadding) || 20;

        var chart = d3.select(element[0])
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
          console.log('chart: ', chart);

          // If we don't pass any data, return out of the element
          if (!data) return;

          // setup variables
          var height = d3.select(element[0]).node().offsetHeight - margin;

          // calculate the width
          var width = scope.data.length * (barWidth + barPadding);

          // xScale
          var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

          // yScale
          var y = d3.scale.linear()
              .rangeRound([height, 0]);

          // colorScale
          var color = d3.scale.ordinal()
              .range(["#651FFF", "#FF1744", "#FFD600", "#D500F9", "#FF6D00", "#64DD17", "#00B8D4"])
              .domain(['dw', 'rtd', 'bus', 'carpool', 'skate', 'bike', 'walk']);

          // set the height based on the calculations above
          chart.attr('width', width + margin);
          chart.attr('height', height * 3);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .tickFormat(d3.format("d"));

          // var svg = d3.select("body").append("svg")
              // .attr("width", width + margin.left + margin.right)
              // .attr("height", height + margin.top + margin.bottom)
            // .append("g")
              // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            data.forEach(function(d) {
              var y0 = 0;
              d.types = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
              d.total = d.types[d.types.length - 1].y1;
            });

            x.domain(data.map(function(d) {return d.month}));

            y.domain([0, d3.max(data, function(d) { return d.total; })]);

            chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            chart.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Trips");

            var month = chart.selectAll(".month")
                .data(data)
              .enter().append("g")
                .attr("class", "g")
                .attr("transform", function(d) { return "translate(" + x(d.month) + ",0)"; });

            month.selectAll("rect")
                .data(function(d) { return d.types; })
              .enter().append("rect")
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.y1); })
                .attr("height", function(d) { return y(d.y0) - y(d.y1); })
                .style("fill", function(d) { return color(d.name); });

            var legend = chart.selectAll(".legend")
                .data(color.domain().reverse())
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
