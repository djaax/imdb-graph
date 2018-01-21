const regression = require('regression');
const queryString = require('query-string');

module.exports = {
	fetch() {
		var colors = ['#EC7BDF', '#7BEEE0', '#F1BD7A', '#9778E6', '#6DDC6C', '#EA7C9E', '#7CBDEF', '#E1F17F', '#DC78F2', '#7AE8BB', '#E99982', '#7E81CB'];

		const parsed = queryString.parse(location.search);
		var endpoint = /api/ + (parsed.id ? 'id' : 'name') + '/' + (parsed.id ? parsed.id : parsed.name);

		return fetch(endpoint, {
			method: 'GET'
		})
		.then(function(response) {
			if ( response.status !== 200 ) return false;
		    return response.json()
		}).then(function(data) {
			if ( !data ) return alert('404: '+(parsed.id ? parsed.id : parsed.name)+' not found');

			var options = {
				chart: {
			        type: 'scatter',
			        zoomType: 'xy',
			        backgroundColor: '#333333',
			    },
			    title: {
		            text: data.data.title,
		            style: {
		            	color: '#DDDDDD'
		            }
		        },
		        legend: {
		        	enabled: false
		        },
		        yAxis: {
		        	title: {
		        		text: 'IMDB Ratings'
		        	},
		        	gridLineColor: '#666666'
		        },
		        xAxis: {
		        	title: {
		        		text: 'Episode Number'
		        	}
		        },
		        tooltip: {
		        	enabled: false
		        },
		        plotOptions: {
					line: {
						marker: {
							enabled: false
						}
					}
				},
			    series: []
			}

			data.out.forEach(function(season, i) {
				options.series.push({
					title: 'Season '+i,
					type: 'scatter',
					color: colors[i%colors.length],
					data: season
				});

				var regressionData = [];
				season.forEach(function(episode, j) {
					regressionData.push(season[j]);
				});

				const result = regression.linear(regressionData);
				options.series.push({
					type: 'line',
					data: result.points,
					color: colors[i%colors.length]
				});
			});

			Highcharts.chart('chart_div', options);
		});
	}
}