
# ⚕️ Baptist Health: South Florida – Automation Framework

This repository contains the end-to-end UI Test Automation Framework built for **Baptist Health: South Florida**, leveraging **Playwright** and **Cucumber.js**, with rich custom reporting, timeline visualization, video capture, and CI/CD integration via GitHub Actions.

---

## 📦 Tech Stack

- ✅ [Playwright](https://playwright.dev/) – Browser automation
- ✅ [Cucumber.js](https://github.com/cucumber/cucumber-js) – BDD support
- ✅ [multiple-cucumber-html-reporter](https://www.npmjs.com/package/multiple-cucumber-html-reporter)
- ✅ GitHub Actions – CI/CD
- ✅ Cucumber-style HTML reports (with logo, metadata, timeline, and video)

---

## 🚀 Key Features

- ✅ Scenario-based test automation with Cucumber
- ✅ Custom HTML report:
  - 🏥 Branded with Baptist Health logos
  - 📈 Timeline execution chart
  - 🎥 Embedded Playwright test videos
- ✅ Screenshot of report UI
- ✅ Email notification post execution
- ✅ Auto-deployment of report to GitHub Pages

---

## 🗂️ Project Structure

```
.
├── assets/                    # Branding and custom styles
│   ├── baptist_health_south_florida.png
│   ├── custom.css
│   └── logo.png

├── report/                    # Cucumber JSON output
│   └── cucumber_report.json

├── support/                   # Global test setup and hooks
│   ├── hooks.ts
│   └── world.ts

├── tests/                     # BDD test specs and page objects
│   ├── features/              # .feature files
│   │   ├── baptistTranscription.feature
│   │   └── chatBot.feature
│   ├── pages/                 # Page Object Model (POM)
│   │   ├── BaptistTranscription.ts
│   │   └── LoginPage.ts
│   ├── steps/                 # Step definitions
│   │   └── baptistTranscription.step.ts
│   ├── test_data/            # Test data
│   │   └── properties.json
│   └── utils/                # Utility functions
│       ├── fuzzyMatch.ts
│       └── streamAudioToBot.ts

├── tools/                    # External tools (e.g., ffmpeg)
│   ├── ffmpeg.exe
│   └── ffplay.exe

├── voice/                    # Audio files used for testing
│   ├── English.mp3
│   ├── Spanish.mp3
│   └── output.pcm

├── .github/workflows/        # GitHub Actions CI/CD
│   └── report.yml            # Test + Deploy + Notify pipeline

├── capture-screenshot.js     # Screenshot automation script
├── cucumber.js               # Cucumber config
├── generate-report.js        # Custom HTML report generation
├── timeline-injector.js      # Timeline chart injection script
├── package.json              # NPM project config
├── tsconfig.json             # TypeScript config
└── README.md                 # Project documentation

```

---

## 🧪 How to Run Locally

### 🔧 Install dependencies

```bash
npm ci
```

### ▶️ Run tests

```bash
npm run test
```

### 📊 Generate custom HTML report

```bash
npm run report
```

### 🖼️ Capture screenshot + inject timeline

```bash
npm run screenshot
npm run inject-timeline
```

### 🌐 Preview locally

```bash
npx serve html-report
```

---

## 🔁 CI/CD Workflow (GitHub Actions)

The GitHub Actions pipeline is configured to:

- Run tests on every push to `master`
- Generate and customize HTML report
- Capture screenshot of report UI
- Deploy report to GitHub Pages
- Email the report summary (with link and screenshot)

### 🔐 Required Secrets

| Secret Name       | Description                        |
|-------------------|------------------------------------|
| `EMAIL_USERNAME`  | SMTP email address (sender)        |
| `EMAIL_PASSWORD`  | App password for SMTP login        |
| `EMAIL_TO`        | Comma-separated list of recipients |

---

## 📬 Email Report Includes

- 🧪 Test status (success/failure)
- 📸 Screenshot of report UI
- 🔗 Link to full HTML report on GitHub Pages

---

## 🔗 Live Report

[📂 View Latest Report on GitHub Pages](https://shazad-khan2106.github.io/allureReportsTest1/)

---

## 👤 Contributors

- [**Shazad Khan**](shazad.khan@techolution.com) – Test Automation, CI/CD Integration  
- [**Ruchitha Sai**](ruchitha.sai@techolution.com) – QA Functional Testing & Reporting

---

## 📝 License

This project is licensed under the MIT License – feel free to use and extend it.
