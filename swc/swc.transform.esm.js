/* eslint-disable guard-for-in */
const fs = require('fs');
const path = require('path');
const { transformSync } = require('@swc/core');
const swcESM = require('./swcrc.esm');

const aliases = {
  '@axios': 'axios'
};

const srcPathFrom = path.resolve(__dirname, '../lib');
const srcPathTo = path.resolve(__dirname, '../build/esm');

walkAndTranspileFiles(srcPathFrom);

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function replaceAliases(code) {
  for (const alias in aliases) {
    const aliasPath = aliases[alias];
    const regex = new RegExp(`(["'])${alias}(/[^"']*)?\\1`, 'g');
    code = code.replace(regex, (match, quote) => {
      return `${quote}${aliasPath}${quote}`;
    });
  }
  return code;
}

function transpileFile(dir, file) {
  const source = fs.readFileSync(path.join(dir, file), 'utf8');
  const replacedSource = replaceAliases(source);
  const { code } = transformSync(replacedSource, swcESM);

  const relativePath = path.relative(srcPathFrom, dir);
  const fileTransformedPath = path.join(srcPathTo, relativePath, file.replace(/\.es6$/, '.js'));
  ensureDirectoryExists(fileTransformedPath);

  fs.writeFileSync(fileTransformedPath, code, 'utf8');
}

function walkAndTranspileFiles(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      walkAndTranspileFiles(filePath);
    } else if (filePath.endsWith('.es6') && !filePath.endsWith('.spec.es6')) {
      transpileFile(dir, file);
    }
  }
}
