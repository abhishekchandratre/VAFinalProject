var height;
var width;
var Location = [];
var chart_svg;
var slider_time = new Date();
var slider_value = 0;
var vehicle_count = {'Cab In White':0, 'Paint':0, 'Final Cab':0, 'Pre-Paint Chassis':0, 'Final Chassis':0, 'Offline':0, 'Sold':0};
var dept_x = [110,310,510,110,310,510,710]
var dept_y = [350,350,350,650,650,650,650]
var avg = 0, max = 0, avg_length = 0;

function draw() {
	set_height_and_widht();
	create_svg_placeholder();
	read_files();
	draw_departments();
	chart_svg.append("g").attr("class","STACK");
	chart_svg.append("g").attr("class","LEGEND");
	chart_svg.append("g").attr("class","slider_time");
	chart_svg.append("g").attr("class","end_time");
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

function draw_rectangle(w, h, x, y, fill, dept_name, last_block) {
	chart_svg.append("rect")
		.attr("width", w)
		.attr("height", h)
		.attr("x", x)
		.attr("y", y)
		.attr("stroke","black")  
		.attr("stroke-width",2) 
		.style("fill", fill)
		.style("fill-opacity", 1)
		.on('click',function() {
			console.log("Average:" +  Math.round(avg))
			console.log("Max:" + max)
			console.log("Department: " + dept_name);
			console.log("Slider Time: " + slider_time);
			window.location = 'focus.html' + "?dept=" + dept_name + "&slider_time=" + slider_time;
		});

	print(x+25, y+50, dept_name, '20px','middle', 'DEPT_NAME');
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
	
	chart_svg.append("g").attr("class","DEPT_NAME");

	draw_rectangle(50,30,100,350,"#66ccff",'Cab In White', 0);
	draw_rectangle(50,30,300,350,"#66ccff", 'Paint',0);
	draw_rectangle(50,30,500,350,"#66ccff",'Final Cab',1);
	draw_rectangle(50,30,100,650,"#66ccff",'Pre-Paint Chassis',0);
	draw_rectangle(50,30,300,650,"#66ccff",'Final Chassis',0);
	draw_rectangle(50,30,500,650,"#66ccff",'Offline',0);
	draw_rectangle(50,30,700,650,"#66ccff",'Sold',1);
}

function calculate_max_avg() {
	var sum = 0;
	max = 0
	//calculate the sum
	for (let key in vehicle_count) {
		sum += vehicle_count[key];
		if(vehicle_count[key] > max) {
			max = vehicle_count[key]
		}
	}
	
	// find the average
	avg = Math.round(sum/7);
}

function draw_legend() {
	draw_bar_rectangles(350,150,625,75,"#ffffff",'LEGEND');
	print(800, 100, "Legend", '16px','middle','LEGEND');
	
	draw_bar_rectangles(30,30,650, 125, "#33cc33",'LEGEND');
	print(700, 150, "Number of vehicles below average", '16px','start','LEGEND');
	
	draw_bar_rectangles(30,30,650,175,"#ff0000",'LEGEND');
	print(700, 200, "Number of vehicles above average", '16px','start','LEGEND');
}
				
function draw_stacked_bars(){
	var i = 0;
	avg_length = Math.round(avg * (200/max));
	
	print(400, 100, "Average Number of Vehicles: " + avg, '20px','middle','STACK');
	//print(400, 150, "Time: " + slider_time, '18px','middle','STACK');

	//w, h, x, y, fill, fill_opacity, dept_name, last_block
	for (let key in vehicle_count) {
		h = Math.round(vehicle_count[key] * (200/max));
		if(vehicle_count[key] <= avg) {
			draw_bar_rectangles(30,h,dept_x[i],dept_y[i] - h,"#33cc33",'STACK');
		}
		else {
			draw_bar_rectangles(30,avg_length,dept_x[i],dept_y[i] - avg_length,"#33cc33",'STACK');
			draw_bar_rectangles(30,h - avg_length,dept_x[i],dept_y[i] - h,"#ff0000",'STACK');
			print(dept_x[i] + 45, dept_y[i] - avg_length, vehicle_count[key] - avg,'18px','middle','STACK');
		}
		print(dept_x[i]+15, dept_y[i]+20, vehicle_count[key],'18px','middle','STACK');
		i = i + 1;
	}	
}

function handle_time() {
	let new_date = new Date(slider_time)
	let date_string = new_date.getMonth() + "/" + new_date.getDay() + "/" +
		new_date.getFullYear() + " " + new_date.getHours() + ":" +
		new_date.getMinutes() + ":" + new_date.getSeconds();
	chart_svg.selectAll("g").filter(".slider_time").selectAll("*").remove();
	chart_svg.selectAll("g").filter(".slider_time")
	.append("text")
	.attr("x", slider_value * 10)
	.attr("y", 15)
	.attr("font-family", "sans-serif")
	.attr("font-size", '15px')
	.attr("text-anchor", 'middle')
	.text(date_string);
}

function print(x, y, s, fs, alignment, group_name) {
	nodes = chart_svg.selectAll("g").filter("." + group_name).append("text")
	//console.log(nodes);
      .attr("x", x)
      .attr("y", y)       
	  .attr("font-family", "sans-serif")
      .attr("font-size", fs)
      .attr("text-anchor", alignment)
      .text(s);
}

function draw_bar_rectangles(w, h, x, y, fill,group_name) {
	nodes = chart_svg.selectAll("g").filter("." + group_name).append("rect")
		.attr("id", "bars")
		.attr("width", w)
		.attr("height", h)
		.attr("x", x)
		.attr("y", y)
		.attr("stroke","black")  
		.attr("stroke-width",2) 
		.style("fill", fill)
		.style("fill-opacity", 1);
}

function read_files() {
	// Read location file
	d3.csv("../data/location.csv", function(data){
		data.forEach(function(d) {
			d.TS_LOAD = new Date(d.TS_LOAD).getTime();
		});
		Location = data;
		create_time_line();
	});
}

function draw_end_time(min_time, max_time) {
	let new_date = new Date(max_time)
	let date_string = new_date.getMonth() + "/" + new_date.getDay() + "/" +
		new_date.getFullYear() + " " + new_date.getHours() + ":" +
		new_date.getMinutes() + ":" + new_date.getSeconds();
	chart_svg.selectAll("g").filter(".end_time")
	.append("text")
	.attr("x",940)
	.attr("y", 15)
	.attr("font-family", "sans-serif")
	.attr("font-size", '15px')
	.attr("text-anchor", 'middle')
	.text(date_string);

	new_date = new Date(min_time)
	date_string = new_date.getMonth() + "/" + new_date.getDay() + "/" +
		new_date.getFullYear() + " " + new_date.getHours() + ":" +
		new_date.getMinutes() + ":" + new_date.getSeconds();
	chart_svg.selectAll("g").filter(".end_time")
	.append("text")
	.attr("x",60)
	.attr("y", 15)
	.attr("font-family", "sans-serif")
	.attr("font-size", '15px')
	.attr("text-anchor", 'middle')
	.text(date_string);
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
	draw_end_time(min_time, max_time);
	

	let xScale = d3.time.scale().domain([min_time,max_time]).range([0,100]);

	var timeSlider =  d3.select('#slider7')
	timeSlider.call(d3.slider().on("slide", function(evt, value) {
		// slider handle
		slider_value = value
		slider_time = xScale.invert(value).getTime();
		handle_slider();
	}));
}

function handle_slider() {
	// handle time slider
	handle_time();

	let vehicle_map = {}
	let count = 0;
	console.log(Location[0]);
	
	// It`erate over all Location upto slider_time
	for(let index in Location) {
		let item = Location[index];
		if(item.TS_LOAD > slider_time) { break; }
		if(item.DEPARTMENT_NAME == "Offline") {
			delete vehicle_map[item.VEH_SER_NO]
		}
		vehicle_map[item.VEH_SER_NO] = item.DEPARTMENT_NAME;
	}

	// make count of all vehicle 0
	for (let key in vehicle_count) {
		vehicle_count[key] = 0;
	}

	//Add vehicle according to department
	for(let key in vehicle_map) {
		vehicle_count[vehicle_map[key]]++;
	}
	console.log(vehicle_count);
	calculate_max_avg();
	draw_legend();
	d3.select("g.STACK").selectAll("*").remove();
	draw_stacked_bars();
}
