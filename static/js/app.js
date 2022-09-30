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


init();