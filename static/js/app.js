function init() {
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

    d3.json(url).then(function (jsonData) {
        let data = jsonData;
        //console.log(data);

        //Capturing the id, which we will call names for the drop-down menu
        let dataNames = data.names;
        var dropDownMenu = d3.select("#selDataset");

        dataNames.forEach(function (name) {
            dropDownMenu.append("option").text(name).property("value", name);
        });

        let selectedID = "940";

        datapull(selectedID);
    });
}

function datapull(selectedID) {
    const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
    d3.json(url).then(function (data) {

        var subject = data.samples.filter((val) => val.id == selectedID)[0];

        let otu_idList = [];
        for (let i = 0; i < subject.otu_ids.length; i++) {
            otu_idList.push(`OTU# ${subject.otu_ids[i]}`);
        }


        let subjectMetaData = data.metadata.filter((val) => val.id == selectedID)[0];

        let final_data = {
            idStr: otu_idList,
            ids: subject.otu_ids,
            values: subject.sample_values,
            labels: subject.otu_labels,
        };

        barChart(final_data);
        bubbleChart(final_data);
        gaugeChart(Object.values(subjectMetaData)[6]);
        generateTable(subjectMetaData);
    });
}

function barChart(sub_data) {

    let sample_values = sub_data.values.slice(0, 10);
    let colors = [];
    for (let i = 0; i < sample_values.length; i++) {
        colors.push("rgb(0,0," + (1 - sample_values[i] / 180) + ")");
    }


    let trace = {
        x: sample_values,
        y: sub_data.idStr.slice(0, 10),
        mode: "markers",
        marker: {
            color: colors,
            line: {
                width: 1,
            },
        },
        orientation: "h",
        type: "bar",
    };

    let plotdata = [trace];

    let layout = {
        hoverinfo: sub_data.labels.slice(0, 10),
        title: {
            text: "Top 10 Microbial Species Found <br> in Belly Button",
            font: {
                size: 20,
                xanchor: "left",
                yanchor: "top",
            },
        },
        autosize: false,
        width: 375,
        height: 550,
        margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4,
        },
        yaxis: {
            autorange: "reversed",
            automargin: true,
        },
        xaxis: {
            title: {
                text: "Number of Microbial Species",
                size: 10,
                font: {
                    family: "Overpass, Open Sans, Raleway",
                    size: 10,
                },
            },
        },
    };

    let config = {
        responsive: true,
    };

    Plotly.newPlot("bar", plotdata, layout, config);
}

init();