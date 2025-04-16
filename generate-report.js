const os = require('os');
const path = require('path');
const fs = require('fs');
const reporter = require('multiple-cucumber-html-reporter');

const platformName = os.platform();
const platformVersion = os.release();
const platformMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux'
};

const logoFaviconSrc = path.join(__dirname, 'assets', 'logo.png');
const logoFaviconDest = path.join(__dirname, 'html-report', 'logo.png');
const logoReportNameSrc = path.join(__dirname, 'assets', 'baptist_health_south_florida.png');
const logoReportNameDest = path.join(__dirname, 'html-report', 'baptist_health_south_florida.png');

// Generate the report
reporter.generate({
  jsonDir: 'report',
  reportPath: './html-report',
  metadata: {
    browser: {
      name: 'chrome',
      version: '114'
    },
    device: os.hostname(),
    platform: {
      name: platformMap[platformName] || platformName,
      version: platformVersion
    }
  },
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: 'Baptist Health : South Florida' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Cycle', value: 'B11221.34321' },
      { label: 'Execution Start Time', value: new Date().toLocaleString() },
      { label: 'Execution End Time', value: new Date().toLocaleString() }
    ]
  },
  pageTitle: 'Baptist Health : South Florida',
  reportName: ' ',
  displayDuration: true,
  displayReportTime: true,
  pageFooter: '<div style="text-align:center">QA Team ©Shazad & ©Ruchitha</div>',
  brandTitle: '⚕ Baptist QA Report',
  customMetadata: true,
  customStyle: 'assets/custom.css',
  logo: {
    path: 'logo.png',
    width: 100,
    height: 100
  }
});

setTimeout(() => {
  try {
    // Copy assets if not already present
    if (!fs.existsSync(logoFaviconDest)) {
      fs.copyFileSync(logoFaviconSrc, logoFaviconDest);
    }
    if (!fs.existsSync(logoReportNameDest)) {
      fs.copyFileSync(logoReportNameSrc, logoReportNameDest);
    }

    const htmlPath = path.join(__dirname, 'html-report', 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Inject favicon into <head>
    if (!htmlContent.includes('<link rel="icon"')) {
      htmlContent = htmlContent.replace(
        '<head>',
        `<head>
  <link rel="icon" type="image/png" href="logo.png">`
      );
    }

    // Extract and remove original dark mode toggle
    const toggleMatch = htmlContent.match(/<input[^>]+id="darkCheck"[^>]*>[\s\S]*?<label[^>]+for="darkCheck"[\s\S]*?<\/label>/);
    const toggleHTML = toggleMatch ? toggleMatch[0] : '';
    if (toggleHTML) {
      htmlContent = htmlContent.replace(toggleHTML, '');
    }

    // Remove default dashboard text
    htmlContent = htmlContent.replace(
      /<p class="navbar-text"[^>]*>.*?<\/p>/s,
      ''
    );

    // Inject custom navbar with centered native toggle
    htmlContent = htmlContent.replace(
      /<div class="container-fluid">/,
      `<div class="container-fluid">
  <div class="navbar-custom">
    <div class="navbar-left">
      <p class="navbar-dashboard">Dashboard</p>
    </div>
    <div class="navbar-center">
      ${toggleHTML}
    </div>
    <div class="navbar-right">
      <img src="baptist_health_south_florida.png" class="custom-logo-img" alt="Report Logo">
    </div>
  </div>`
    );

    // Write updated HTML
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('✅ Report customized: dashboard | toggle | logo.');
  } catch (err) {
    console.error('❌ Error updating report:', err);
  }
}, 1000);
