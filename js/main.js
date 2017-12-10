var height;
var width;
var Location = [];
var chart_svg;

function draw() {
	set_height_and_widht();
	create_svg_placeholder();
	read_files();
	// create_time_line();
}

function set_height_and_widht() {
	// height = $(".chart").height() * 0.9;
	// width = $(".chart").width();
	height = 800;
	width = 1000;
	console.log("Chart Height: " + height);
	console.log("Chart Width: " + width);
}

function create_svg_placeholder() {
	let border = 1;
	set_height_and_widht();
	chart_svg = d3.select(".chart")
		.append("svg")
		.attr("class", "chart_svg")
		.attr("height", height)
		.attr("width", width)
		.attr("border",border);

	let borderPath = chart_svg.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("height", height)
		.attr("width", width)
		.style("stroke", "black")
		.style("fill", "none")
		.style("stroke-width", border);
}

function draw_rectangle(w, h, x, y, fill, fill_opacity, dept_name, last_block) {
	chart_svg.append("rect")
		.attr("width", w)
		.attr("height", h)
		.attr("x", x)
		.attr("y", y)
		.attr("stroke","black")  
		.attr("stroke-width",2) 
		.style("fill", fill)
		.style("fill-opacity", fill_opacity);
		
	 chart_svg.append("text")
      .attr("x", x+25)
      .attr("y", y+50)       
	  .attr("font-family", "sans-serif")
      .attr("font-size", "16px")
      .attr("text-anchor", "middle")
      .text(dept_name);
	  
	  if(last_block == 0) {
		  chart_svg.append("line")
				 .attr("x1",x+50)  
				 .attr("y1",y+15)  
				 .attr("x2",x+192)  
				 .attr("y2",y+15)  
				 .attr("stroke","red")  
				 .attr("stroke-width",2)  
				 .attr("marker-end","url(#arrow)");  
	  }
}

function draw_departments() {
	chart_svg.append("svg:defs").append("svg:marker")
    .attr("id", "arrow")
    .attr("refX", 4)
    .attr("refY", 4)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 8 4 0 8 3 4")
    .style("fill", "red");
	
	draw_rectangle(50,30,100,350,"#66ccff",1,'Cab In White', 0);
	draw_rectangle(50,30,300,350,"#66ccff",1, 'Paint',0);
	draw_rectangle(50,30,500,350,"#66ccff",1,'Final Cab',1);
	draw_rectangle(50,30,100,650,"#66ccff",1,'Pre-Paint Chassis',0);
	draw_rectangle(50,30,300,650,"#66ccff",1,'Final Chassis',0);
	draw_rectangle(50,30,500,650,"#66ccff",1,'Offline',0);
	draw_rectangle(50,30,700,650,"#66ccff",1,'Sold',1);
}



function read_files() {
	// Read location file
	d3.csv("../data/location.csv", function(data){
		Location = data;
	});
	
draw_departments();

}
