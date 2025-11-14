#!/usr/bin/env node

/**
 * Cross-platform script runner for lint-staged.
 * Handles directory changes and command execution in a way that works on Windows, Linux, and macOS.
 */

const { execSync } = require("child_process");
const path = require("path");

const [baseDir, command, ...files] = process.argv.slice(2);

if (!baseDir || !command) {
  console.error("Usage: lint-staged-runner.js <baseDir> <command> <files...>");
  process.exit(1);
}

const baseDirPath = path.resolve(process.cwd(), baseDir);
const quotedFiles = files.map((f) => `"${f}"`).join(" ");
const fullCommand = `${command} ${quotedFiles}`;

try {
  // Change to the base directory and run the command
  execSync(fullCommand, {
    cwd: baseDirPath,
    stdio: "inherit",
    shell: true,
  });
} catch (error) {
  process.exit(error.status || 1);
}

