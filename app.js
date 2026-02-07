// Northway Fleet Operations Platform - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initCollapsibleSections();
    initNavigation();
    initTooltips();
    initRightSidebarInteractions();
    showActivityContent();
});

// ========================
// SIDEBAR COLLAPSE
// ========================
function toggleSidebar() {
    const container = document.querySelector('.app-container');
    container.classList.toggle('sidebar-collapsed');
}

// ========================
// RIGHT SIDEBAR INTERACTIONS
// ========================
function initRightSidebarInteractions() {
    // Company Info 3-dot menu
    const companyMenuBtn = document.querySelector('.panel-section .section-menu-btn');
    if (companyMenuBtn) {
        companyMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showDropdown(this, [
                { label: 'Company Profile', icon: 'building', action: () => showNotification('Opening company profile...', 'info') },
                { label: 'Edit Info', icon: 'edit', action: () => showNotification('Edit mode enabled', 'info') }
            ]);
        });
    }

    // Assignee items - hover menu
    initAssigneeHoverMenus();

    // Custom field + button
    const addCustomFieldBtn = document.getElementById('add-custom-field-btn');
    if (addCustomFieldBtn) {
        addCustomFieldBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showAddCustomFieldModal();
        });
    }

    // Shared Files interactions
    initSharedFilesInteractions();
}

function initSharedFilesInteractions() {
    // File menu buttons
    document.querySelectorAll('.file-menu-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const fileItem = this.closest('.file-item');
            const fileName = fileItem.querySelector('span').textContent;

            showDropdown(this, [
                { 
                    label: 'View', 
                    icon: 'show', 
                    action: () => openPdfModal(fileName) 
                },
                { 
                    label: 'Delete', 
                    icon: 'delete', 
                    danger: true, 
                    action: () => {
                        if(confirm(`Are you sure you want to delete "${fileName}"?`)) {
                            fileItem.remove();
                            showNotification('File deleted successfully', 'success');
                        }
                    } 
                }
            ]);
        });
    });

    // PDF Modal Close
    const modal = document.getElementById('pdf-modal');
    if (modal) {
        modal.querySelector('.close-modal-btn').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.opacity = '0';
                setTimeout(() => modal.style.display = 'none', 200);
            }, 10);
        });

        // Close on click outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                modal.style.opacity = '0';
                setTimeout(() => modal.style.display = 'none', 200);
            }
        });
    }
}

function openPdfModal(fileName) {
    const modal = document.getElementById('pdf-modal');
    const title = document.getElementById('pdf-modal-title');
    const placeholder = modal.querySelector('.pdf-placeholder p');
    
    if (modal && title) {
        title.textContent = fileName;
        // In a real app, you'd set the iframe src here based on the file
        // document.getElementById('pdf-frame').src = ...
        placeholder.textContent = `Preview of "${fileName}" not available in this demo.`;
        
        modal.style.display = 'flex';
        // Force reflow
        void modal.offsetWidth; 
        modal.style.opacity = '1';
        modal.classList.add('active');
    }
}

function initAssigneeHoverMenus() {
    const assigneeItems = document.querySelectorAll('#assignee-section .assignee-item');
    assigneeItems.forEach(item => {
        // Only add menu button if not already present
        if (!item.querySelector('.assignee-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'assignee-menu-btn';
            menuBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                </svg>
            `;
            menuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const name = item.querySelector('.assignee-name').textContent;
                showDropdown(this, [
                    { label: 'Show Profile', icon: 'user', action: () => showNotification(`Viewing ${name}'s profile`, 'info') },
                    { label: 'Unassign', icon: 'remove', danger: true, action: () => { item.remove(); showNotification(`${name} unassigned`, 'success'); } }
                ]);
            });
            item.appendChild(menuBtn);
        }
    });
}

