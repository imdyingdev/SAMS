// Gender Chart Initialization
window.initializeGenderChart = async function initializeGenderChart(elementId = 'gender-chart', data = null) {
    console.log('Initializing gender chart...');
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
        chartDom.style.overflow = 'visible'; // Allow tooltips to overflow and be visible
        
        // Initialize the chart with a custom background (transparent)
        const myChart = echarts.init(chartDom, null);
        console.log('Chart initialized');
        
        // Fetch real data from database if no data provided
        let genderData;
        if (!data) {
            try {
                console.log('Fetching gender statistics from database...');
                const stats = await window.electronAPI.getStudentStatsByGender();
                genderData = stats.data;
                console.log('Gender statistics received:', stats);
            } catch (error) {
                console.error('Failed to fetch gender statistics, using fallback data:', error);
                // Fallback data if database is unavailable
                genderData = [
                    { value: 0, name: 'Male' },
                    { value: 0, name: 'Female' }
                ];
            }
        } else {
            genderData = data;
        }
        
        const option = {
            color: ['#3b9dff', '#ff3b83'], // Light Blue for Male, Light Pink for Female
            tooltip: {
            },
            legend: {
                top: '10%',
                left: 'center',
                itemGap: 20,
                textStyle: {
                    color: '#fff'
                }
            },
            series: [
                {
                  name: 'Gender Distribution',
                  type: 'pie',
                  radius: ['40%', '70%'],
                  center: ['50%', '55%'],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 8,
                    borderColor: 'rgb(6, 11, 78)',
                    borderWidth: 6
                  },
                  label: {
                    show: false,        
                    position: 'center'
                  },
                  emphasis: {
                    label: {
                      color: 'white',
                      show: true,
                      fontSize: 20,
                      fontWeight: 'bold'
                    }
                  },
                  labelLine: {
                    show: false
                  },
                  data: genderData
                }
              ]
        };
        
        console.log('Setting chart options with data:', genderData);
        myChart.setOption(option);
        console.log('Chart options set successfully');
        
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
