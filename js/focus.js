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
let parent_list = [];
let selected_node;
let selected_time;
let slider_time;
let cries_on_line = [];
let item_shortage = [];
let selected_cries = [];
let selected_items = [];
let xScale_cries;
let xScale_items;

function draw() {
	create_svg_placeholder();

	// get dept name and time
	var query = window.location.search.substring(1);
	var qs = parse_query_string(query);
	selected_node = qs.dept;
	selected_time = qs.slider_time;

	// draw parent chain
	draw_parent_chain(selected_node, selected_time);

	// read files and start processing
	draw_back_button();
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

function draw_back_button() {
		chart_svg.select("g").filter(".nodes").append("rect")
		.attr("width", 100)
		.attr("height", 35)
		.attr("x", 850)
		.attr("y", 40)
		.attr("stroke","black")  
		.attr("stroke-width",2) 
		.style("fill", "#66ccff")
		.style("fill-opacity", 1)
		.on('click',function() {
			window.location = 'index.html';
		});
		
	print(900, 65, 'Back', '22px', 'middle','nodes');	
		
}

function draw_parent_chain() {
	// get parent links
	let parentName = selected_node;
	while(parentName !== undefined) {
		let new_node = {
			"name": parentName,
			"cries": 0,
			"items": 0,
		}
		parent_list.push(new_node);
		parentName = parents[parentName];
	}

	chart_svg.append("g").attr("class", "top")
	chart_svg.append("g").attr("class", "nodes")
	print(200, 125, 'Cries On Line', '18px', 'middle','top');
	print(750, 125, 'Item Shortage', '18px', 'middle','top');
	
	// Draw parents links
	nodes = chart_svg.selectAll("g").filter(".nodes").selectAll("rect")
		.data(parent_list)
		.enter()
		.append("rect")
		.attr("x", 450)
		.attr("y", function(d, i){
			return (i + 1) * 150;
		})
		.attr("width", 100)
		.attr("height",100)

	// Draw parent text
	text = chart_svg.selectAll("g").filter(".nodes").selectAll("text")
		.data(parent_list)
		.enter()
		.append("text")
		.attr("x", 500)
		.attr("y", function(d, i){ return (i + 1) * 150 + 120;})       
		.attr("font-family", "sans-serif")
		.attr("font-size", '20px')
		.attr("text-anchor", 'middle')
		.text(function(d){return d.name;});
}

function read_files() {
	// read cries on line
	d3.csv("../data/cries_on_line.csv",function(data){
		data.forEach(function(d) {
			d.TS_LOAD = new Date(d.TS_LOAD).getTime();
			if (d.TS_LOAD < selected_time) {
				cries_on_line.push(d);
			}
		});
		console.log(cries_on_line);

		// read item shortage
		d3.csv("../data/item_short.csv",function(data){
			data.forEach(function(d) {
				d.TS_LOAD = new Date(d['Ts Load']).getTime();
				if (d.TS_LOAD < selected_time) {
					item_shortage.push(d);
				}
			});
			item_shortage.sort(function(a, b) {
				return d3.ascending(a.TS_LOAD, b.TS_LOAD);
			})

			// prepare for bar charts
			prepare_for_bar_charts();
			// process_cries_and_item
			process_cries_and_item();
		});
	});
}

function process_cries_and_item() {
	// draw slider
	let min_time = Math.min(cries_on_line[0].TS_LOAD, item_shortage[0].TS_LOAD);
	let max_time = selected_time;
	console.log(min_time + " " + max_time);

	// add slider
	let xScale = d3.time.scale().domain([min_time,max_time]).range([0,100]);
	var timeSlider =  d3.select('#slider7')
	timeSlider.call(d3.slider()
		.value(100)
		.on("slide", function(evt, value) {
			slider_time = xScale.invert(value).getTime();
			// slider handle
			handle_slider();
		})
	);
}

function handle_slider() {
	// empty required arrays
	selected_cries = []
	selected_items = []

	// Iterate over all cries_on_line upto slider_time
	for(let index in cries_on_line) {
		let item = cries_on_line[index];
		if(item.TS_LOAD > slider_time) { 
			selected_cries.push(item);
		}
		if(item.TS_LOAD > selected_time) { break; }
	}

	// Iterate over all item_shortage upto slider_time
	for(let index in item_shortage) {
		let item = item_shortage[index];
		if(item.TS_LOAD > slider_time) { 
			selected_items.push(item);
		}
		if(item.TS_LOAD > selected_time) { break; }
	}

	draw_bar_charts();
}

function prepare_for_bar_charts() {
	// create group for bar elements;
	chart_svg.append("g").attr("class", "cries_bars");
	chart_svg.append("g").attr("class", "items_bars");
	xScale_cries = d3.time.scale().domain([0,cries_on_line.length]).range([0,350]);
	xScale_items = d3.time.scale().domain([0,item_shortage.length]).range([0,350]);
}

function remove_previous_bars() {
	chart_svg.selectAll("g").filter(".cries_bars").selectAll("*").remove();
	chart_svg.selectAll("g").filter(".items_bars").selectAll("*").remove();
}

function get_index(deptName) {
	for(let index in parent_list) {
		if(parent_list[index].name == deptName) {
			return index;
		}
	}
	return -1;
}

function draw_bar_charts() {
	let current_list = []
	remove_previous_bars();
	console.log(selected_cries.length);
	console.log(selected_items.length);

	for(let key in parent_list) {
		parent_list[key].cries = 0;
		parent_list[key].items = 0;
	}

	console.log(parent_list);
	for(let index in selected_cries) {
		let ret_index = get_index(selected_cries[index].DEPARTMENT_NAME)
		if (ret_index !== -1) {
			parent_list[ret_index].cries++;
		}
	}

	let bars_cries = chart_svg.selectAll("g").filter(".cries_bars").selectAll("rect")
		.data(parent_list)
		.enter()
		.append("rect")
		.attr("x", function(d) { return 450 - xScale_cries(d.cries) })
		.attr("y", function(d, i){
			return (i + 1) * 150;
		})
		.attr("fill", "blue")
		.attr("width", function(d) { return xScale_cries(d.cries) })
		.attr("height",100)

	let bars_items = chart_svg.selectAll("g").filter(".items_bars").selectAll("rect")
		.data(parent_list)
		.enter()
		.append("rect")
		.attr("x", 550)
		.attr("y", function(d, i){
			return (i + 1) * 150;
		})
		.attr("fill", "green")
		.attr("width", function(d) { return 450 - xScale_items(d.items) })
		.attr("height",100)

	let text_cires = chart_svg.selectAll("g").filter(".cries_bars").selectAll("text")
		.data(parent_list)
		.enter()
		.append("text")
		.attr("x", function(d){ return 420 - xScale_cries(d.cries) })
		.attr("y", function(d, i){ return (i + 1) * 150 + 50; })
		.attr("font-family", "sans-serif")
		.attr("font-size", '20px')
		.attr("text-anchor", 'middle')
		.text(function(d){return d.cries;});

	let text_items = chart_svg.selectAll("g").filter(".items_bars").selectAll("text")
		.data(parent_list)
		.enter()
		.append("text")
		.attr("x", xScale_items(selected_items.length) + 480)
		.attr("y", function(d, i){ return (i + 1) * 150 + 120; })
		.attr("font-family", "sans-serif")
		.attr("font-size", '20px')
		.attr("text-anchor", 'middle')
		.text(function(d){return d.items;});
}