function showDropdown(anchor, items) {
    // Remove any existing dropdowns
    document.querySelectorAll('.context-dropdown').forEach(d => d.remove());

    const menu = document.createElement('div');
    menu.className = 'context-dropdown';
    items.forEach(item => {
        if (item.divider) {
            const div = document.createElement('div');
            div.className = 'dropdown-divider';
            menu.appendChild(div);
            return;
        }
        const btn = document.createElement('button');
        btn.className = 'dropdown-item' + (item.danger ? ' danger' : '');
        btn.textContent = item.label;
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.remove();
            if (item.action) item.action();
        });
        menu.appendChild(btn);
    });

    anchor.style.position = 'relative';
    anchor.appendChild(menu);

    setTimeout(() => {
        document.addEventListener('click', function closeDropdown() {
            menu.remove();
            document.removeEventListener('click', closeDropdown);
        });
    }, 0);
}

function showAddCustomFieldModal() {
    showModal('Add Custom Field', `
        <div class="custom-field-form">
            <div class="form-group">
                <label>Field Name</label>
                <input type="text" placeholder="e.g. Industry, Region..." class="form-input" id="custom-field-name">
            </div>
            <div class="form-group">
                <label>Field Type</label>
                <select class="form-input" id="custom-field-type">
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="select">Dropdown</option>
                </select>
            </div>
            <div class="form-group">
                <label>Value</label>
                <input type="text" placeholder="Enter value..." class="form-input" id="custom-field-value">
            </div>
            <div class="form-actions">
                <button class="action-btn ghost" onclick="closeModal()">Cancel</button>
                <button class="action-btn primary" onclick="confirmAddCustomField()">Add Field</button>
            </div>
        </div>
    `);
}

function confirmAddCustomField() {
    const name = document.getElementById('custom-field-name').value.trim();
    const value = document.getElementById('custom-field-value').value.trim();

    if (!name) {
        showNotification('Please enter a field name', 'error');
        return;
    }

    const fieldsList = document.getElementById('custom-fields-section');
    const row = document.createElement('div');
    row.className = 'info-row';
    row.innerHTML = `
        <span class="info-label">${name}</span>
        <span class="info-value">${value || '—'}</span>
    `;
    fieldsList.appendChild(row);

    closeModal();
    showNotification(`Custom field "${name}" added`, 'success');
}

// ========================
// TAB FUNCTIONALITY
// ========================
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const activityFeed = document.getElementById('activity-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Handle tab content switching
            const tabName = this.dataset.tab;
            handleTabSwitch(tabName);
            
            // Add ripple effect
            createRipple(this, event);
        });
    });
}

function handleTabSwitch(tabName) {
    const activityFeed = document.querySelector('.activity-feed');
    
    // Fade out current content
    activityFeed.style.opacity = '0';

    setTimeout(() => {
        // Update content based on tab
        switch(tabName) {
            case 'activity':
                showActivityContent();
                break;
            case 'files':
                showFilesContent();
                break;
            case 'reminders':
                showRemindersContent();
                break;
            case 'ai-insights':
                showAIInsightsContent();
                break;
        }

        // Fade in new content
        activityFeed.style.opacity = '1';
    }, 200);
}

function showActivityContent() {
    // Reset to default activity content
    const activityFeed = document.querySelector('.activity-feed');
    activityFeed.innerHTML = getActivityHTML();
    initCardInteractions();
}

function showFilesContent() {
    const activityFeed = document.querySelector('.activity-feed');
    activityFeed.innerHTML = `
        <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <h3>Files</h3>
            <p>All shared files for this deal will appear here.</p>
            <button class="action-btn primary" onclick="showUploadModal()">Upload File</button>
        </div>
    `;
}

function showRemindersContent() {
    const activityFeed = document.querySelector('.activity-feed');
    activityFeed.innerHTML = `
        <div class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3>Reminders</h3>
            <p>Set reminders for follow-ups and important dates.</p>
            <button class="action-btn primary" onclick="showReminderModal()">Add Reminder</button>
        </div>
    `;
}

