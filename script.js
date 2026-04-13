// Enhanced Forum Logic with Author Names
let posts = JSON.parse(localStorage.getItem('forum_posts')) || [
    { 
        id: 1, 
        author: '김철수',
        title: '삼성전자 반도체 설비 엔지니어링 질문', 
        content: 'PLC 제어에서 외란 대응 로직을 구현할 때 주로 어떤 방식을 사용하시나요?',
        replies: [
            { id: 101, content: '피드백 제어와 함께 전향 제어(Feed-forward)를 결합하면 외란 대응 능력이 대폭 향상됩니다!' }
        ]
    }
];

let editingId = null;

function renderPosts() {
    const list = document.getElementById('board-list');
    if (!list) return;
    list.innerHTML = '';
    
    posts.forEach(post => {
        const item = document.createElement('div');
        item.className = 'post-item';
        
        const isEditing = editingId === post.id;
        
        item.innerHTML = `
            <div class="post-main">
                <div class="post-content" style="width: 100%;">
                    <div class="post-author-tag" style="font-size: 0.8rem; color: var(--samsung-blue); font-weight: 700; margin-bottom: 5px;">
                        BY. ${post.author || '익명 방문자'}
                    </div>
                    ${isEditing ? `
                        <input type="text" id="edit-title-${post.id}" class="edit-mode-input" value="${post.title}" style="background: rgba(255,255,255,0.1); border: 1px solid var(--samsung-blue); padding: 5px; color: white; margin-bottom: 10px;">
                        <textarea id="edit-content-${post.id}" class="edit-mode-input" style="background: rgba(255,255,255,0.1); border: 1px solid var(--samsung-blue); padding: 5px; color: white; width: 100%;">${post.content}</textarea>
                    ` : `
                        <h5 style="font-size: 1.25rem;">${post.title}</h5>
                        <p style="margin-top: 5px; color: var(--text-sub);">${post.content}</p>
                    `}
                </div>
                <div class="post-actions">
                    ${isEditing ? `
                        <button onclick="updatePost(${post.id})">저장</button>
                        <button onclick="cancelEdit()">취소</button>
                    ` : `
                        <button onclick="editPost(${post.id})">수정</button>
                        <button onclick="deletePost(${post.id})">제거</button>
                    `}
                </div>
            </div>
            
            <div class="reply-container">
                <div class="replies-list" id="replies-list-${post.id}">
                    ${(post.replies || []).map(reply => `
                        <div class="reply-item">
                            <span style="color: var(--samsung-blue); font-weight: 600;">Admin Res:</span> ${reply.content}
                        </div>
                    `).join('')}
                </div>
                <div class="reply-input-group">
                    <input type="text" id="reply-input-${post.id}" placeholder="답글이나 소통 내용을 남겨주세요...">
                    <button class="btn-primary" style="padding: 5px 15px; font-size: 0.8rem;" onclick="addReply(${post.id})">답글</button>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

function addPost() {
    const authorInput = document.getElementById('post-author');
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    
    if (!authorInput.value || !titleInput.value || !contentInput.value) {
        alert('모든 필드(이름, 제목, 내용)를 입력해주세요.');
        return;
    }
    
    const newPost = {
        id: Date.now(),
        author: authorInput.value,
        title: titleInput.value,
        content: contentInput.value,
        replies: []
    };
    
    posts.unshift(newPost);
    saveAndRender();
    
    authorInput.value = '';
    titleInput.value = '';
    contentInput.value = '';
}

function editPost(id) {
    editingId = id;
    renderPosts();
}

function cancelEdit() {
    editingId = null;
    renderPosts();
}

function updatePost(id) {
    const title = document.getElementById(`edit-title-${id}`).value;
    const content = document.getElementById(`edit-content-${id}`).value;
    
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts[index].title = title;
        posts[index].content = content;
        editingId = null;
        saveAndRender();
    }
}

function deletePost(id) {
    if (confirm('게시글을 삭제하시겠습니까?')) {
        posts = posts.filter(post => post.id !== id);
        saveAndRender();
    }
}

function addReply(postId) {
    const input = document.getElementById(`reply-input-${postId}`);
    if (!input.value) return;
    
    const index = posts.findIndex(p => p.id === postId);
    if (index !== -1) {
        if (!posts[index].replies) posts[index].replies = [];
        posts[index].replies.push({
            id: Date.now(),
            content: input.value
        });
        input.value = '';
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('forum_posts', JSON.stringify(posts));
    renderPosts();
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
});
