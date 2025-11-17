// Student Chart Initialization
window.initializeStudentChart = async function initializeStudentChart(elementId = 'student-chart', data = null) {
    console.log('Initializing student chart...');
    const chartDom = document.getElementById(elementId);
    if (!chartDom) {
        console.error('Chart container not found');
        return;
    }
    
    console.log('Chart container found, initializing chart...');
    
    try {
        // Make sure echarts is loaded
        if (typeof echarts === 'undefined') {
            console.error('ECharts library not loaded!');
            return;
        }
        
        // Apply styling to the chart container before initialization
        chartDom.style.background = 'var(--glass-light)';
        chartDom.style.borderRadius = '0px';
        chartDom.style.boxShadow = 'var(--shadow-primary)';
        chartDom.style.border = '1px solid var(--border-light)';
        chartDom.style.padding = '1rem';
        chartDom.style.overflow = 'visible'; // Allow tooltips to overflow and be visible
        
        // Initialize the chart with a custom background (transparent)
        const myChart = echarts.init(chartDom, null);
        
        // Get real data from database if not provided
        let chartData = data;
        let gradeLabels = ['G1', 'G2', 'G3', 'G4', 'G5', 'G6'];
        
        if (!chartData && window.electronAPI && window.electronAPI.getStudentStatsByGrade) {
            try {
                console.log('Fetching real student data from database...');
                const stats = await window.electronAPI.getStudentStatsByGrade();
                chartData = stats.data;
                gradeLabels = stats.labels;
                console.log('Successfully loaded student statistics:', stats);
            } catch (error) {
                console.error('Failed to fetch student statistics, using sample data:', error);
                chartData = [0, 0, 0, 0, 0, 0]; // Default to zeros if database fails
            }
        } else if (!chartData) {
            // Fallback sample data if no electronAPI available
            chartData = [150, 99, 22, 88, 75, 1];
        }
        
        const option = {
            tooltip: {},
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: gradeLabels,
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
                    name: 'Student Count',
                    type: 'bar',
                    data: chartData,
                    itemStyle: {
                        // borderRadius: [6, 6, 0, 0],
                        color: '#38e038'
                    }
                }
            ]
        };
        
        console.log('Setting chart options with data:', chartData);
        myChart.setOption(option);
        console.log('Chart options set successfully');
        myChart.resize();
        setTimeout(() => {
            myChart.resize();
        }, 0);
        
        // Handle window resize to make chart responsive
        window.addEventListener('resize', () => {
            console.log('Resizing chart...');
            myChart.resize();
        });
        
        return myChart;
    } catch (error) {
        console.error('Error initializing chart:', error);
    }
};
