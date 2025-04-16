import fs from 'fs';
import path from 'path';

const reportPath = path.join(process.cwd(), 'html-report', 'index.html');
const jsonReport = JSON.parse(fs.readFileSync('report/cucumber_report.json', 'utf-8'));

const timelineData = [];

jsonReport.forEach(feature => {
  feature.elements.forEach(scenario => {
    const start = new Date(scenario.start_timestamp || Date.now());
    const durationMs = scenario.steps?.reduce((acc, s) => acc + (s.result?.duration || 0), 0) / 1e6;
    timelineData.push({
      label: scenario.name,
      startTime: start.toLocaleTimeString(),
      duration: durationMs.toFixed(2),
    });
  });
});

// Chart JS snippet
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
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
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

// Inject into HTML
let html = fs.readFileSync(reportPath, 'utf-8');
html = html.replace('<div class="features-overview">', `${chartScript}<div class="features-overview">`);
fs.writeFileSync(reportPath, html);

console.log('📊 Timeline chart injected into report');
