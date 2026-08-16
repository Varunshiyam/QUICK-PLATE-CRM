const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.css')) filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src/pages'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/background(-color)?:\s*#ffffff/gi, 'background$1: var(--color-white)');
  content = content.replace(/background(-color)?:\s*#fdfcfb/gi, 'background$1: var(--color-bg)');
  content = content.replace(/background(-color)?:\s*#fff7ed/gi, 'background$1: var(--color-gray-50)');
  
  fs.writeFileSync(file, content);
});

console.log('Replaced colors in CSS files.');
