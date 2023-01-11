// Use the D3 library to read in samples.json from the URL: 
// https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
const sample_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let names = "";
let samples = "";

function handleClick() {
  console.log("A button was clicked!");

  // We can use d3 to see the object that dispatched the event
  console.log(d3.event.target);
};

function optionChanged(id) {
  loadpage(id);
};

function int_array_to_strings(array){
  let return_list = [];
  array.forEach(element => {
    str = "OTU " + element.toString();
    return_list.push(str);
  })
  return return_list;
};

function loadpage(id) {
    d3.json(sample_url).then(function(data) {

        // save data from url
        names = data.names;
        samples = data.samples;
        
        // populate options in drop down select element
        names.forEach( (name) =>
        {
          let drop_down = d3.select("#selDataset");
          drop_down.append("option").text(name);
        });

        // popluate demographic info into <div id="sample-metadata" class="panel-body"></div>
        let mdata = data.metadata.filter(data => data.id == id)[0];
        let age = mdata['age'];
        let bbtype = mdata['bbtype'];
        let ethnicity = mdata['ethnicity'];
        let gender = mdata['gender'];
        let idx = mdata['idx'];
        let location = mdata['location'];
        let wfreq = mdata['wfreq'];
        let dem_info = d3.select("div.panel-body#sample-metadata");
        d3.selectAll("h5").remove();
        dem_info.append("h5").text(`id: ${id}`);
        dem_info.append("h5").text(`ethnicity: ${ethnicity}`);
        dem_info.append("h5").text(`gender: ${gender}`);
        dem_info.append("h5").text(`age: ${age}`);
        dem_info.append("h5").text(`location: ${location}`);
        dem_info.append("h5").text(`bbtype: ${bbtype}`);
        dem_info.append("h5").text(`wfreq: ${wfreq}`);

        // popluate bar chart
        let y_bar = int_array_to_strings(samples.filter(data => data.id == id)[0].otu_ids.slice(0,10)).reverse();
        let x_bar = samples.filter(data => data.id == id)[0].sample_values.slice(0,10).reverse();
        let trace_bar = {
          x:x_bar,
          y:y_bar,
          text: int_array_to_strings(samples.filter(data => data.id == id)[0].otu_ids),
          type:"bar",
          name:"placeholder",
          orientation:'h'
        };
        let layout_bar = {
          height: 600,
          width: 800
        };
        Plotly.newPlot("bar", [trace_bar], layout_bar);

        // populate bubble chart
        let y_bubble = samples.filter(data => data.id == id)[0].sample_values;
        let x_bubble = samples.filter(data => data.id == id)[0].otu_ids;
        let marker_size = y_bubble;
        let trace_bubble = {
          x: x_bubble,
          y: y_bubble,
          text: int_array_to_strings(samples.filter(data => data.id == id)[0].otu_ids),
          mode: 'markers',
          marker: {
            size: marker_size,
            color: x_bubble
          }
        };
        let layout_bubble = {
          title: 'Marker Size and Color',
          showlegend: false,
          height: 600,
          width: 1000
        };
        Plotly.newPlot("bubble", [trace_bubble], layout_bubble);

      });
    };

loadpage("940");