const fs = require('fs');
const path = require('path');

const dirs = ['components', 'app'];
const allIcons = new Set();

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g);
      if (matches) {
        matches.forEach(match => {
          const inner = match.replace(/import\s+{/, '').replace(/}\s+from.*/, '');
          inner.split(',').forEach(icon => {
            const cleanIcon = icon.trim().split(' as ')[0];
            if (cleanIcon) {
              allIcons.add(cleanIcon);
            }
          });
        });
      }
    }
  }
}

dirs.forEach(walk);

console.log(Array.from(allIcons).sort().join('\n'));
