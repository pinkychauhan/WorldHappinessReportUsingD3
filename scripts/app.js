const regionNames = ["Australia and New Zealand", "Central and Eastern Europe", "Eastern Asia", "Latin America and Caribbean",
  "Middle East and Northern Africa", "North America", "Southeastern Asia", "Southern Asia", "Sub-Saharan Africa",
  "Western Europe"
];
const color = ['pink', 'lightyellow', 'lightgreen', 'lightcyan', 'lightblue', 'violet', 'grey'];
const labels = ['Economy', 'Perception of Corruption', 'Freedom', 'Social Support', 'Generosity',
  'Health', 'Dystopia Residual'
];

var data = [];
var previousData = [];
var year;
var piedata = [];

var sumEconomy = 0;
var sumSocial = 0;
var sumFreedom = 0;
var sumGenerosity = 0;
var sumCorruptionPerception = 0;
var sumHealth = 0;
var sumDystopiaResidual = 0;
var sumHappinessScore = 0;
var topCountries = [];
var selectedRegions = [];


async function init() {
  this.year = getSelectedYear();
  this.previousData = data;
  var dataUrlForYear = "https://raw.githubusercontent.com/pinkychauhan89/cs498dataviz/master/data/" + this.year + ".csv";
  this.data = await d3.csv(dataUrlForYear);
  displayCharts();

}

function displayCharts() {
  sumEconomy = 0;
  sumSocial = 0;
  sumFreedom = 0;
  sumGenerosity = 0;
  sumCorruptionPerception = 0;
  sumHealth = 0;
  sumDystopiaResidual = 0;
  sumHappinessScore = 0;
  topCountries = [];
  this.selectedRegions = [];

  this.selectedRegions = getSelectedRegions();

  var counter = 0;
  var i, j;
  for (j = 0; j < data.length; j++) {
    for (i = 0; i < selectedRegions.length; i++) {
      if (selectedRegions[i] === data[j].Region) {
        counter = counter + 1;
        sumEconomy = sumEconomy + parseFloat(data[j].Economy);
        sumSocial = sumSocial + parseFloat(data[j].SocialSupport);
        sumFreedom = sumFreedom + parseFloat(data[j].Freedom);
        sumGenerosity = sumGenerosity + parseFloat(data[j].Generosity);
        sumCorruptionPerception = sumCorruptionPerception + parseFloat(data[j].PerceptionOfCorruption);
        sumHealth = sumHealth + parseFloat(data[j].Health);
        sumDystopiaResidual = sumDystopiaResidual + parseFloat(data[j].DystopiaResidual);
        if (counter <= 10) {
          topCountries.push(data[j].Country);
        }
      }
    }
  }


  piedata = [sumEconomy / counter, sumSocial / counter, sumFreedom / counter, sumGenerosity / counter, sumCorruptionPerception / counter,
    sumHealth / counter, sumDystopiaResidual / counter
  ];

  displayBarChart();
  displayPieChart();
  displayTopCountries();
  displayScatterChart();

}



