// URL to variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Load the JSON data using D3
d3.json(url).then(function(data) {
  console.log(data);
});

// Start dashboard 
function init() {

  let dropdown = d3.select("#selDataset");
  
  d3.json(url).then((data) => {
    
      let names = data.names;
    
      names.forEach((id) => {
      
          console.log(id);
          dropdown.append("option")
          .text(id)
          .property("value",id);
      });
    
      let first_sample = names[0];
      
      console.log(first_sample);
      
     fillMetadata(first_sample);
      createBarChart(first_sample);
      createBubbleChart(first_sample);

  });
};

// Function to fill metadata
function fillMetadata(sample) {

  d3.json(url).then((data) => {
      let metadata = data.metadata;
      let value = metadata.filter(result => result.id == sample);
      
      console.log(value)
     
      let valueData = value[0];
    
      d3.select("#sample-metadata").html("");
  
      Object.entries(valueData).forEach(([key,value]) => {
          
          console.log(key,value);
          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });

};

// Making Bar Plot
function createBarChart(sample) {
 
  d3.json(url).then((data) => {
      let sampleInfo = data.samples;
      let value = sampleInfo.filter(result => result.id == sample);
     
      let valueData = value[0];
      
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;
     
      console.log(otu_ids,otu_labels,sample_values);
      // Grab top 10 OTUs
      let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let xticks = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();
      // Bar Chart & Plotly
      let trace = {
          x: xticks,
          y: yticks,
          text: labels,
          type: "bar",
          orientation: "h",
          marker: {
              color: otu_ids,
          }
      };
      
      let layout = {
      };
       
      Plotly.newPlot("bar", [trace], layout)
  });
};

// Making Bubble Chart
function createBubbleChart(sample) {

  d3.json(url).then((data) => {
      let sampleInfo = data.samples;
      let value = sampleInfo.filter(result => result.id == sample);

      let valueData = value[0];
   
      let otu_ids = valueData.otu_ids;
      let otu_labels = valueData.otu_labels;
      let sample_values = valueData.sample_values;
  
      console.log(otu_ids,otu_labels,sample_values);
      // Bubble Chart & Plotly
      let trace1 = {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
          }
      };
      
      let layout = {
          hovermode: "closest",
          xaxis: {title: "OTU ID"},
      };
     
      Plotly.newPlot("bubble", [trace1], layout)
  });
};

// Function to update dashboard 
function optionChanged(value) { 

  
  console.log(value); 
  
  fillMetadata(value);
  createBarChart(value);
  createBubbleChart(value)
};

// Initialize function
init();
