const monthOrder = [
  'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025',
  'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026'
];

const monthToDate = {
  'Aug 2025': '2025-08',
  'Sep 2025': '2025-09',
  'Oct 2025': '2025-10',
  'Nov 2025': '2025-11',
  'Dec 2025': '2025-12',
  'Jan 2026': '2026-01',
  'Feb 2026': '2026-02',
  'Mar 2026': '2026-03',
  'Apr 2026': '2026-04',
};

function parseDateFolderName(folderName) {
  const match = folderName.match(/(\d{1,2})\s+(Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr)\s+(\d{4})/);
  if (!match) return null;
  
  const day = match[1].padStart(2, '0');
  const monthName = match[2];
  const year = match[3];
  
  const monthKey = Object.keys(monthToDate).find(k => k.startsWith(monthName) && k.includes(year));
  if (!monthKey) return null;
  
  return `${monthToDate[monthKey]}-${day}`;
}

function parseTxtFile(content) {
  const lines = content.trim().split('\n');
  let title = '';
  let story = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (i === 0 && line.startsWith('## ')) {
      title = line.replace('## ', '').trim();
    } else if (title && line) {
      story += (story ? '\n' : '') + line;
    } else if (!title && line) {
      title = line;
    }
  }
  
  return { title, story: story.trim() };
}

function sortByDate(a, b) {
  return new Date(a.date) - new Date(b.date);
}

const txtFiles = import.meta.glob('/src/data/memories/**/*txt', { query: '?raw', import: 'default', eager: true });
const jpgFiles = import.meta.glob('/src/data/memories/**/*.{jpg,jpeg}', { eager: true });
const pngFiles = import.meta.glob('/src/data/memories/**/*png', { eager: true });
const gifFiles = import.meta.glob('/src/data/memories/**/*gif', { eager: true });
const webpFiles = import.meta.glob('/src/data/memories/**/*webp', { eager: true });
const heicFiles = import.meta.glob('/src/data/memories/**/*.{heic,heif}', { eager: true });

console.log('txtFiles keys:', Object.keys(txtFiles));

function getAllImageFiles() {
  const allFiles = {};
  for (const files of [jpgFiles, pngFiles, gifFiles, webpFiles, heicFiles]) {
    Object.assign(allFiles, files);
  }
  console.log('imageFiles keys:', Object.keys(allFiles));
  return allFiles;
}

export async function loadMemories() {
  const memories = [];
  
  const folderToImages = {};
  const folderToTxt = {};
  
  for (const path of Object.keys(txtFiles)) {
    const match = path.match(/src\/data\/memories\/([^/]+)\/([^/]+)\/[^/]+\.txt$/);
    console.log('txt path:', path, 'match:', match);
    if (!match) continue;
    
    const month = match[1];
    const dateFolder = match[2];
    const folderKey = `${month}/${dateFolder}`;
    
    folderToTxt[folderKey] = { path, content: txtFiles[path] };
  }
  
  const imageFiles = getAllImageFiles();
  for (const path of Object.keys(imageFiles)) {
    const match = path.match(/src\/data\/memories\/([^/]+)\/([^/]+)\/[^/]+$/);
    if (!match) continue;
    
    const month = match[1];
    const dateFolder = match[2];
    const folderKey = `${month}/${dateFolder}`;
    
    if (!folderToImages[folderKey]) {
      folderToImages[folderKey] = [];
    }
    folderToImages[folderKey].push(path);
  }
  
  console.log('folderToTxt:', folderToTxt);
  console.log('folderToImages:', folderToImages);
  
  for (const folderKey of Object.keys(folderToTxt)) {
    const txtData = folderToTxt[folderKey];
    const dateStr = parseDateFolderName(folderKey.split('/')[1]);
    
    if (!dateStr) continue;
    
    const { title, story } = parseTxtFile(txtData.content);
    
    const images = (folderToImages[folderKey] || []).map((src, index) => ({
      id: `${dateStr}-${index}`,
      src,
      type: 'image'
    }));
    
    if (title || images.length > 0) {
      memories.push({
        id: dateStr,
        date: dateStr,
        title: title || 'Untitled',
        story: story || '',
        media: images
      });
    }
  }
  
  console.log('memories:', memories);
  return memories.sort(sortByDate);
}

export default loadMemories;