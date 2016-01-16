/*global console, d3, $ */
function creationPie(donnees, paysVoulu){
	
	var pieChart = d3.select("#pieChart");
    pieChart.html("");
    pieChart.append("h2")
        .html("Répartition des joueurs par championnats");
	
	var w = 575;
	var h = 370;
	var r = h/2;
	var color = d3.scale.ordinal().range(["#F9690E","#FFB61E"]);
	var legendRectSize = 18;
    var legendSpacing = 4;

	var data = [];
	jQuery.each(donnees, function( k, v ) {
		if(v.id === paysVoulu){
			var nbjrhors = v.horsChamp, nbjr = v.champNat;
			data.push({label : "Championnat national", value : nbjr});
			data.push({label : "Autres championnats", value : nbjrhors});
			$("#graphiqueStats").show();
			$("#infosEquipe").show();
		}
		
	});
	
	if(data.length === 0){
		$("#graphiqueStats").hide();
		$("#infosEquipe").hide();
	}

	var vis = d3.select('#pieChart')
	.append("svg:svg")
	.data([data])
	.attr("width", w)
	.attr("height", h)
	.append("svg:g")
	.attr("transform", "translate(" + r + "," + r + ")");
	
	var pie = d3.layout.pie().value(function(d){return d.value;});

	var arc = d3.svg.arc().outerRadius(r);

	var arcs = vis.selectAll("g.slice")
					.data(pie)
					.enter()
					.append("svg:g")
					.attr("class", "slice");
	
	arcs.append("svg:path")
		.attr("fill", function(d, i){
			return color(i);
		})
		.attr("d", function (d) {
			return arc(d);
		});

	arcs.append("svg:text").attr("transform", function(d){
				d.innerRadius = 0;
				d.outerRadius = r;
				return "translate(" + arc.centroid(d) + ")";})
		.attr("text-anchor", "middle").text( function(d, i) {return data[i].value;})
		.style('fill', 'black')
		.style('stroke', 'black');
	
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
          .attr('x', legendRectSize + legendSpacing+ 148)
          .attr('y', legendRectSize - legendSpacing-165)
          .style('fill', color)
          .style('stroke', color);
          
        legend.append('text') 
          .attr('x', legendRectSize*2 + legendSpacing+ 155)
          .attr('y', legendRectSize - legendSpacing-155)
		  .style('fill', '#FFFFFF')
         /* .style('stroke', color)*/
          .text(function(d, i) {return data[i].label;}); 
}

function creationBarChart(donnees, paysVoulu){

    var barH = d3.select("#barH");
    barH.html("");

    var data = [{}];
    jQuery.each(donnees, function( k, v ) {
        if(v.id === paysVoulu){
            var clubs = v.clubs;
            jQuery.each(clubs, function( key, value ) {
                data.push({"club" : value.club, "nbJoueurs" : value.nbJoueurs});
            });
        }

    });
	
    barH.append("div").attr("id", "graph");
    var graph = barH.selectAll("div").append("h3")
        .html("Nombre de joueurs présents à la Coupe du monde évoluant dans le championnat du pays")
        .data(data)
        .enter()
		.append("div")
        .html(function (v, i) { return "<label>"+data[i].club+"</label>"})
        .append("div")
        .html(function (v, i) { return data[i].nbJoueurs;})
        .classed({"bar": true})
        .style("width", function (v, i) { return (data[i].nbJoueurs * (65/getMax(data))) + "%"; })
        .style("height", "2em");
}

function creationDonut(paysName) {
	
	var donutChart = d3.select("#donutChart");
    donutChart.html("");
    donutChart.append("h2")
        .html("Répartition des joueurs par club");
	
	var w = 850;
	var h = 550;
	var r = h/2;
	var color = d3.scale.category20c();
	var legendRectSize = 18;
    var legendSpacing = 4;
	var dataClub = [];
	var dataset = [];
	var insert = {};
	
	d3.json("dataPlayers.json", function (data) {		
		
		jQuery.each(data, function( k, v ) {
			var club, existe = false;
			if(v.equipe === paysName){
				club = v.club +"("+v.championnat+")";
				
				jQuery.each(dataClub, function( key, obj ) {
					if( obj.label === club) {
						insert = { label: club, value: obj.value+1 };
						dataClub[key] = insert; 
						existe = true;
					}
				});
				
				if(!existe){
					insert = { label: club, value: 1 };
					dataClub.push(insert);
				}
			}
		});
		
		var vis = d3.select('#donutChart')
		.append("svg:svg")
		.data([dataClub])
		.attr("width", w)
		.attr("height", h)
		.style("margin-left","250px")
		.append("svg:g")
		.attr("transform", "translate(" + r + "," + r + ")");
	
		var pie = d3.layout.pie().value(function(d){return d.value;});

		var arc = d3.svg.arc().outerRadius(r).innerRadius(r - 75);

		var arcs = vis.selectAll("g.slice")
						.data(pie)
						.enter()
						.append("svg:g")
						.attr("class", "slice");
		
		arcs.append("svg:path")
			.attr("fill", function(d, i){
				return color(i);
			})
			.attr("d", function (d) {
				return arc(d);
			});

		arcs.append("svg:text").attr("transform", function(d){
					d.innerRadius = 0;
					d.outerRadius = r;
					return "translate(" + arc.centroid(d) + ")";})
			.attr("text-anchor", "middle").text( function(d, i) {return dataClub[i].value;})
			.style('fill', 'black')
			.style('stroke', 'black');
			
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
			  .attr('x', legendRectSize + legendSpacing+ 300)
			  .attr('y', legendRectSize - legendSpacing-35)
			  .style('fill', color)
			  .style('stroke', color);
			  
			legend.append('text') 
			  .attr('x', legendRectSize*2 + legendSpacing+ 305)
			  .attr('y', legendRectSize - legendSpacing-22)
			  .style('fill', '#FFFFFF')
			 /* .style('stroke', color)*/
			  .text(function(d, i) {return dataClub[i].label;}); 
	});
	
}

