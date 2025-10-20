import Chart from "chart.js/auto";

const canvas = document.getElementById("chatChart");
const chartTypeSelector = document.getElementById("chartType");

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Elemen canvas dengan id 'chatChart' tidak ditemukan.");
}

if (!(chartTypeSelector instanceof HTMLSelectElement)) {
  throw new Error("Elemen select dengan id 'chartType' tidak ditemukan.");
}

const ctx = canvas.getContext("2d");

const messageSeries = {
  labels: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
  incoming: [12, 19, 8, 15, 10, 20],
  outgoing: [9, 14, 12, 13, 9, 16],
};

const totals = {
  incoming: messageSeries.incoming.reduce((sum, value) => sum + value, 0),
  outgoing: messageSeries.outgoing.reduce((sum, value) => sum + value, 0),
};

const palette = {
  incoming: {
    border: "rgb(59, 130, 246)",
    background: "rgba(59, 130, 246, 0.25)",
    point: "rgb(37, 99, 235)",
  },
  outgoing: {
    border: "rgb(16, 185, 129)",
    background: "rgba(16, 185, 129, 0.25)",
    point: "rgb(5, 150, 105)",
  },
};

const basePlugins = {
  legend: {
    display: true,
    position: "top",
    labels: {
      usePointStyle: true,
    },
  },
  title: {
    display: true,
    text: "Aktivitas Chat per Jam",
  },
  tooltip: {
    callbacks: {
      label: (context) => {
        const value =
          typeof context.parsed === "number" ? context.parsed : context.parsed.y;
        return `${context.dataset.label}: ${value} pesan`;
      },
    },
  },
};

const multiDataset = () => [
  {
    label: "Pesan Masuk",
    data: messageSeries.incoming,
    borderColor: palette.incoming.border,
    backgroundColor: palette.incoming.background,
    pointBackgroundColor: palette.incoming.point,
    pointRadius: 4,
    tension: 0.35,
    fill: true,
  },
  {
    label: "Pesan Keluar",
    data: messageSeries.outgoing,
    borderColor: palette.outgoing.border,
    backgroundColor: palette.outgoing.background,
    pointBackgroundColor: palette.outgoing.point,
    pointRadius: 4,
    tension: 0.35,
    fill: true,
  },
];

const createConfig = (type) => {
  switch (type) {
    case "bar":
      return {
        type,
        data: {
          labels: messageSeries.labels,
          datasets: multiDataset().map((dataset) => ({
            ...dataset,
            borderWidth: 1,
            tension: 0,
            fill: false,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: basePlugins,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 5 },
              title: { display: true, text: "Jumlah Pesan" },
            },
            x: {
              title: { display: true, text: "Jam" },
            },
          },
        },
      };
    case "radar":
      return {
        type,
        data: {
          labels: messageSeries.labels,
          datasets: multiDataset(),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: basePlugins,
          scales: {
            r: {
              beginAtZero: true,
              ticks: { stepSize: 5 },
              pointLabels: { font: { size: 12 } },
            },
          },
        },
      };
    case "doughnut":
      return {
        type,
        data: {
          labels: ["Pesan Masuk", "Pesan Keluar"],
          datasets: [
            {
              label: "Total Pesan",
              data: [totals.incoming, totals.outgoing],
              backgroundColor: [
                palette.incoming.border,
                palette.outgoing.border,
              ],
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            ...basePlugins,
            title: {
              ...basePlugins.title,
              text: "Total Pesan Masuk vs Keluar",
            },
          },
          cutout: "60%",
        },
      };
    case "line":
    default:
      return {
        type: "line",
        data: {
          labels: messageSeries.labels,
          datasets: multiDataset(),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: basePlugins,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 5 },
              title: { display: true, text: "Jumlah Pesan" },
            },
            x: {
              title: { display: true, text: "Jam" },
            },
          },
        },
      };
  }
};

let chartInstance = new Chart(ctx, createConfig(chartTypeSelector.value));

chartTypeSelector.addEventListener("change", (event) => {
  const selectedType = event.target.value;
  chartInstance.destroy();
  chartInstance = new Chart(ctx, createConfig(selectedType));
});
