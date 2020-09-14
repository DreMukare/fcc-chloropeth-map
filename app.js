const tooltip = document.getElementById("tooltip");

const countyDataSource =
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationDataSource =
	"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
let countyData = "";
let educationData = "";

const height = 800;
const width = 1000;

const svg = d3
	.select("#container")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

const drawTheMap = () => {
	svg
		.selectAll("path")
		.data(countyData)
		.enter()
		.append("path")
		.attr("d", d3.geoPath())
		.attr("class", "county")
		.attr("fill", (d) => {
			let id = d["id"];
			let county = educationData.find((c) => c["fips"] === id);
			let bachelorsOrHigher = county["bachelorsOrHigher"];
			if (bachelorsOrHigher <= 15) {
				return "#FA0D9E";
			} else if (bachelorsOrHigher <= 30) {
				return "#D10BDE";
			} else if (bachelorsOrHigher <= 45) {
				return "#A300F5";
			} else if (bachelorsOrHigher <= 60) {
				return "#5E0BDE";
			} else if (bachelorsOrHigher <= 75) {
				return "#290DFA";
			} else if (bachelorsOrHigher <= 90) {
				return "#280CFA";
			} else {
				return "#0A265D";
			}
		})
		.attr("data-fips", (d) => d["id"])
		.attr("data-education", (d) => {
			let id = d["id"];
			let county = educationData.find((c) => c["fips"] === id);
			let bachelorsOrHigher = county["bachelorsOrHigher"];
			return bachelorsOrHigher;
		})
		.on("mouseover", (d, i) => {
			svg.append("tooltip");
			let id = i["id"];
			let county = educationData.find((c) => c["fips"] === id);
			tooltip.innerHTML = `${county["area_name"]}, ${county["state"]}: ${county["bachelorsOrHigher"]}%`;
			tooltip.setAttribute("data-education", county["bachelorsOrHigher"]);

			tooltip.style.left = d.clientX - 95 + "px";
			tooltip.style.top = d.clientY - 80 + "px";
			tooltip.style.display = "block";
		})
		.on("mouseout", (d) => {
			tooltip.style.display = "none";
		});
};

// bringing in the data
d3.json(countyDataSource).then((data, error) => {
	if (error) {
		console.log(error);
	} else {
		countyData = topojson.feature(data, data.objects.counties).features;
		console.log(countyData);

		d3.json(educationDataSource).then((data, error) => {
			if (error) {
				console.log(error);
			} else {
				educationData = data;
				console.log(educationData);
				drawTheMap();
			}
		});
	}
});
