# HRM Frontend

A modern, responsive Human Resource Management (HRM) dashboard application built with **React** and **TypeScript**. This application is designed to streamline HR processes including employee management, reporting, and data visualization.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Tech Stack

This project uses a robust stack of modern web technologies:

- **Core**: [React 18](https://reactjs.org/) (via Create React App), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Headless UI](https://headlessui.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **State & Utilities**: [Axios](https://axios-http.com/), [Date-fns](https://date-fns.org/)
- **Visualization**: [Chart.js](https://www.chartjs.org/) with `react-chartjs-2`
- **UI Components**:
  - `react-icons`: Comprehensive icon library
  - `react-select`: Flexible select input
  - `react-modal`: Accessible modal dialogs
  - `react-toastify`: Toast notifications
  - `react-tooltip`: Tooltips
  - `react-quill`: Rich text editor

### 📄 Reporting & Exports

- **PDF**: `react-pdf`, `jspdf`, `html2canvas`, `react-to-print`, `react-to-pdf`
- **Excel**: `exceljs`, `file-saver`

## 🛠️ Prerequisites

Ensure you have the following installed on your local machine:

- **Node.js**: v18.x or higher recommended
- **npm**: v9.x or higher

## 📦 Installation

1. **Clone the repository** (if applicable) or navigate to the project folder.

2. **Install Dependencies**:
   Run the following command to install all required packages.

   > **Note**: This project includes specific dependency overrides in `package.json` to ensure compatibility and security. simple `npm install` will work correctly.

   ```bash
   npm install
   ```

## 🏃‍♂️ Running the Application

To start the development server, run:

```bash
npm start
```

> **Important**: This project uses **`npm start`**, not `npm run dev`.

Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload when you make changes.

## 🏗️ Building for Production

To create a production-ready build, run:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## 🧪 Testing

To launch the test runner:

```bash
npm test
```

## 📂 Project Configuration

- **TypeScript**: configured in `tsconfig.json` with strict mode enabled.
- **Tailwind**: configured in `tailwind.config.js` (assumed standard setup).
- **Overrides**: `package.json` includes overrides for `nth-check`, `postcss`, `webpack-dev-server`, and `typescript` to resolve security vulnerabilities and peer dependency conflicts.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
