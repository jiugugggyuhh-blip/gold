<template>
  <div id="chart" class="my-8"></div>
</template>

<script setup>
import axios from 'axios'
import moment from 'moment-jalaali'
import ApexCharts from 'apexcharts'
import { onMounted } from 'vue'

const url = process.env.VUE_APP_API_URL || ''

async function renderChart() {
  try {
    const { data } = await axios.get(`${url}/test-chart/gold-history`)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const seriesData = (data.data || [])
      .filter(i => i.date && new Date(i.date) >= threeMonthsAgo)
      .map(i => ({ x: new Date(i.date), y: i.price }))
      .sort((a, b) => a.x - b.x)

    if (seriesData.length === 0) {
      console.log('No chart data available')
      return
    }

    const options = {
      chart: { height: 320, type: 'area', fontFamily: 'Dana', foreColor: '#ffffff' },
      colors: ['#b9f1cf'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05, stops: [0, 90, 100],
          colorStops: [{ offset: 0, color: '#b9f1cf', opacity: 0.35 }, { offset: 100, color: '#b9f1cf', opacity: 0.05 }]
        }
      },
      series: [{ name: 'قیمت طلا', data: seriesData }],
      stroke: { width: 2 },
      grid: { borderColor: 'rgba(255,255,255,.06)' },
      dataLabels: { enabled: false },
      legend: { show: false },
      xaxis: {
        type: 'datetime',
        labels: { formatter: (val, ts) => moment(ts).format('jMM/jDD'), style: { fontSize: '12px' } },
        axisBorder: { color: 'rgba(255,255,255,.08)' }, axisTicks: { color: 'rgba(255,255,255,.08)' }
      },
      yaxis: {
        labels: { formatter: v => v ? v.toLocaleString() : '0', style: { fontSize: '12px' } }
      },
      tooltip: {
        theme: 'dark',
        x: { formatter: ts => ts ? moment(ts).format('jYYYY/jMM/jDD') : '' },
        y: { formatter: v => v ? v.toLocaleString() + ' تومان' : '0 تومان' }
      }
    }

    const chart = new ApexCharts(document.querySelector('#chart'), options)
    chart.render()
  } catch (e) {
    console.error('Chart render error:', e)
  }
}

onMounted(renderChart)
</script>
