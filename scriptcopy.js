var tokenDeacesso = "BBFF-gBgZoFu6z5etgWhlZHO7fXz0E551bd";
var ubidots = new Ubidots();
ubidots.on('receivedToken', function(data) {
    this.token = data;
})
var app = new Vue({
    el: "#app",
    data: {
        now: new Date(),
        dispositivos: [],
        token: null,
        dispositivosName: [],
        dispositivosValores: [],
        eventoValores: [],
        contadorZeroed: 0,
        contadorHealthy: 0,
        contadorAttention: 0,
        contadorCritical: 0,

    },
    created() {
        this.getToken();
    },
    methods: {
        getToken() {
            axios({
                    method: 'get',
                    url: 'https://industrial.ubidots.com/ubi/token/'
                })
                .then(response => {
                    this.token = response.data;
                    this.getDispositivos();
                })
        },
        getDispositivos() {
            if (tokenDeacesso) {
                var url = "https://industrial.api.ubidots.com/api/v1.6/datasources/";
                this.$http.get(url, { headers: { 'X-Auth-Token': this.token } })
                    .then(response => {
                        response.body.results.forEach(item => {
                            this.dispositivos.push(item.id);
                        })
                    })
                    .finally(function() {
                        axios({
                                method: 'post',
                                url: 'https://industrial.api.ubidots.com/api/v1.6/data/raw/last_value/devices/',
                                data: {
                                    devices: this.dispositivos,
                                    variable_labels: ['saude'],
                                    columns: ['device.name', 'value.value']
                                },
                                headers: { 'X-Auth-Token': this.token }
                            })
                            .then(response => {
                                var valores = response.data.results.map(function(itemx) {
                                    return [itemx[0], itemx[1]];
                                })
                                valores.forEach(item => {
                                    this.dispositivosName.push(item[0]);
                                    this.dispositivosValores.push(item[1]);
                                })
                                this.dispositivosValores.forEach(item => {
                                    if (item == 0) {
                                        this.contadorZeroed++;
                                    }
                                    if (item == 1) {
                                        this.contadorHealthy++;
                                    }
                                    if (item == 2) {
                                        this.contadorAttention++;
                                    }
                                    if (item == 3) {
                                        this.contadorCritical++;
                                    }
                                    this.montarChart();
                                })
                            })
                    })
            }
        },

        montarChart() {

            //GRAFICO DE PIZZA (SAÚDE)

            var Zeroed = this.contadorZeroed;
            var Healthy = this.contadorHealthy;
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
                    text: 'Condição'
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
                            enabled: false
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
                        sliced: true,
                        selected: true,
                        color: '#309a5d',
                    }, {
                        name: 'Atenção',
                        y: Attention,
                        color: '#fed800',
                    }, {
                        name: 'Crítico',
                        y: Critical,
                        color: '#ee3241',
                    }]
                }]
            })

        }
    }
})