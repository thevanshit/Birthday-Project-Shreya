const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'public', 'memories');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'memories.json');

const MONTH_MAP = {
  'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April',
  'May': 'May', 'Jun': 'June', 'Jul': 'July', 'Aug': 'August',
  'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
};

const SORT_ORDER = [
  'August 2025',
  'November 2025',
  'December 2025',
  'January 2026',
  'February 2026',
  'March 2026',
  'April 2026'
];

function parseFolderName(folderName) {
  const monthMatch = folderName.match(/\s+(\w+)\s+\d{4}/);
  const monthAbbr = monthMatch ? monthMatch[1] : '';
  const month = MONTH_MAP[monthAbbr] || monthAbbr || 'Unknown';
  
  const yearMatch = folderName.match(/\d{4}/);
  const year = yearMatch ? yearMatch[0] : 'Unknown';
  
  const monthYear = `${month} ${year}`;
  
  return { month, year, monthYear };
}

function parseStoryFile(content) {
  const lines = content.trim().split('\n');
  let title = '';
  let story = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      title = trimmed.replace('## ', '').trim();
    } else if (trimmed.startsWith('# ')) {
      title = trimmed.replace('# ', '').trim();
    } else if (trimmed && !title) {
      title = trimmed;
    } else if (trimmed) {
      story += (story ? '\n' : '') + trimmed;
    }
  }
  
  return { title: title || 'Untitled Memory', story: story.trim() };
}

const memories = [];

const folders = fs.readdirSync(BASE_DIR).filter(f => 
  fs.statSync(path.join(BASE_DIR, f)).isDirectory() && !f.startsWith('.')
);

for (const folder of folders) {
  const folderPath = path.join(BASE_DIR, folder);
  const { month, year, monthYear } = parseFolderName(folder);
  
  const files = fs.readdirSync(folderPath);
  
  const txtFile = files.find(f => f.endsWith('.txt'));
  if (!txtFile) continue;
  
  const txtPath = path.join(folderPath, txtFile);
  const content = fs.readFileSync(txtPath, 'utf-8');
  const { title, story } = parseStoryFile(content);
  
  const images = files
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => `/memories/${folder}/${f}`);
  
  const dateMatch = folder.match(/(\d+)\s+\w+/);
  const date = dateMatch ? dateMatch[1] : '01';
  
  memories.push({
    id: folder,
    month,
    year,
    monthYear,
    date,
    title,
    story,
    images
  });
}

memories.sort((a, b) => {
  const aIndex = SORT_ORDER.indexOf(a.monthYear);
  const bIndex = SORT_ORDER.indexOf(b.monthYear);
  if (aIndex !== bIndex) return aIndex - bIndex;
  return a.date - b.date;
});

const grouped = {};
memories.forEach(m => {
  if (!grouped[m.monthYear]) grouped[m.monthYear] = [];
  grouped[m.monthYear].push(m);
});

const sortedGrouped = SORT_ORDER.filter(month => grouped[month])
  .map(month => ({
    monthYear: month,
    memories: grouped[month]
  }));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ 
  memories,
  grouped: sortedGrouped
}, null, 2));

console.log(`Generated ${memories.length} memories`);
console.log(`Output: ${OUTPUT_FILE}`);