function showAIInsightsContent() {
    const activityFeed = document.querySelector('.activity-feed');
    activityFeed.innerHTML = `
        <div class="ai-insights-container">
            <div class="ai-insight-card">
                <div class="ai-header">
                    <div class="ai-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                        </svg>
                    </div>
                    <span class="ai-label">AI Analysis</span>
                </div>
                <h3>Deal Health Score: 72%</h3>
                <p>Based on recent activity patterns, this deal has a moderate-to-high probability of closing. Key factors include stakeholder engagement and consistent communication.</p>
                <div class="insight-metrics">
                    <div class="metric">
                        <span class="metric-value">8</span>
                        <span class="metric-label">Touchpoints</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">3</span>
                        <span class="metric-label">Stakeholders</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">12</span>
                        <span class="metric-label">Days Active</span>
                    </div>
                </div>
            </div>
            
            <div class="ai-recommendations">
                <h4>Recommended Actions</h4>
                <div class="recommendation-item">
                    <div class="rec-icon success">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20,6 9,17 4,12"/>
                        </svg>
                    </div>
                    <div class="rec-content">
                        <span class="rec-title">Send ROI documentation</span>
                        <span class="rec-desc">CFO has requested financial justification</span>
                    </div>
                    <span class="rec-impact">High Impact</span>
                </div>
                <div class="recommendation-item">
                    <div class="rec-icon warning">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                    </div>
                    <div class="rec-content">
                        <span class="rec-title">Address competitor concerns</span>
                        <span class="rec-desc">LogixFlow was mentioned in recent call</span>
                    </div>
                    <span class="rec-impact">Medium Impact</span>
                </div>
            </div>
        </div>
    `;
}

function getActivityHTML() {
    return `
        <!-- Activity Feed (Timeline) -->
        <div class="timeline-feed">
            <!-- Activity Item 1 -->
            <div class="timeline-item">
                <div class="timeline-track">
                    <div class="timeline-line"></div>
                    <div class="timeline-icon warning">
                        <img src="assets/icons/Notification%202%20-%20Iconly%20Pro.svg" alt="Warning">
                    </div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="timeline-title">CFO Blocking Q1 Budget</h3>
                        <div class="timeline-meta">
                            <div class="assignee">
                                <img src="assets/img/Ellipse 32.png" alt="Sobhan">
                                <span>Sobhan Rabbani</span>
                            </div>
                            <span class="time-ago">1 hour ago</span>
                            <span class="due-badge orange">
                                <img src="assets/icons/Calendar%20-%20Iconly%20Pro.svg" alt="Due">
                                Due: Feb 18
                            </span>
                        </div>
                        <button class="menu-btn">
                            <img src="assets/icons/menu.svg" alt="Menu">
                        </button>
                    </div>
                    <div class="timeline-body">
                        <p class="ai-summary-text">
                            AI detected recurring dispatcher overload during peak hours across multiple data sources. Manual route reassignment and lack of alert prioritization identified as key bottlenecks.
                        </p>
                        <div class="timeline-footer">
                            <div class="tags">
                                <span class="tag risk">Deal at risk</span>
                                <span class="tag purple">Needs ROI proof by Friday</span>
                            </div>
                            <div class="actions">
                                <button class="action-btn ghost">Schedule Call</button>
                                <button class="action-btn primary black">Send ROI</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activity Item 2 -->
            <div class="timeline-item">
                <div class="timeline-track">
                    <div class="timeline-line"></div>
                    <div class="timeline-icon sparkle">
                        <img src="assets/icons/Stars%20-%20Iconly%20Pro.svg" alt="AI">
                    </div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="timeline-title">Share TechCorp Case Study</h3>
                        <span class="match-badge">89% match</span>
                        <div class="timeline-meta">
                            <span class="time-ago">3 hours ago</span>
                            <span class="match-badge extra">
                                <img src="assets/icons/User%20-%20Iconly%20Pro.svg" alt="Match">
                                89% match
                            </span>
                        </div>
                        <button class="menu-btn">
                            <img src="assets/icons/menu.svg" alt="Menu">
                        </button>
                    </div>
                    <div class="timeline-body">
                        <p class="ai-summary-text">
                            AI detected recurring dispatcher overload during peak hours across multiple data sources. Manual route reassignment and lack of alert prioritization identified as key bottlenecks.
                        </p>
                        <div class="timeline-footer">
                            <div class="tags">
                                <span class="tag black">AI Recommended</span>
                                <span class="tag green">High Impact</span>
                            </div>
                            <div class="actions">
                                <button class="action-btn ghost">View Case Study</button>
                                <button class="action-btn primary black">Email To David</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Activity Item 3 -->
            <div class="timeline-item">
                <div class="timeline-track">
                    <div class="timeline-line"></div>
                    <div class="timeline-icon phone">
                        <img src="assets/icons/Phone%20Call%20Ringing%20-%20Iconly%20Pro.svg" alt="Competitor">
                    </div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="timeline-title">Competitor Mentioned: LogixFlow</h3>
                        <div class="timeline-meta">
                            <div class="assignee">
                                <img src="assets/img/Ellipse 32-1.png" alt="Sarah">
                                <span>Sarah Sanders (Ops Dir)</span>
                            </div>
                            <span class="time-ago">4 hours ago</span>
                        </div>
                        <button class="menu-btn">
                            <img src="assets/icons/menu.svg" alt="Menu">
                        </button>
                    </div>
                    <div class="timeline-body">
                        <p class="ai-summary-text">
                            AI detected recurring dispatcher overload during peak hours across multiple data sources. Manual route reassignment and lack of alert prioritization identified as key bottlenecks.
                        </p>
                        <div class="timeline-footer">
                            <div class="tags">
                                <span class="tag red-badge">2-week setup vs our 8 weeks</span>
                            </div>
                            <div class="actions">
                                <button class="action-btn ghost">LogixFlow</button>
                                <button class="action-btn primary black">Request Intro</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- End of Activity -->
            <div class="timeline-end">
                <div class="timeline-track">
                    <div class="timeline-icon end">
                        <img src="assets/icons/Heart%20rate%20-%20Iconly%20Pro.svg" alt="End">
                    </div>
                </div>
                <span class="end-text">End of activity, Feb 7, 2026</span>
            </div>
        </div>
    `;
}

