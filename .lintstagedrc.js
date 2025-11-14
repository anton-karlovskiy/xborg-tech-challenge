const path = require("path");

/**
 * Converts file paths to relative paths from the specified base directory.
 * Handles both absolute and relative paths for cross-platform compatibility.
 */
function getRelativePaths(filenames, baseDir) {
  const baseDirPath = path.resolve(process.cwd(), baseDir);
  
  return filenames.map((f) => {
    // Convert to absolute path if needed
    const absolutePath = path.isAbsolute(f) ? f : path.resolve(process.cwd(), f);
    // Get relative path from base directory
    const relativePath = path.relative(baseDirPath, absolutePath);
    // Normalize to forward slashes (works cross-platform for these tools)
    return relativePath.replace(/\\/g, "/");
  });
}

/**
 * Creates a cross-platform command using Node.js script runner.
 * This works on Windows (cmd.exe/PowerShell), Linux, and macOS.
 */
function createCommand(baseDir, command, files) {
  // Resolve the runner script path relative to the project root
  const runnerScript = path.resolve(process.cwd(), "scripts", "lint-staged-runner.js");
  const relativePaths = getRelativePaths(files, baseDir);
  const quotedFiles = relativePaths.map((p) => `"${p}"`).join(" ");
  
  return `node "${runnerScript}" "${baseDir}" ${command} ${quotedFiles}`;
}

/**
 * Converts absolute paths to relative paths from repo root for git add
 */
function getGitPaths(filenames) {
  return filenames.map((f) => {
    if (path.isAbsolute(f)) {
      return path.relative(process.cwd(), f).replace(/\\/g, "/");
    }
    return f.replace(/\\/g, "/");
  });
}

module.exports = {
  // Backend files
  "backend/**/*.{ts,js,json}": (filenames) => {
    const prettierCmd = createCommand("backend", "prettier --write", filenames);
    const eslintCmd = createCommand("backend", "eslint --fix --max-warnings=0", filenames);
    const gitPaths = getGitPaths(filenames);
    
    return [
      prettierCmd,
      eslintCmd,
      // Add files back to staging after fixes (use relative paths)
      `git add ${gitPaths.map((f) => `"${f}"`).join(" ")}`,
    ];
  },
  // Frontend files
  "frontend/**/*.{ts,tsx,js,jsx,json,css}": (filenames) => {
    const prettierCmd = createCommand("frontend", "prettier --write", filenames);
    const eslintCmd = createCommand("frontend", "eslint --fix --max-warnings=0", filenames);
    const gitPaths = getGitPaths(filenames);
    
    return [
      prettierCmd,
      eslintCmd,
      // Add files back to staging after fixes (use relative paths)
      `git add ${gitPaths.map((f) => `"${f}"`).join(" ")}`,
    ];
  },
};

