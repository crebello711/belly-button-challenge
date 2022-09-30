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
                size: 15,
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
                font: {
                    family: "Overpass, Open Sans, Raleway",
                    size: 15,
                },
            },
        },
    };

    let config = {
        responsive: true,
    };

    Plotly.newPlot("bar", plotdata, layout, config);
}

function bubbleChart(sub_data) {

    var trace1 = {
        x: sub_data.ids,
        y: sub_data.values,
        mode: "markers",
        text: sub_data.labels,
        marker: {
            size: sub_data.values,
            color: sub_data.ids,
        },
    };

    var data = [trace1];

    var layout = {
        title: "OTU ID vs Sample Value",
        font: {
            family: "Overpass, Open Sans, Raleway",
        },
        height: 600,
        width: 1000,
    };

    var config = {
        responsive: true,
    };
    Plotly.newPlot("bubble", data, layout, config);
}


function generateTable(subject_metadata) {
    let body = document.getElementsByClassName("panel-body")[0];
    let tbl = document.createElement("table");
    tbl.setAttribute("id", "table");

    //console.log(tbl);

    let tblBody = document.createElement("tbody");

    Object.entries(subject_metadata).forEach(function ([key, value]) {
        console.log(key, value);

        let row = document.createElement("tr");

        let key_cell = document.createElement("td");
        key_cell.style.fontWeight = "bold";
        key_cell.style.padding = "10px";
        key_cell.style.fontSize = "15";

        let key_text = document.createTextNode(`${key}:`);
        key_cell.appendChild(key_text);
        row.appendChild(key_cell);

        let value_cell = document.createElement("td");
        value_cell.style.padding = "10px";
        value_cell.style.fontSize = "16";
        let value_text = document.createTextNode(`${value}`);
        value_cell.appendChild(value_text);
        row.appendChild(value_cell);

        tblBody.append(row);
    });

    tbl.appendChild(tblBody);
    body.appendChild(tbl);
}

init();

d3.selectAll("#selDataset").on("change", subjectChanged);

function subjectChanged() {
    let selectedID = d3.select("#selDataset").node().value;

    d3.selectAll("#table").remove();

    datapull(selectedID);
}