function displayBarChart() {
  width = 0.9 * screen.width;
  height = 350;
  margin = 50;


  d3.selectAll("rect").remove();
  d3.select("#leftAxis").remove();
  d3.selectAll("#bottomAxis").remove();
  d3.selectAll("path").remove();
  d3.selectAll("circle").remove();
  d3.selectAll("g").remove();
  d3.select(".baryearlabel").selectAll("h3").remove();
  d3.select(".pieyearlabel").selectAll("h3").remove();
  d3.select(".scatteryearlabel").selectAll("h3").remove();
  d3.selectAll(".annotation").remove();

  d3.select(".baryearlabel").append("h3").html("Happiness scores and ranking of countries for the year: " + year);
  d3.select(".pieyearlabel").append("h3").html("Contribution of major factors to happiness score for the year: " + year);
  d3.select(".scatteryearlabel").append("h3").html("Scatter plot between heath and social support for the year: " + year);

  d3.select(".barchart")
    .style("opacity", 1)
    .attr("width", width + (2 * margin))
    .attr("height", height + (2 * margin))

  d3.selectAll("fieldset").style("opacity", 1)



  const maxHappinessScore = 10;
  const maxRank = data.length;

  var x = d3.scaleLinear().domain([0, maxRank]).range([0, width]);
  var y = d3.scaleLinear().domain([0, maxHappinessScore]).range([0, height]);
  var neg_y = d3.scaleLinear().domain([0, maxHappinessScore]).range([height, 0]);
  var color = d3.scaleLinear().domain([0, maxHappinessScore]).range(["red", "green"]);

  var tooltip = d3.select("#tooltip");

  d3.select(".charts").style("height", height);

  d3.select(".barchart")
    .append("g").attr("id", "main")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .selectAll("rect").data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return x(i)
    })
    .attr("width", 0.9 * (width / data.length))
    .attr("height", function(d, i) {
      if (previousData != null && previousData != undefined && previousData.length >= (i + 1)) {
        return y(previousData[i].HappinessScore);
      } else return 4;
    })
    .attr("y", function(d, i) {
      if (previousData != null && previousData != undefined && previousData.length >= (i + 1)) {
        return height - y(previousData[i].HappinessScore);
      } else return height;
    })
    .style("fill", function(d, i) {
      var selected = false;
      var i;
      for (i = 0; i < selectedRegions.length; i++) {
        if (selectedRegions[i] === d.Region) {
          selected = true;
          break;
        }
      }
      if (selected) {
        return color(d["HappinessScore"])
      } else {
        return "white";
      }
    })
    .style("stroke", function(d, i) {
      var selected = false;
      var i;
      for (i = 0; i < selectedRegions.length; i++) {
        if (selectedRegions[i] === d.Region) {
          selected = true;
          break;
        }
      }
      if (selected) {
        return "black";
      } else {
        return "white";
      }
    })
    .attr("class", function(d, i) {
      var selected = false;
      var i;
      for (i = 0; i < selectedRegions.length; i++) {
        if (selectedRegions[i] === d.Region) {
          selected = true;
          break;
        }
      }
      if (selected) {
        return "displayChart"
      } else {
        return "notdisplayChart";
      }
    })
    .attr("id", function(d, i) {
      return d.Country;
    })
    .on("mousemove", function(d, i) {
      //console.log(this);

      if (d3.select(this).attr("class") === 'displayChart') {
        tooltip
          .style("opacity", 1)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY + 10) + "px")
          .html("Country: " + d["Country"] + "<br/>Region:" + d["Region"] + "<br/>Happiness Rank: " + d["HappinessRank"] +
            "<br/>Happiness Score: " + d["HappinessScore"] + "<br/>Economy (GDP per Capita):" + d["Economy"] +
            "<br/>Health (Life Expectancy): " + d["Health"])
      }
    })
    .on("mouseleave", function(d, i) {
      tooltip.style("opacity", 0)
    })
    .transition().duration(500)
    .attr("height", function(d, i) {
      return y(d["HappinessScore"])
    })
    .attr("y", function(d, i) {
      return height - y(d["HappinessScore"])
    });


  d3.select(".barchart")
    .append("g").attr("id", "leftAxis").attr("transform", "translate(" + margin + "," + margin + ")")
    .call(d3.axisLeft(neg_y));

  d3.select(".barchart")
    .append("g").attr("id", "bottomAxis").attr("transform", "translate(" + margin + "," + (height + margin) + ")")
    .call(d3.axisBottom(x));


  var topCountryInEachSelectedRegion = [];
  var selectedRegionsWithCountryIdentified = [];
  var selectedTopMostCountriesScore = [];
  var selectedTopMostCountriesRank = [];

  var a, b, c;
  for (a = 0; a < data.length; a++) {
    for (b = 0; b < selectedRegions.length; b++) {
      if (data[a].Region === selectedRegions[b]) {
        var countryFound = false;
        for (c = 0; c < selectedRegionsWithCountryIdentified.length; c++) {
          if (data[a].Region === selectedRegionsWithCountryIdentified[c]) {
            countryFound = true;
            break;
          }
        }
        if (countryFound == false) {
          topCountryInEachSelectedRegion.push(data[a].Country);
          selectedRegionsWithCountryIdentified.push(data[a].Region);
          selectedTopMostCountriesScore.push(data[a].HappinessScore);
          selectedTopMostCountriesRank.push(data[a].HappinessRank);
        }
      }
    }
  }

  console.log(topCountryInEachSelectedRegion);
  console.log(selectedRegionsWithCountryIdentified);
  console.log(selectedTopMostCountriesScore);
  console.log(selectedTopMostCountriesRank);

  d3.select(".annotations")
    .selectAll(".annotation").data(selectedTopMostCountriesRank).enter().append("div")
    .attr("class", "annotation")
    .style("opacity", 1)
    .style("left", function(d, i) {
      return (x(d) - 17) + "px"
    })
    .style("top", function(d, i) {
      return (95 + height - y(selectedTopMostCountriesScore[i])) + "px"
    })
    .html(function(d, i) {
      return selectedRegionsWithCountryIdentified[i] + " (" + topCountryInEachSelectedRegion[i] + ")";
    })
}

