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
        let totalStudents = 0;
        let maleCount = 0;
        let femaleCount = 0;
        
        if (!data) {
            try {
                console.log('Fetching gender statistics from database...');
                const stats = await window.electronAPI.getStudentStatsByGender();
                totalStudents = stats.totalStudents || 0;
                maleCount = stats.maleCount || 0;
                femaleCount = stats.femaleCount || 0;
                
                // Calculate percentages for better visualization
                const malePercentage = totalStudents > 0 ? (maleCount / totalStudents) * 100 : 0;
                const femalePercentage = totalStudents > 0 ? (femaleCount / totalStudents) * 100 : 0;
                
                genderData = [
                    { 
                        value: maleCount, 
                        name: 'Male', 
                        percentage: malePercentage.toFixed(1) + '%',
                        actualCount: maleCount
                    },
                    { 
                        value: femaleCount, 
                        name: 'Female', 
                        percentage: femalePercentage.toFixed(1) + '%',
                        actualCount: femaleCount
                    }
                ];
                
                console.log('Gender statistics received:', stats);
                console.log('Processed gender data:', genderData);
            } catch (error) {
                console.error('Failed to fetch gender statistics, using fallback data:', error);
                // Fallback data if database is unavailable
                genderData = [
                    { value: 5, name: 'Male', percentage: '83.3%', actualCount: 5 },
                    { value: 1, name: 'Female', percentage: '16.7%', actualCount: 1 }
                ];
                totalStudents = 6;
            }
        } else {
            genderData = data;
            // Calculate total from provided data
            totalStudents = data.reduce((sum, item) => sum + item.value, 0);
        }
        
        const option = {
            color: ['#3b9dff', '#ff3b83'], // Light Blue for Male, Light Pink for Female
            tooltip: {
                trigger: 'item',
                formatter: function(params) {
                    return `${params.name}: ${params.data.percentage} (${params.data.actualCount} students)`;
                }
            },
            title: {
                text: `Gender Distribution (${totalStudents})`,
                left: 'center',
                top: 0,
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                }
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
                  minAngle: 5, // Ensure small values are still visible (minimum 5 degrees)
                  minShowLabelAngle: 5, // Show labels for segments at least 5 degrees
                  startAngle: 0, // Start from top
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
                      fontSize: 16,
                      fontWeight: 'bold',
                      formatter: function(params) {
                        return `${params.name}\n${params.data.percentage}`;
                      }
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
