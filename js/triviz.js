$(function() {
	//loads data file
    d3.csv("data/antibiotics_data.csv", function(error, data) {
        function unpack(rows, key) {
      		return rows.map(function(row) { return row[key]; });
        }

        //retrieve rows from file
        var bacteria = unpack(data, 'Bacteria '),
        	penicilin = unpack(data, 'Penicilin'),
        	streptomycin = unpack(data, 'Streptomycin '),
        	neomycin = unpack(data, 'Neomycin'),
        	gramStain = unpack(data, 'Gram Staining '),
            //Set up indices for Gram positive/negative rows
            negInd = [],
            posInd = [],
            //Set up label and color arrays for Gram sorted rows
            nameArray = [],
            gramLabels = [],
            directLabels = [],
            colorArray = [];
        
        //Finds indices of Gram-Positive and Gram-Negative rows
        //and creates list of colors and labels in the positive/negative sequence.
        for (var i = 0; i < gramStain.length; i++){
            if (gramStain[i] == 'negative'){
                negInd.push(i);
                nameArray.push('Gram Negative');
                colorArray.push('rgb(255, 128, 223)');
                gramLabels.push('Neg');
            } else {
                posInd.push(i);
                nameArray.push('Gram Positive');
                colorArray.push('rgb(153, 0, 204)');
                gramLabels.push('Pos');
            }
        }

        //Selects all values in given array at indexes in the index list.
        function valueSelect(index, array) {
            var values = []
            for (var i = 0; i < index.length; i++){
                values.push(array[index[i]]);
            }
            return values;
        }

        //Make arrays of the row values in Gram-Negative and Gram-Positive rows
        var bactPos = valueSelect(posInd, bacteria),
            bactNeg = valueSelect(negInd, bacteria),
            penPos = valueSelect(posInd, penicilin),
            penNeg = valueSelect(negInd, penicilin),
            strepPos = valueSelect(posInd, streptomycin),
            strepNeg = valueSelect(negInd, streptomycin),
            neoPos = valueSelect(posInd, neomycin),
            neoNeg = valueSelect(negInd, neomycin);

        //Data For First Visualizations
        //Bar Chart Data: y = labels, x = quantitative data
        var data1 = [{
            name: nameArray,
            x: bacteria,
            y: penicilin,
            type: 'bar',
            marker: {
                color: colorArray,

            }
        }]

        //Creates list of 'pos' and 'neg' labels in same sequence as Gram test data.
        for (var i = 0; i < gramLabels.length; i++) {    
            var label = {
                x: bacteria[i],
                y: penicilin[i],
                text: gramLabels[i],
                xanchor: 'center',
                yanchor: 'bottom',
                showarrow: false
            }
               directLabels.push(label);
        };

        //Layout of visualization one
        var layout1 = {
            title: 'Minimum Inhibitory Concentration of Penicilan for Gram Postive/Negative Bacteria',
            annotations: directLabels,
            height: 550,
            margin: {
                b: 120,
                r: 120
            },
            yaxis: {
                title: 'Penicilin (Units)'
            },
            paper_bgcolor: 'rgb(200,200,200)',
            plot_bgcolor: 'rgb(200,200,200)'
        };
        //Creates visualization one
        Plotly.newPlot('viz1', data1, layout1, {staticPlot: true});
        
        //Data for Second Visualization
        //Data for scatterplot sorted by Gram-negativ/positive rows
        var data2 = [{
            name: "Gram Negative",
            x: strepNeg,
            y: neoNeg,
            type: 'scatter',
            mode: 'markers',
            marker: {
                color: 'rgb(255, 128, 223)',
                size: 8
            }
        },{
            name: "Gram Positive",
            x: strepPos,
            y: neoPos,
            type: 'scatter',
            mode: 'markers',
            marker: {
                color: 'rgb(153, 0, 204)',
                size: 8
            }
        }];

        //Layout for visualization two
        var layout2 = {
            title: 'Efficacy of Antibiotics on Gram-Positive and Gram-Negative Bacteria',
            xaxis: {
                title: 'MIC of Streptomycin (Units)'
            },
            yaxis: {
                title: 'MIC of Neomycin (Units)'
            }
        }
        //Creates Visualization 2
        Plotly.newPlot('viz2', data2, layout2, {staticPlot: true});
        
        //Data for Third Visualization:
        //Calculates average of the numbers in a list       
        function average(data, length){
            var sum = data.reduce(function(sum, value){
                return sum + +value;
            }, 0);

            var mean = sum / length;
            return mean;
        }

        //Calculates the Coefficient of Variation for a list of data
        function getStats(data){
            //Get mean
            var mean = average(data, data.length);

            //Use mean to find square difference of each value: (x - mean) ^ 2
            var sqrDifferences = data.map(function(value){
                var difference = +value - mean;
                var square = difference * difference;
                return square;
            });

            //Calculate variance: s^2
            var aveSquareDiff = average(sqrDifferences, data.length - 1);
            //Calculate standard deviation: s
            var stdDev = Math.sqrt(aveSquareDiff);
            //Calculate coefficient of variation: s / mean
            coefOfVar = stdDev / mean;
            return coefOfVar; 
        }

        //Data for bar chart where x = antibiotic and y = the coefficient of variation
        var data3 = [{
            x: ['Penicilin', 'Streptomycin', 'Neomycin'],
            y: [getStats(penicilin), getStats(streptomycin), getStats(neomycin)],
            type: 'bar'
        }]

        //Layout for visualization 3
        var layout3 = {
            title: 'Consistency of Minimum Inhibitory Concentration of Antibiotics for Bacteria',
            yaxis: {
                title: 'Coefficient of Variation',
                showgrid: false
            },
            xaxis: {
                title: 'Antibiotic'
            }
        }

        //Creates Visualization three
        Plotly.newPlot('viz3', data3, layout3, {staticPlot: true});
    });
});