// ========================
// COLLAPSIBLE SECTIONS
// ========================
function initCollapsibleSections() {
    // Assignee + button
    const assigneeHeader = document.querySelector('.section-header[data-section="assignee"]');
    if (assigneeHeader) {
        const addBtn = assigneeHeader.querySelector('.expand-btn');
        if (addBtn) {
            addBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showAddAssigneeModal();
            });
        }
    }

    // Shared Files + button
    const filesHeader = document.querySelector('.section-header[data-section="files"]');
    if (filesHeader) {
        const addBtn = filesHeader.querySelector('.expand-btn');
        if (addBtn) {
            addBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                showAddFileModal();
            });
        }
    }
}

function showAddAssigneeModal() {
    showModal('Add Assignee', `
        <div class="assignee-form">
            <div class="form-group">
                <label>Name</label>
                <input type="text" placeholder="Enter name..." class="form-input">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" placeholder="Enter email..." class="form-input">
            </div>
            <div class="form-group">
                <label>Role</label>
                <select class="form-input">
                    <option>Project Manager</option>
                    <option>Director</option>
                    <option>Account Executive</option>
                    <option>Sales Engineer</option>
                </select>
            </div>
            <div class="form-actions">
                <button class="action-btn ghost" onclick="closeModal()">Cancel</button>
                <button class="action-btn primary" onclick="confirmAddAssignee()">Add Assignee</button>
            </div>
        </div>
    `);
}

function showAddFileModal() {
    showModal('Add Shared File', `
        <div class="upload-form">
            <div class="form-group">
                <label>File Name</label>
                <input type="text" placeholder="Enter file name..." class="form-input">
            </div>
            <div class="drop-zone">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17,8 12,3 7,8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p>Drag and drop files here, or click to browse</p>
            </div>
            <div class="form-actions">
                <button class="action-btn ghost" onclick="closeModal()">Cancel</button>
                <button class="action-btn primary" onclick="confirmAddFile()">Upload File</button>
            </div>
        </div>
    `);
}

