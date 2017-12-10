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

function draw_rectangle(w, h, x, y, fill, fill_opacity) {
	chart_svg.append("rect")
		.attr("width", w)
		.attr("height", h)
		.attr("x", x)
		.attr("y", y)
		.style("fill", fill)
		.style("fill-opacity", fill_opacity);
}

function read_files() {
	// Read location file
	d3.csv("../data/location.csv", function(data){
		Location = data;
	});
}
