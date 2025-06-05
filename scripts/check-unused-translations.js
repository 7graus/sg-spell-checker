#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob').sync;

// Configuration
const config = {
  // File patterns to search for translation usage
  searchPatterns: [
    'src/**/*.{js,jsx,ts,tsx}'
  ],
  // i18n configuration file path
  i18nConfigPath: 'src/i18n.ts',
  // Exclude patterns for files
  excludePatterns: [
    '**/node_modules/**', 
    '**/dist/**', 
    '**/build/**',
    'src/i18n.ts'  // Exclude the i18n config file itself
  ],
};

// Function to recursively extract translation keys
function extractTranslationKeys(obj, prefix = '') {
  const keys = new Set();
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      // Recursively process nested objects
      const nestedKeys = extractTranslationKeys(value, newKey);
      nestedKeys.forEach(k => keys.add(k));
    } else if (typeof value === 'string') {
      // Add the key if it's a string value
      keys.add(newKey);
    }
  }
  
  return keys;
}

// Function to find used translation keys in files
function findUsedTranslationKeys(files) {
  const usedKeys = new Set();

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Match t('key') or t("key") patterns, including those with parameters
    const tPattern = /t\(['"]([^'"]+)['"](?:\s*,\s*{[\s\S]*?})?\)/g;
    let match;

    while ((match = tPattern.exec(content)) !== null) {
      usedKeys.add(match[1]);
    }
  });

  return usedKeys;
}

// Main function
function main() {
  try {
    // Get all files to search
    const files = glob(config.searchPatterns, {
      ignore: config.excludePatterns,
    });

    // Read and parse the i18n config file
    const content = fs.readFileSync(config.i18nConfigPath, 'utf8');
    const resourcesMatch = content.match(/const resources = ({[\s\S]*?});/);
    if (!resourcesMatch) {
      throw new Error('Could not find resources object in i18n config');
    }
    
    // Evaluate the resources object to get the actual structure
    const resources = eval(`(${resourcesMatch[1]})`);
    const allKeys = extractTranslationKeys(resources.pt.translation);
    
    // Find used keys
    const usedKeys = findUsedTranslationKeys(files);

    // Find unused keys
    const unusedKeys = [...allKeys].filter(key => !usedKeys.has(key));

    // Print results
    console.log('\n=== Unused Translation Keys ===\n');
    if (unusedKeys.length === 0) {
      console.log('No unused translation keys found! 🎉');
    } else {
      unusedKeys.forEach(key => {
        console.log(`- ${key}`);
      });
      console.log(`\nTotal unused keys: ${unusedKeys.length}`);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();