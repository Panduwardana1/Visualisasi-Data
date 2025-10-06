// ============================
// Data untuk visualisasi
// ============================
const data = {
  categorical: {
    labels: ["Elektronik", "Pakaian", "Makanan", "Buku", "Olahraga"],
    values: [120, 85, 75, 50, 40],
    colors: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
  },
  temporal: {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
    values: [65, 59, 80, 81, 56, 55],
    color: "#ff6384",
  },
  comparison: {
    labels: ["Jabodetabek", "Jawa Barat", "Jawa Tengah", "Jawa Timur"],
    values: [180, 125, 110, 95],
    colors: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
  },
};

const fallbackColors = [
  "#ff6384",
  "#36a2eb",
  "#ffce56",
  "#4bc0c0",
  "#9966ff",
  "#ff9f40",
];

// ============================
// Analisis berdasarkan pilihan
// ============================

const analysis = {
  categorical: {
    executive:
      "Bar chart cocok untuk audiens eksekutif yang perlu melihat perbandingan antar kategori secara cepat dan jelas.",
    technical:
      "Dot plot mungkin lebih tepat untuk analis yang membutuhkan presisi dalam membandingkan nilai antar kategori.",
    general:
      "Bar chart mudah dipahami oleh audiens umum dan efektif menunjukkan perbandingan antar kategori.",
  },
  temporal: {
    executive:
      "Line chart ideal untuk menunjukkan tren waktu kepada eksekutif yang tertarik pada pertumbuhan.",
    technical:
      "Line chart dengan titik data memungkinkan analis melihat nilai spesifik pada setiap periode.",
    general:
      "Line chart mudah dipahami oleh audiens umum untuk melihat pola tren dari waktu ke waktu.",
  },
  comparison: {
    executive:
      "Bar chart horizontal memudahkan eksekutif membandingkan performa antar region.",
    technical:
      "Bar chart horizontal memungkinkan analis melihat perbandingan yang akurat antar kategori.",
    general:
      "Bar chart horizontal mudah dibaca dan dipahami untuk perbandingan antar region.",
  },
};

let myChart = null;

// ============================
// Fungsi untuk menghasilkan visualisasi
// ============================
function generateVisualization() {
  const dataType = document.getElementById("dataType").value;
  const audience = document.getElementById("audience").value;
  const chartType = document.getElementById("chartType").value;

  // Hancurkan chart sebelumnya jika ada
  if (myChart) {
    myChart.destroy();
  }

  const ctx = document.getElementById("dataChart").getContext("2d");

  const selectedData = data[dataType];
  const values = selectedData.values;
  const labels = selectedData.labels;
  const baseColor =
    selectedData.color || getPalette(selectedData, values.length)[0];

  const dataset = {
    label: "Jumlah Penjualan",
    data: values,
  };

  if (chartType === "line") {
    dataset.borderColor = baseColor;
    dataset.backgroundColor = hexToRgba(baseColor, 0.15);
    dataset.borderWidth = 2;
    dataset.pointRadius = 4;
    dataset.pointBackgroundColor = baseColor;
    dataset.pointBorderColor = "#ffffff";
    dataset.fill = false;
    dataset.tension = 0.3;
  } else if (chartType === "radar") {
    dataset.borderColor = baseColor;
    dataset.backgroundColor = hexToRgba(baseColor, 0.2);
    dataset.borderWidth = 2;
    dataset.pointBackgroundColor = baseColor;
    dataset.pointBorderColor = "#ffffff";
    dataset.fill = true;
  } else if (chartType === "pie" || chartType === "doughnut") {
    const palette = getPalette(selectedData, values.length);
    dataset.backgroundColor = palette;
    dataset.borderColor = "#ffffff";
    dataset.borderWidth = 1;
  } else {
    const palette = getPalette(selectedData, values.length);
    dataset.backgroundColor = palette;
    dataset.borderColor = palette;
    dataset.borderWidth = 1;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text:
          dataType === "categorical"
            ? "Penjualan per Kategori"
            : dataType === "temporal"
            ? "Trend Penjualan"
            : "Penjualan per Region",
      },
      legend: {
        position: "bottom",
      },
    },
  };

  if (chartType === "bar" && dataType === "comparison") {
    options.indexAxis = "y";
  }

  const scaleOptions = getScaleOptions(chartType);
  if (scaleOptions) {
    options.scales = scaleOptions;
  }

  // Konfigurasi chart berdasarkan jenis data
  const config = {
    type: chartType,
    data: {
      labels,
      datasets: [dataset],
    },
    options,
  };

  // Buat chart baru
  myChart = new Chart(ctx, config);

  // Tampilkan analisis
  document.getElementById("analysisText").innerHTML = `
    <h3>Analisis Visualisasi</h3>
    <p><strong>Jenis Data:</strong> ${
      document.getElementById("dataType").selectedOptions[0].text
    }</p>
    <p><strong>Profil Audiens:</strong> ${
      document.getElementById("audience").selectedOptions[0].text
    }</p>
    <p>${analysis[dataType][audience]}</p>
  `;
}

// ============================
// Event listener
// ============================
document
  .getElementById("generateBtn")
  .addEventListener("click", generateVisualization);

// Generate chart pertama kali saat halaman dimuat
document.addEventListener("DOMContentLoaded", generateVisualization);

function getPalette(selectedData, length) {
  if (Array.isArray(selectedData.colors) && selectedData.colors.length) {
    return repeatToLength(selectedData.colors, length);
  }

  if (selectedData.color) {
    return Array.from({ length }, () => selectedData.color);
  }

  return repeatToLength(fallbackColors, length);
}

function repeatToLength(source, length) {
  const palette = [];
  for (let i = 0; i < length; i += 1) {
    palette.push(source[i % source.length]);
  }
  return palette;
}

function hexToRgba(hex, alpha) {
  const sanitized = hex.replace("#", "");
  if (sanitized.length !== 6) {
    return hex;
  }
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getScaleOptions(chartType) {
  if (chartType === "pie" || chartType === "doughnut") {
    return undefined;
  }

  if (chartType === "radar") {
    return {
      r: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    };
  }

  return {
    y: {
      beginAtZero: true,
    },
  };
}
