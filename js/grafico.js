const ctx = document.getElementById('lineChart').getContext('2d');
const data = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre','Noviembre','Diciembre'],
    datasets: [
      {
        label: 'Inventario 2023',
        data: [2, 5, 1, 33, 7, 20, 1, 15, 2, 5, 56, 8],
        borderColor: 'rgba(75, 192, 192, 1)', 
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', 
        pointHoverRadius: 2,
        pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 3,
      },
      {
        label: 'Inventario 2024',
        data: [4, 10, 3, 6, 20, 50, 6, 14, 19, 30,10,60],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointHoverRadius: 7,
        pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
      }
    ]
  };

  // Opciones de personalización del gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16,
          },
          color: '#FFFFFF' 
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#FFFFFF', 
        bodyColor: '#FFFFFF', 
        bodyFont: {
          size: 14,
        },
      }
    },
    scales: {
      x: {
        grid: {
          display: false, 
        },
        ticks: {
          color: '#FFFFFF'  
        }
      },
      y: {
        beginAtZero: true, 
        ticks: {
          stepSize: 20, 
          font: {
            size: 14,
          },
          color: '#FFFFFF' 
        },
        grid: {
          color: '#FFFFFF', 
        }
      }
    }
  };

  // Crea el gráfico de líneas
  const lineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
  });