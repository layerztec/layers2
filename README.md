# Layers2 - Bitcoin Layer 2 Projects Tracker

A simple platform to track and explore Bitcoin Layer 2 projects. Browse through 100+ projects, filter by type and category, and view detailed information about each protocol.

## 📊 How to Add New Projects

### Step 1: Add the Project Logo
1. Find the project's logo image (PNG or SVG format)
2. Save it in the `src/assets/data/img/` folder
3. Name it something simple like `project-name.png`

### Step 2: Add Project Information
1. Open the file `src/assets/data/layers-data.json`
2. Find the end of the file (before the closing `]`)
3. Add a comma after the last project entry
4. Add your new project using this format:

```json
{
  "Name": "Your Project Name",
  "Category": "Zk-rollup",
  "Network Stage": "Mainnet",
  "Description": "What does this project do?",
  "Native Token": "TOKEN",
  "Founded": "2023",
  "Image": "your-project-logo.png",
  "Type": "Rollup",
  "Link": "https://yourproject.com"
}
```

### Required Information:
- **Name**: The project's name
- **Category**: Choose from: "Zk-rollup", "Sidechain", "Virtual UTXOs", "Anchored Chain", etc.
- **Network Stage**: "Mainnet", "Testnet"
- **Image**: The filename of the logo you added (e.g., "project-logo.png")
- **Type**: Choose from: "Bitcoin Native", "Rollup", "Sidechain", "Meta Protocols", "Other"

### Optional Information:
- **Description**: A longer description of what the project does
- **Native Token**: The project's token symbol (if it has one)
- **Founded**: The year the project was founded
- **Link**: The project's website URL

### Example:
```json
{
  "Name": "Bitcoin Layer 2 Example",
  "Category": "Zk-rollup",
  "Network Stage": "Testnet",
  "Description": "A Bitcoin Layer 2 solution that enables fast and cheap transactions using zero-knowledge proofs.",
  "Native Token": "BL2E",
  "Founded": "2023",
  "Image": "bitcoin-layer2-example.png",
  "Type": "Rollup",
  "Link": "https://example.com"
}
```

## 🔧 For Developers - Running the Site

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm run dev
```

3. Open your browser to `http://localhost:5173`

---

Built with ❤️ for the Bitcoin Layer 2 ecosystem