function confirmAddAssignee() {
    const modal = document.querySelector('.modal-content');
    const name = modal.querySelector('input[type="text"]').value.trim();
    const role = modal.querySelector('select').value;

    if (!name) {
        showNotification('Please enter a name', 'error');
        return;
    }

    const assigneeList = document.getElementById('assignee-section');
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const item = document.createElement('div');
    item.className = 'assignee-item';
    item.innerHTML = `
        <div class="assignee-avatar-placeholder">${initials}</div>
        <div class="assignee-info">
            <span class="assignee-name">${name}</span>
            <span class="assignee-role">${role}</span>
        </div>
    `;
    assigneeList.appendChild(item);

    closeModal();
    showNotification(`${name} added as ${role}`, 'success');
}

function confirmAddFile() {
    const modal = document.querySelector('.modal-content');
    const fileName = modal.querySelector('input[type="text"]').value.trim();

    if (!fileName) {
        showNotification('Please enter a file name', 'error');
        return;
    }

    const filesList = document.getElementById('files-section');
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:0.6;flex-shrink:0">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
        </svg>
        <span>${fileName}</span>
        <button class="file-menu-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
        </button>
    `;
    filesList.appendChild(item);

    closeModal();
    showNotification(`"${fileName}" added to shared files`, 'success');
}

// ========================
// NAVIGATION
// ========================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items across both navs
            document.querySelectorAll('.main-nav .nav-item, .org-nav .nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
    
    // Create Task Button
    const createTaskBtn = document.querySelector('.create-task-btn');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', function() {
            showModal('Create New Task', `
                <form class="task-form">
                    <div class="form-group">
                        <label>Task Title</label>
                        <input type="text" placeholder="Enter task title..." class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Due Date</label>
                        <input type="date" class="form-input">
                    </div>
                    <div class="form-group">
                        <label>Assignee</label>
                        <select class="form-input">
                            <option>Sobhan Rabbani</option>
                            <option>Sarah Sanders</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-input" rows="3" placeholder="Enter task description..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="action-btn ghost" onclick="closeModal()">Cancel</button>
                        <button type="submit" class="action-btn primary">Create Task</button>
                    </div>
                </form>
            `);
        });
    }
}

// ========================
// CARD INTERACTIONS
// ========================
function initCardInteractions() {
    // Card menu buttons
    const menuButtons = document.querySelectorAll('.card-menu-btn');
    menuButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            showCardMenu(this);
        });
    });
    
    // Card hover effects handled via CSS
}

function showCardMenu(button) {
    // Remove existing menus
    const existingMenu = document.querySelector('.card-dropdown-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    const menu = document.createElement('div');
    menu.className = 'card-dropdown-menu';
    menu.innerHTML = `
        <button class="dropdown-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
        </button>
        <button class="dropdown-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Duplicate
        </button>
        <button class="dropdown-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Share
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item danger">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete
        </button>
    `;
    
    button.parentElement.appendChild(menu);
    
    // Position the menu
    const rect = button.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = '100%';
    menu.style.right = '0';
    menu.style.marginTop = '4px';
    
    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 0);
}

// ========================
// TOOLTIPS
// ========================
function initTooltips() {
    const elements = document.querySelectorAll('[data-tooltip]');
    elements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        });
        
        el.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
        });
    });
}

// ========================
// MODAL SYSTEM
// ========================
function showModal(title, content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="modal-content">${content}</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add animation
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeModal() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 200);
    }
}

// ========================
// NOTIFICATION SYSTEM
// ========================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================
// ACTION HANDLERS
// ========================
function handleScheduleCall() {
    showModal('Schedule Call', `
        <div class="schedule-form">
            <div class="form-group">
                <label>With</label>
                <input type="text" value="Julian Park (CEO)" class="form-input" readonly>
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" class="form-input">
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" class="form-input">
            </div>
            <div class="form-group">
                <label>Agenda</label>
                <textarea class="form-input" rows="3" placeholder="What would you like to discuss?"></textarea>
            </div>
            <div class="form-actions">
                <button class="action-btn ghost" onclick="closeModal()">Cancel</button>
                <button class="action-btn primary" onclick="confirmSchedule()">Schedule</button>
            </div>
        </div>
    `);
}

function handleSendROI() {
    showNotification('Opening ROI document composer...', 'success');
    setTimeout(() => {
        showModal('Send ROI Documentation', `
            <div class="roi-form">
                <div class="form-group">
                    <label>Recipient</label>
                    <input type="text" value="Julian Park (CFO)" class="form-input">
                </div>
                <div class="form-group">
                    <label>Subject</label>
                    <input type="text" value="ROI Analysis - Northway Fleet Operations" class="form-input">
                </div>
                <div class="form-group">
                    <label>Attachments</label>
                    <div class="file-attachment">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14,2 14,8 20,8"/>
                        </svg>
                        <span>ROI_Analysis_Q1_2026.pdf</span>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="action-btn ghost" onclick="closeModal()">Cancel</button>
                    <button class="action-btn primary" onclick="confirmSendROI()">Send Email</button>
                </div>
            </div>
        `);
    }, 500);
}

function handleViewCaseStudy() {
    showNotification('Opening TechCorp Case Study...', 'info');
}

function handleEmailDavid() {
    showModal('Email to David', `
        <div class="email-form">
            <div class="form-group">
                <label>To</label>
                <input type="email" value="david@techcorp.com" class="form-input">
            </div>
            <div class="form-group">
                <label>Subject</label>
                <input type="text" value="TechCorp Case Study - Fleet Operations Success Story" class="form-input">
            </div>
            <div class="form-group">
                <label>Message</label>
                <textarea class="form-input" rows="5">Hi David,

I wanted to share our TechCorp case study with you. Similar to Northway, they saw an 89% improvement in dispatcher efficiency.

Would you have time this week to discuss how we achieved similar results for them?

Best regards</textarea>
            </div>
            <div class="form-actions">
                <button class="action-btn ghost" onclick="closeModal()">Cancel</button>
                <button class="action-btn primary">Send Email</button>
            </div>
        </div>
    `);
}

function handleLogixFlow() {
    showModal('Competitor Analysis: LogixFlow', `
        <div class="competitor-info">
            <h4>LogixFlow Overview</h4>
            <div class="competitor-stats">
                <div class="stat">
                    <span class="stat-label">Setup Time</span>
                    <span class="stat-value">2 weeks</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Our Setup Time</span>
                    <span class="stat-value">8 weeks</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Key Differentiator</span>
                    <span class="stat-value">Enterprise Support</span>
                </div>
            </div>
            <h4>Talking Points</h4>
            <ul>
                <li>Our longer setup includes full customization</li>
                <li>24/7 enterprise support vs their business hours only</li>
                <li>99.9% uptime SLA vs their 99.5%</li>
            </ul>
            <div class="form-actions">
                <button class="action-btn ghost" onclick="closeModal()">Close</button>
                <button class="action-btn primary">Download Battle Card</button>
            </div>
        </div>
    `);
}

function handleRequestIntro() {
    showNotification('Requesting introduction to operations team...', 'success');
}

function confirmSchedule() {
    closeModal();
    showNotification('Call scheduled successfully!', 'success');
}

function confirmSendROI() {
    closeModal();
    showNotification('ROI documentation sent to Julian Park', 'success');
}

// ========================
// RIPPLE EFFECT
// ========================
function createRipple(element, event) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - element.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - element.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = element.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }
    
    element.appendChild(circle);
    
    setTimeout(() => circle.remove(), 600);
}

// ========================
// UTILITY FUNCTIONS
// ========================
function showUploadModal() {
    showModal('Upload File', `
        <div class="upload-form">
            <div class="drop-zone">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17,8 12,3 7,8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p>Drag and drop files here, or click to browse</p>
            </div>
            <div class="form-actions">
                <button class="action-btn ghost" onclick="closeModal()">Cancel</button>
                <button class="action-btn primary">Upload</button>
            </div>
        </div>
    `);
}

function showReminderModal() {
    showModal('Add Reminder', `
        <div class="reminder-form">
            <div class="form-group">
                <label>Title</label>
                <input type="text" placeholder="Reminder title..." class="form-input">
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" class="form-input">
            </div>
            <div class="form-group">
                <label>Time</label>
                <input type="time" class="form-input">
            </div>
            <div class="form-actions">
                <button class="action-btn ghost" onclick="closeModal()">Cancel</button>
                <button class="action-btn primary">Set Reminder</button>
            </div>
        </div>
    `);
}
