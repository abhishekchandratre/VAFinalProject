var height;
var width;
var Location = [];

function draw() {
	set_height_and_widht();
	create_svg_placeholder();
	read_files();
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

function read_files() {
	// Read location file
	d3.csv("../data/location.csv", function(data){
		data.forEach(function(d) {
			d.TS_LOAD = new Date(d.TS_LOAD)
		});
		Location = data;
		create_time_line();
	});
}

function create_time_line() {
	console.log(Location[0])
	let min_time = d3.min(Location, function(d,i){
		return d.TS_LOAD;
	});
	let max_time = d3.max(Location, function(d,i){
		return d.TS_LOAD;
	});
	console.log(min_time)
	console.log(max_time)

	let xScale = d3.time.scale().domain([min_time,max_time]).range([0,100]);

	var timeSlider =  d3.select('#slider7')
	timeSlider.call(d3.slider().on("slide", function(evt, value) {
		console.log(xScale.invert(value));
	}));


}
