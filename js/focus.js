var height;
var width;
var parents = {
'Cab In White':undefined,
'Paint':'Cab In White',
'Final Cab': 'Paint',
'Pre-Paint Chassis':undefined,
'Final Chassis':'Pre-Paint Chassis',
'Offline': 'Final Chassis',
'SOLD': 'Offline'
};


function draw() {
	create_svg_placeholder();

	// get dept name and time
	var query = window.location.search.substring(1);
	var qs = parse_query_string(query);
	let selected_node = qs.dept;
	let selected_time = qs.slider_time;

	// draw parent chain
	draw_parent_chain(selected_node, selected_time);

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

function parse_query_string(query) {
	var vars = query.split("&");
	var query_string = {};
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}

function print(x, y, s, fs, alignment, group_name) {
	chart_svg.selectAll("g").filter("." + group_name).append("text")
      .attr("x", x)
      .attr("y", y)       
	  .attr("font-family", "sans-serif")
      .attr("font-size", fs)
      .attr("text-anchor", alignment)
      .text(s);
}

function draw_parent_chain(selected_node, selected_time) {
	// get parent links
	let parentName = selected_node;
	let parent_list = [];
	while(parentName !== undefined) {
		parent_list.push(parentName);
		parentName = parents[parentName];
	}
	console.log(parent_list);


	// Draw parents links
	chart_svg.append("g").attr("class", "nodes")
	nodes = chart_svg.select("g").filter(".nodes").selectAll("rect")
		.data(parent_list)
		.enter()
		.append("rect")
		.attr("x", 450)
		.attr("y", function(d, i){
			return (i + 1) * 150;
		})
		.attr("width", 100)
		.attr("height",100)
}

function read_files() {

}
