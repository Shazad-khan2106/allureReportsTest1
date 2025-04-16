const fs = require('fs');
const path = require('path');

// Paths
const reportPath = path.join(__dirname, 'html-report', 'index.html');
const reportJsonPath = path.join(__dirname, 'report', 'cucumber_report.json');

// Read JSON report
const jsonReport = JSON.parse(fs.readFileSync(reportJsonPath, 'utf-8'));

// Extract scenario durations
const timelineData = [];

jsonReport.forEach(feature => {
  (feature.elements || []).forEach(scenario => {
    const durationMs = (scenario.steps || []).reduce((acc, step) => {
      return acc + ((step.result && step.result.duration) || 0);
    }, 0) / 1e6;

    timelineData.push({
      label: scenario.name,
      duration: durationMs.toFixed(2)
    });
  });
});

// Build Chart.js injection
const chartScript = `
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<canvas id="timelineChart" style="width:100%;max-height:300px;margin-bottom:2rem;"></canvas>
<script>
  const ctx = document.getElementById('timelineChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ${JSON.stringify(timelineData.map(t => t.label))},
      datasets: [{
        label: 'Test Duration (ms)',
        data: ${JSON.stringify(timelineData.map(t => parseFloat(t.duration)))},
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Test Execution Timeline' }
      },
      scales: {
        x: { ticks: { autoSkip: false } },
        y: { beginAtZero: true }
      }
    }
  });
</script>`;

// Inject Chart before feature overview
let html = fs.readFileSync(reportPath, 'utf-8');
const insertionPoint = '<div class="features-overview">';
if (html.includes(insertionPoint)) {
  html = html.replace(insertionPoint, chartScript + insertionPoint);
  fs.writeFileSync(reportPath, html);
  console.log('📊 Timeline chart injected into HTML report.');
} else {
  console.warn('⚠️ Could not find injection point in index.html.');
}
