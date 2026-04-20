// Enhanced Forum Logic with Author Names
let posts = JSON.parse(localStorage.getItem('forum_posts')) || [];

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
                        BY. ${post.author || '익명'} (${post.email || '이메일 없음'})
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
                    <input type="text" id="reply-input-${post.id}" placeholder="창시자의 답변이 이곳에 달립니다...">
                    <button class="btn-primary" style="padding: 5px 15px; font-size: 0.8rem;" onclick="addReply(${post.id})">창시자 답글</button>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

function addPost() {
    const authorInput = document.getElementById('post-author');
    const emailInput = document.getElementById('post-email');
    const titleInput = document.getElementById('post-title');
    const contentInput = document.getElementById('post-content');
    
    if (!authorInput.value || !emailInput.value || !titleInput.value || !contentInput.value) {
        alert('모든 필드(이름, 이메일, 제목, 내용)를 입력해주세요.');
        return;
    }
    
    const newPost = {
        id: Date.now(),
        author: authorInput.value,
        email: emailInput.value,
        title: titleInput.value,
        content: contentInput.value,
        replies: []
    };
    
    posts.unshift(newPost);
    saveAndRender();
    
    authorInput.value = '';
    emailInput.value = '';
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

// Section Switching Logic (SPA Style)
function switchSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo(0, 0);
        
        // Dynamic Header Transparency
        const header = document.querySelector('header');
        if (sectionId === 'home') {
            header.style.background = 'rgba(10, 10, 12, 0.8)';
        } else {
            header.style.background = 'rgba(10, 10, 12, 0.95)';
        }

        // Re-trigger AOS animations
        setTimeout(() => {
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        }, 100);
    }
}

// Initial Render and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();

    // Navigation Links Click Handler
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const sectionId = href.substring(1);
            switchSection(sectionId);
            
            // Update Active Link Style
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = 'var(--text-sub)';
            });
            if (this.parentElement.classList.contains('nav-links')) {
                this.style.color = 'var(--samsung-blue)';
            }
        });
    });

    // Handle initial hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        switchSection(initialHash);
    }
});
