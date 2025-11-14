module.exports = {
  // Backend files
  "backend/**/*.{ts,js,json}": (filenames) => {
    // Strip "backend/" prefix and quote paths to handle spaces
    const relativePaths = filenames.map((f) => {
      const relative = f.replace(/^backend\//, "");
      return `"${relative}"`;
    });
    return [
      `cd backend && prettier --write ${relativePaths.join(" ")}`,
      `cd backend && eslint --fix --max-warnings=0 ${relativePaths.join(" ")}`,
    ];
  },
  // Frontend files
  "frontend/**/*.{ts,tsx,js,jsx,json,css}": (filenames) => {
    // Strip "frontend/" prefix and quote paths to handle spaces
    const relativePaths = filenames.map((f) => {
      const relative = f.replace(/^frontend\//, "");
      return `"${relative}"`;
    });
    return [
      `cd frontend && prettier --write ${relativePaths.join(" ")}`,
      `cd frontend && eslint --fix --max-warnings=0 ${relativePaths.join(" ")}`,
    ];
  },
};

