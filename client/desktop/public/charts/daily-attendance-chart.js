// Daily Attendance Chart using ECharts
function initDailyAttendanceChart() {
    var chartDom = document.getElementById('daily-attendance-chart');
    if (!chartDom) {
        console.error('Chart container not found');
        return;
    }
    
    // Apply styling to the chart container before initialization
    chartDom.style.background = 'var(--glass-light)';
    chartDom.style.borderRadius = '0px';
    chartDom.style.boxShadow = 'var(--shadow-primary)';
    chartDom.style.border = '1px solid var(--border-light)';
    chartDom.style.padding = '1rem';
    chartDom.style.overflow = 'visible'; // Allow tooltips to overflow and be visible
    
    var myChart = echarts.init(chartDom);
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel: {
                color: '#ffffff'
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#ffffff'
            },
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            }
        },
        series: [
            {
                name: 'Daily Attendance',
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true,
                lineStyle: {
                    color: '#38e038',
                    width: 3
                },
                itemStyle: {
                    color: '#38e038'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(56, 224, 56, 0.3)'
                        }, {
                            offset: 1, color: 'rgba(56, 224, 56, 0.1)'
                        }]
                    }
                }
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        }
    };

    option && myChart.setOption(option);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        myChart.resize();
    });
    
    return myChart;
}
