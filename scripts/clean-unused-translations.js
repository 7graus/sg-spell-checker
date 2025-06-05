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

// Function to remove unused keys and empty objects
function removeUnusedKeys(obj, unusedKeys) {
  const result = { ...obj };
  
  // First remove the unused keys
  for (const key of unusedKeys) {
    const parts = key.split('.');
    let current = result;
    
    // Navigate to the parent object
    for (let i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]]) {
        current = current[parts[i]];
      }
    }
    
    // Remove the key
    delete current[parts[parts.length - 1]];
  }

  // Then recursively clean up empty objects
  function cleanEmptyObjects(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        cleanEmptyObjects(obj[key]);
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key];
        }
      }
    }
    return obj;
  }

  return cleanEmptyObjects(result);
}

// Function to format the object as a string
// Function to format the object as a string
function formatObject(obj, indent = 2) {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    
    const indentStr = ' '.repeat(indent);
    const lines = entries.map(([key, value]) => {
      // Add quotes around keys that contain special characters
      const formattedKey = /[^a-zA-Z0-9_]/.test(key) ? `'${key}'` : key;
      
      if (typeof value === 'object' && value !== null) {
        return `${indentStr}${formattedKey}: ${formatObject(value, indent + 2)}`;
      }
      return `${indentStr}${formattedKey}: '${value}'`;
    });
    
    return `{\n${lines.join(',\n')}\n${' '.repeat(indent - 2)}}`;
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

    if (unusedKeys.length === 0) {
      console.log('No unused translation keys found! 🎉');
      return;
    }

    // Remove unused keys
    const cleanedResources = {
      ...resources,
      pt: {
        ...resources.pt,
        translation: removeUnusedKeys(resources.pt.translation, unusedKeys)
      }
    };

    // Format the new content
    const newContent = content.replace(
      /const resources = {[\s\S]*?};/,
      `const resources = ${formatObject(cleanedResources)};`
    );

    // Write the new content
    fs.writeFileSync(config.i18nConfigPath, newContent);
    console.log('\n=== Removed Unused Translation Keys ===\n');
    unusedKeys.forEach(key => {
      console.log(`- ${key}`);
    });
    console.log(`\nTotal removed keys: ${unusedKeys.length}`);
    console.log('\nOriginal file has been backed up with .backup extension');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();