function getMax(data) {
    var max = 0;
    for (var i = 0; i<data.length; i++) {
        if(data[i].nbJoueurs>max){
            max = data[i].nbJoueurs;
        }
    }
    return max;
}

function isQualified(data, paysId){
	var result = false;
    for (var i = 0; i<data.length; i++) {
        if(data[i].id == paysId){
            result = true;
        }
    }
    return result;
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
			"Plus de 20": '#D91E18',
			"Moins de 20": '#FF3300',
            "Moins de 15": '#FF6600',
            "Moins de 10": '#FF9900',
            "Moins de 5": '#FFCC00',
			"Aucun": '#FFFF33',
            defaultFill: '#DADFE1'
        },
		data: attributionCouleur(donnees),
		geographyConfig: {
			borderWidth: 0.2,
			highlightOnHover: true,
			highlightFillColor:  function(geo) {
				if(typeof geo.fillKey === "undefined"){ 
					return '#DADFE1'
				} else { 
					return '#8E44AD'
				}
			},
			highlightBorderColor: function(geo) {
				if(typeof geo.fillKey === "undefined"){ 
					return '#95A5A6'
				} else { 
					return '#674172'
				}
			},
			highlightBorderWidth: 1,
            popupTemplate: function(geo, data) {
                return ['<div class="hoverinfo"><strong>', geo.properties.name, '</strong></div>'].join('');
            }
        },
		done: function(datamap) {
			datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));
			function redraw() {
				if(d3.event.scale >=1 && d3.event.scale <5){
					datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
				}
			}

			datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
				var paysId = geography.id;
				var paysName = geography.properties.name;
				if(isQualified(donnees, paysId)) {
					var countries = attributionCouleur(donnees);
					countries[paysId] = "#8E44AD";
					datamap.updateChoropleth(countries);
					creationTeamInfos(paysName);
					creationPie(donnees, paysId);
					creationBarChart(donnees, paysId);
					creationDonut(paysName);
					$(location).attr('href','#infoTeam');
				}
			});
        }
	});
	map.legend();
}

function creationTeamInfos(paysName) {
	var donnees;
	
	var contentEquipe = d3.select("#contentEquipe");
    contentEquipe.html("");
    contentEquipe.append("h1").html(paysName);
				 
	d3.json("teamsInfo.json", function (donnees) {
		var coachName, flag, url, kit;
		jQuery.each(donnees, function( k, v ) {
			if(v.TeamInfo.teamName === paysName){
				coachName = v.coachName;
				flag = v.TeamInfo.sCountryFlagLarge;
				url = v.TeamInfo.sWikipediaURL;
                kit = "img/kits/"+paysName.toLowerCase().replace(/ /g, '')+".png";
			}
		});
		
		contentEquipe.append("img")
					 .attr("src", flag);

        contentEquipe.append("h3")
            .html("Maillot : ");

        contentEquipe.append("img")
            .attr("src", kit)
			.attr("width", "400px");
		
		contentEquipe.append("p")
					 .html(" <h3> Coach : </h3>"+coachName);
		
		contentEquipe.append("p")
					 .html(" <h3> Information sur l'équipe : </h3>")
					 .append("a")
					 .attr("href", url)
					 .text("Page Wikipedia de l'équipe");
    });
	
	d3.json("dataPlayers.json", function (data) {
		
		var tab = $("#tab tbody")
		tab.html("");
		
		jQuery.each(data, function( k, v ) {
			var nom, pos, dateNaiss, age, nbSelect, club, isChampNat;
			if(v.equipe === paysName){
				var tr = $("<tr>");
				nom = v.nomJoueur;
				pos = v.position;
				dateNaiss = v.dateNaissance;
				age =v.age;
				nbSelect = v.nbSelections;
				club = v.club +"("+v.championnat+")";
				isChampNat = v.isChampNat;
				
				var td = $("<td>").html(nom);
				tr.append(td);
				td = $("<td>").html(pos);
				tr.append(td);
				td = $("<td>").html(dateNaiss);
				tr.append(td);
				td = $("<td>").html(age);
				tr.append(td);
				td = $("<td>").html(nbSelect);
				tr.append(td);
				td = $("<td>").html(club);
				tr.append(td);
				td = $("<td>").html(isChampNat);
				tr.append(td);
				
				tab.append(tr);
			}
		});
        
    })
}

function creationRendu(donnees) {
    "use strict";
    
	creationWorldMap(donnees);
}

function go() {
    "use strict";
	
	$("#infosEquipe").hide();
	$("#graphiqueStats").hide();

    // Lecture des données
    d3.json("DataGraph.json", function (data) {
        creationRendu(data);
    });
}