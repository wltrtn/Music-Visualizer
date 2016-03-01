$(function() {
	
	var context = new (window.AudioContext || window.webkitAudioContext)();
	var song = document.getElementById('song');
	var source = context.createMediaElementSource(song);
	var analyser = context.createAnalyser();
	
	source.connect(analyser);
	source.connect(context.destination);
	
	var freqData = new Uint8Array(400);
	var graphHeight = 300;
	var graphWidth = 600;
	var padding = 1;
	
	function createSVG(parent, height, width) {
		return d3.select(parent).append('svg').attr('height', height).attr('width', width);
		
	}
	
	var graph = createSVG('#graph', graphHeight, graphWidth);
	
	//initialize visualizer
	graph.selectAll('rect').data(freqData).enter().append('rect')
	   .attr('width', (graphWidth / freqData.length) - padding)
	   .attr('x', function (d, index) {
	   		return index * (graphWidth / freqData.length);
	   });
	   
	function updateGraph() {
		window.requestAnimationFrame(updateGraph);
		
		analyser.getByteFrequencyData(freqData);
		
		//update visualizer with frequency data
		graph.selectAll('rect').data(freqData)
			.attr('y', function(d) {
				return graphHeight - d;
			})
			.attr('height', function(d) {
				return d;
			})
			.attr('fill', function(d) {
				return "rgb(0, 0, " + d + ")";
			});
	}
	
	updateGraph();
});