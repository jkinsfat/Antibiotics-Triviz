$(function() {
	d3.csv("data/antibiotics_data.csv", function(error, data){
        function unpack(rows, key) {
      		return rows.map(function(row) { return row[key]; });
        }

        var bacteria = unpack(data, 'Bacteria')
        	penicilin = unpack(data, 'Penicilin')
        	streptomycin = unpack(data, 'Streptomycin')
        	neomycin = unpack(data, 'Neomycin')
        	gramStain = unpack(data, 'Gram Staining')

        var data = [{
        	values: penicilin,
        	labels: bacteria,
            type: 'pie'
        }]

        var layout = {
            height: 400,
            width: 500
        }
    	Plotly.plot('viz1', data);
    });
});