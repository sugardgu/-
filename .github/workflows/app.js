let data = [];

// Load data
fetch('장데이터.json')
  .then(response => response.json())
  .then(json => {
    data = json;
    render(data);
  })
  .catch(error => {
    console.error("데이터 로드 실패:", error);
    document.getElementById('count').innerHTML = '<span style="color: #EF4444;">데이터를 불러오는데 실패했습니다.</span>';
  });

const q = document.getElementById('q');
const list = document.getElementById('list');
const count = document.getElementById('count');

// Search event listener with slight debounce
let timeout = null;
q.addEventListener('input', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    const kw = q.value.trim().toLowerCase();
    
    if (!kw) {
      render(data);
      return;
    }
    
    const filtered = data.filter(item => 
      item.본문.toLowerCase().includes(kw) || 
      item.제목.toLowerCase().includes(kw) ||
      item.장.toString().includes(kw)
    );
    
    render(filtered, kw);
  }, 150);
});

// Function to highlight text
function highlightText(text, keyword) {
  if (!keyword) return text;
  
  // Escape regex characters
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedKeyword})`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
}

function render(arr, keyword = '') {
  // Update count
  count.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color: ${arr.length > 0 ? '#10B981' : '#EF4444'}; margin-right:6px;"></span> 총 <strong>${arr.length}</strong>건의 결과`;
  
  if (arr.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3>검색 결과가 없습니다</h3>
        <p>다른 검색어를 입력해보세요.</p>
      </div>
    `;
    return;
  }

  // Render cards
  list.innerHTML = arr.map((item, index) => {
    const highlightedTitle = highlightText(item.제목, keyword);
    const highlightedBody = highlightText(item.본문, keyword);
    
    return `
      <div class="card" style="animation-delay: ${index * 0.05}s">
        <div class="card-header">
          <span class="badge">제 ${item.장}장</span>
          <h2 class="card-title">${highlightedTitle}</h2>
        </div>
        <div class="card-body">${highlightedBody}</div>
      </div>
    `;
  }).join('');
}
