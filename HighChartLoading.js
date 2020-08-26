window.addEventListener('load', start);



function start() {

    var Zeroed = 1;
    var Healthy = 1;
    var Attention = this.contadorAttention;
    var Critical = this.contadorCritical;

    Highcharts.chart('container', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Condição de Saúde dos Motores',
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Valor',
            colorByPoint: true,
            data: [{
                name: 'Saudável',
                y: Healthy,
                sliced: false,
                selected: true,
                color: '#309a5d',
            }, {
                name: 'Atenção',
                y: 3,
                color: '#fed800',
            }, {
                name: 'Crítico',
                y: 1,
                color: '#ee3241',
            }]
        }]
    })

};