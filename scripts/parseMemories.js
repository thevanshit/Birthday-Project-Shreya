const fs = require('fs');
const path = require('path');

const RESOURCES_DIR = path.join(__dirname, '..', 'Resources - Shreya Boday');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'memories.json');

const MONTH_MAP = {
  'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
  'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
  'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
};

function parseMonthFolderName(folderName) {
  const match = folderName.match(/(\w+)\s+(\d{4})/);
  if (match) {
    const monthAbbr = match[1];
    const year = match[2];
    return { month: MONTH_MAP[monthAbbr] || monthAbbr, year };
  }
  return { month: 'Unknown', year: 'Unknown' };
}

function parseDateFolderName(folderName) {
  const match = folderName.match(/(\d{1,2})\s+(\w+)/);
  if (match) {
    return match[1].padStart(2, '0');
  }
  return '01';
}

function parseStoryFile(content) {
  const lines = content.trim().split('\n');
  let title = '';
  let story = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('## ')) {
      title = line.replace('## ', '').trim();
    } else if (line.startsWith('# ')) {
      title = line.replace('# ', '').trim();
    } else if (line && !title) {
      title = line;
    } else if (line) {
      story += (story ? '\n' : '') + line;
    }
  }
  
  return { title: title || 'Untitled Memory', story: story.trim() };
}

function getImages(dateDir) {
  const files = fs.readdirSync(dateDir);
  return files.filter(f => 
    /\.(jpg|jpeg|png)$/i.test(f) && !f.startsWith('.')
  ).map(f => `memories/${path.basename(path.dirname(dateDir))}/${path.basename(dateDir)}/${f}`);
}

const memories = [];

const monthFolders = fs.readdirSync(RESOURCES_DIR).filter(f => 
  fs.statSync(path.join(RESOURCES_DIR, f)).isDirectory()
);

for (const monthFolder of monthFolders) {
  const monthDir = path.join(RESOURCES_DIR, monthFolder);
  const { month, year } = parseMonthFolderName(monthFolder);
  
  const dateFolders = fs.readdirSync(monthDir).filter(f => 
    fs.statSync(path.join(monthDir, f)).isDirectory() && !f.startsWith('.')
  );
  
  for (const dateFolder of dateFolders) {
    const dateDir = path.join(monthDir, dateFolder);
    const date = parseDateFolderName(dateFolder);
    
    const txtFiles = fs.readdirSync(dateDir).filter(f => f.endsWith('.txt'));
    
    if (txtFiles.length > 0) {
      const txtPath = path.join(dateDir, txtFiles[0]);
      const content = fs.readFileSync(txtPath, 'utf-8');
      const { title, story } = parseStoryFile(content);
      const images = getImages(dateDir);
      
      memories.push({
        id: `${month.toLowerCase()}-${year}-${date}`,
        month,
        year,
        date,
        title,
        story,
        images
      });
    }
  }
}

memories.sort((a, b) => {
  if (a.year !== b.year) return a.year - b.year;
  const monthOrder = Object.values(MONTH_MAP);
  return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month) || a.date - b.date;
});

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ memories }, null, 2));

console.log(`✅ Generated ${memories.length} memories`);
console.log(`📁 Output: ${OUTPUT_FILE}`);