function displayPieChart() {
  var radius = 160;
  var pie = d3.pie();
  var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);
  var label = d3.arc()
    .outerRadius(radius + 60)
    .innerRadius(radius);

  d3.select(".piechart")
    .style("opacity", 1)
    .style("position", "relative")
    .style("float", "right")
    .attr("width", 550)
    .attr("height", 460);

  var g = d3.select(".piechart")
    .append("g").attr("transform", "translate(250, 220)");

  var arc = g.selectAll(".arc")
    .data(pie(piedata))
    .enter().append("g")
    .attr("class", "arc");
  arc.append("path")
    .attr("d", path)
    .attr("fill", function(d, i) {
      return color[i];
    });

  arc.append("text")
    .attr("transform", function(d, i) {
      return "translate(" + label.centroid(d) + ")";
    })
    .text(function(d, i) {
      return labels[i] + '\n' + piedata[i].toFixed(2);
    });

}

function displayTopCountries() {
  console.log(topCountries);
  d3.select(".topCountriesList").selectAll("ul").remove();
  d3.select(".topCountriesList").append("ul").selectAll("li")
    .data(topCountries)
    .enter()
    .append("li")
    .html(function(d, i) {
      return d;
    })

}

function displayScatterChart() {
  var x_axis = d3.scaleLinear().domain([0, 1.5]).range([0, 600]);
  var y_axis = d3.scaleLinear().domain([0, 2]).range([0, 400]);
  var neg_y_axis = d3.scaleLinear().domain([0, 2]).range([400, 0]);
  var color_axis = d3.scaleLinear().domain([0, 3]).range(["red", "green"]);

  var tooltip = d3.select("#tooltip");

  d3.select(".scatterchart")
    .style("opacity", 1)
    .style("position", "relative")
    .style("float", "right")
    .attr("width", 700)
    .attr("height", 500);

  d3.select(".scatterchart").append("g")
    .attr("transform", "translate(" + margin + ", " + margin + ")")
    .selectAll("circle").data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) {
      return x_axis(d.Health);
    })
    .attr("cy", function(d, i) {
      return 400 - y_axis(d.SocialSupport)
    })
    .attr("r", 4)
    .attr("stroke", "black")
    .attr("fill", function(d, i) {
      return color_axis(parseFloat(d.Health) + parseFloat(d.SocialSupport));
    })
    .on("mouseover", function(d, i) {
      tooltip
        .style("opacity", 1)
        .style("left", (d3.event.pageX + 4) + "px")
        .style("top", (d3.event.pageY + 5) + "px")
        .style("border", "solid 1px")
        .html(d.Country + "<br/>" + d.Region + "<br/>" + d.Health + "<br>" + d.SocialSupport);
    })
    .on("mouseout", function(d, i) {
      tooltip.style("opacity", 0)
        .html("");
    });


  d3.select(".scatterchart")
    .append("g")
    .attr("transform", "translate(" + margin + ", " + margin + ")")
    .call(d3.axisLeft(neg_y_axis));

  d3.select(".scatterchart")
    .append("g")
    .attr("transform", "translate(" + margin + ", " + (400 + margin) + ")")
    .call(d3.axisBottom(x_axis));


}

function getSelectedRegions() {
  var selectedRegions = [];
  var regions = document.getElementsByName("regions");
  for (var i = 0; i < regions.length; i++) {
    if (regions[i].checked) {
      if (regions[i].value === 'All') {
        selectedRegions = regionNames;
        break;
      }
      selectedRegions.push(regions[i].value);
    }
  }
  return selectedRegions;
}

function getSelectedYear() {
  var selectedYear = 2015;
  var years = document.getElementsByName("year");
  for (var i = 0; i < years.length; i++) {
    if (years[i].checked) {
      selectedYear = year[i];
      break;
    }
  }
  return selectedYear;
}
