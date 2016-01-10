/*global console, d3, $ */
function creationPie(donnees, paysVoulu){
	
	var pieChart = d3.select("#pieChart");
    pieChart.html("");
	
	var w = 400;
	var h = 200;
	var r = h/2;
	var color = d3.scale.category20c();
	var legendRectSize = 18;
    var legendSpacing = 4;

	var data = [];
	jQuery.each(donnees, function( k, v ) {
		if(v.id === paysVoulu){
			var nbjrhors = v.horsChamp, nbjr = v.champNat;
			data.push({label : "Championnat national", value : nbjr});
			data.push({label : "Autres championnats", value : nbjrhors});
		}
		
	});

	var vis = d3.select('#pieChart')
	.append("svg:svg")
	.data([data])
	.attr("width", w)
	.attr("height", h)
	.append("svg:g")
	.attr("transform", "translate(" + r + "," + r + ")");
	var pie = d3.layout.pie().value(function(d){return d.value;});

	// declare an arc generator function
	var arc = d3.svg.arc().outerRadius(r);

	// select paths, use arc generator to draw
	var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
	arcs.append("svg:path")
		.attr("fill", function(d, i){
			return color(i);
		})
		.attr("d", function (d) {
			// log the result of the arc generator to show how cool it is :)
			console.log(arc(d));
			return arc(d);
		});

	arcs.append("svg:text").attr("transform", function(d){
				d.innerRadius = 0;
				d.outerRadius = r;
		return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
		return data[i].value;}
		);
	
	var legend = vis.selectAll('.legend') 
          .data(color.domain())  
          .enter()     
          .append('g')   
          .attr('class', 'legend')   
		  .attr("transform", "translate(50,150)")
          .attr('transform', function(d, i) {       
            var height = legendRectSize + legendSpacing;   
            var offset =  height * color.domain().length / 2;  
            var horz = -2 * legendRectSize;  
            var vert = i * height - offset;                
            return 'translate(' + horz + ',' + vert + ')';     
          });                 

        legend.append('rect')    
          .attr('width', legendRectSize)           
          .attr('height', legendRectSize)
          .attr('x', legendRectSize + legendSpacing+ 150)
          .style('fill', color)                 
          .style('stroke', color);
          
        legend.append('text') 
          .attr('x', legendRectSize*2 + legendSpacing+ 150)
          .attr('y', legendRectSize - legendSpacing) 
          .text(function(d, i) {return data[i].label;}); 
}

function creationBarChart(donnees, paysVoulu){
	
}

function attributionCouleur(data){
	var result = {};
	jQuery.each(data, function( k, v ) {
		var id, value, nbjr = v.champNat;
		switch(true){
			case nbjr == 0:
				id =v.id;
				value= { fillKey: "Aucun"};
				result[id] = value;
				break;
			case nbjr<=5 && nbjr>0:
				id =v.id;
				value= { fillKey: "Moins de 5"};
				result[id] = value;
				break;
			case nbjr<=10 && nbjr>5:
				id =v.id;
				value= { fillKey: "Moins de 10"};
				result[id] = value;
				break;
			case nbjr<=15 && nbjr>10:
				id =v.id;
				value= { fillKey: "Moins de 15"};
				result[id] = value;
				break;
			case nbjr<=20 && nbjr>15:
				id =v.id;
				value= { fillKey: "Moins de 20"};
				result[id] = value;
				break;
			case nbjr>20:
				id =v.id;
				value= { fillKey: "Plus de 20"};
				result[id] = value;
				break;  
		}
		
	});
	return result;
}

function creationWorldMap(donnees) {
	"use strict";
	
	 var map = new Datamap({
		element: document.getElementById('worldMap'),
		projection: 'mercator',
		fills: {
			"Plus de 20": '#22313F',
			"Moins de 20": '#34495E',
            "Moins de 15": '#336E7B',
            "Moins de 10": '#67809F',
            "Moins de 5": '#81CFE0',
			"Aucun": '#C5EFF7',
            defaultFill: '#D2D7D3'
        },
		data: attributionCouleur(donnees),
		geographyConfig: {
			borderWidth: 0.2,
			highlightOnHover: true,
			highlightFillColor: '#2ECC71',
			highlightBorderColor: '#87D37C',
			highlightBorderWidth: 1,
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>',
                        geo.properties.name,
                        '</strong></div>'].join('');
            }
        },
		done: function(datamap) {
			datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));
			function redraw() {
				datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			}
			datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
				var paysSelect = geography.properties.name;
				var paysId = geography.id;
				var countries = attributionCouleur(donnees);
				countries[paysId] = "#F7CA18";
				datamap.updateChoropleth(countries);
				creationPie(donnees, paysId);
			});
        }
	});
	map.legend();
}

function creationRendu(donnees) {
    "use strict";
    
	creationWorldMap(donnees);
}

function go() {
    "use strict";

    // Lecture des données
    d3.json("DataGraph.json", function (data) {
        creationRendu(data);
    });
}