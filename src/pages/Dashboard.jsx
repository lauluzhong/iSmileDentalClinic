import { useState, useEffect } from 'react';
import { Sparkles, Activity, CheckCircle, Clock, FileText, Users, ChevronRight } from 'lucide-react';

// Org Chart Data
const orgStructure = {
  head: {
    name: "Edith",
    role: "Head of Branding & Marketing",
    icon: "🤖",
    status: "online"
  },
  departments: [
    {
      name: "Website Team",
      icon: "🌐",
      subAgents: ["SEO Specialist", "Content Writer", "Developer"]
    },
    {
      name: "GBP Team", 
      icon: "📍",
      subAgents: ["Review Manager", "Local Citations"]
    },
    {
      name: "Social Team",
      icon: "📱",
      subAgents: ["Instagram Manager", "Facebook Manager"]
    },
    {
      name: "Analytics Team",
      icon: "📊",
      subAgents: ["GA4 Specialist", "Heatmap Analyst"]
    }
  ]
};

// Sample tasks - will be dynamic later
const sampleTasks = [
  { id: 1, text: "Add Google reviews widget to footer", status: "done", owner: "Edith" },
  { id: 2, text: "Enhance local business schema", status: "done", owner: "Edith" },
  { id: 3, text: "Merge PR #2 - SEO changes", status: "done", owner: "Lu Zhong" },
  { id: 4, text: "Set up analytics visibility (GA4/Clarity)", status: "in-progress", owner: "Lu Zhong" },
  { id: 5, text: "Add more photos to GBP", status: "todo", owner: "Lu Zhong" },
  { id: 6, text: "Answer Q&A on GBP", status: "todo", owner: "Lu Zhong" },
  { id: 7, text: "Audit Instagram profile", status: "todo", owner: "Edith" },
  { id: 8, text: "Audit Facebook profile", status: "todo", owner: "Edith" },
];

const files = [
  { name: "USER.md", desc: "Boss profile & context", icon: "📝" },
  { name: "LEARNING.md", desc: "Communication patterns", icon: "🧠" },
  { name: "IDENTITY.md", desc: "My persona & role", icon: "🦷" },
  { name: "AGENTS.md", desc: "Workspace rules", icon: "⚙️" },
  { name: "HEARTBEAT.md", desc: "Periodic tasks", icon: "🎯" },
  { name: "SOUL.md", desc: "My core values", icon: "💎" },
  { name: "TOOLS.md", desc: "Skills & tools", icon: "🔧" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Kuala_Lumpur'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      timeZone: 'Asia/Kuala_Lumpur'
    });
  };

  const completedTasks = sampleTasks.filter(t => t.status === 'done').length;
  const inProgressTasks = sampleTasks.filter(t => t.status === 'in-progress').length;
  const phase1Total = 8;
  const phase1Progress = Math.round((completedTasks / phase1Total) * 100);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">🦷</div>
          <div className="logo-text">
            iSmile <span>Mission Control</span>
          </div>
        </div>
        <div className="header-right">
          <div className="status-badge">
            <div className="status-dot"></div>
            Edith is Online
          </div>
          <div className="time-display">
            <span className="time">{formatTime(currentTime)}</span>
            <span className="date">{formatDate(currentTime)}</span>
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon"><Users size={20} /></div>
          <div className="stat-content">
            <div className="stat-label">Active Agents</div>
            <div className="stat-value primary">1</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Activity size={20} /></div>
          <div className="stat-content">
            <div className="stat-label">Tasks In Progress</div>
            <div className="stat-value warning">{inProgressTasks}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CheckCircle size={20} /></div>
          <div className="stat-content">
            <div className="stat-label">Phase 1 Progress</div>
            <div className="stat-value success">{phase1Progress}%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Sparkles size={20} /></div>
          <div className="stat-content">
            <div className="stat-label">Completed Tasks</div>
            <div className="stat-value accent">{completedTasks}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button 
          className={`tab ${activeTab === 'files' ? 'active' : ''}`}
          onClick={() => setActiveTab('files')}
        >
          Files
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            {/* Org Chart */}
            <div className="section">
              <div className="section-header">
                <h2><Users size={18} /> Division Structure</h2>
              </div>
              <div className="org-chart">
                {/* Level 1 */}
                <div className="agent-level-1">
                  <div className="agent-icon">{orgStructure.head.icon}</div>
                  <div className="agent-name">{orgStructure.head.name}</div>
                  <div className="agent-role">{orgStructure.head.role}</div>
                  <div className="agent-status online">● Online</div>
                </div>
                
                {/* Connector */}
                <div className="connector-vertical"></div>
                
                {/* Level 2 */}
                <div className="agents-level-2">
                  {orgStructure.departments.map((dept, idx) => (
                    <div key={idx} className="agent-level-2">
                      <div className="agent-icon">{dept.icon}</div>
                      <div className="agent-name">{dept.name}</div>
                      <div className="agent-subagents">
                        {dept.subAgents.map((sub, sidx) => (
                          <span key={sidx} className="subagent-tag">{sub}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="section">
              <div className="section-header">
                <h2><Activity size={18} /> Quick Actions</h2>
              </div>
              <div className="quick-actions">
                <a href="https://ismile.com.my" target="_blank" className="action-btn">
                  🌐 Visit Website
                </a>
                <a href="https://search.google.com/search?q=iSmile+Dental+Clinic+Petaling+Jaya" target="_blank" className="action-btn">
                  🔍 Check Rankings
                </a>
                <a href="https://business.google.com" target="_blank" className="action-btn">
                  📍 Open GBP
                </a>
                <a href="https://github.com/lauluzhong/iSmileDentalClinic/pulls" target="_blank" className="action-btn">
                  💻 GitHub PRs
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="section">
            <div className="section-header">
              <h2><CheckCircle size={18} /> All Tasks</h2>
            </div>
            <div className="task-list">
              {sampleTasks.map(task => (
                <div key={task.id} className={`task-item ${task.status}`}>
                  <div className="task-status">
                    {task.status === 'done' && <CheckCircle size={16} />}
                    {task.status === 'in-progress' && <Clock size={16} />}
                    {task.status === 'todo' && <div className="status-dot-small"></div>}
                  </div>
                  <div className="task-text">{task.text}</div>
                  <div className="task-owner">{task.owner}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="section">
            <div className="section-header">
              <h2><FileText size={18} /> Agent Files</h2>
            </div>
            <div className="files-grid">
              {files.map((file, idx) => (
                <div key={idx} className="file-card">
                  <div className="file-icon">{file.icon}</div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-desc">{file.desc}</div>
                  </div>
                  <ChevronRight size={16} className="file-arrow" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :root {
          --bg-primary: #0a0a0f;
          --bg-secondary: #12121a;
          --bg-tertiary: #1a1a2e;
          --border: #2a2a4e;
          --text-primary: #e0e0e0;
          --text-secondary: #6b7280;
          --accent-cyan: #00A0C6;
          --accent-purple: #7C3AED;
          --accent-green: #10B981;
          --accent-yellow: #F59E0B;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          min-height: 100vh;
        }
        
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: var(--bg-secondary);
          border-radius: 16px;
          margin-bottom: 24px;
          border: 1px solid var(--border);
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }
        
        .logo-text {
          font-size: 1.3rem;
          font-weight: 700;
        }
        
        .logo-text span {
          color: var(--accent-cyan);
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .status-badge {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--accent-green);
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--accent-green);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .time-display {
          text-align: right;
        }
        
        .time {
          display: block;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .date {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        /* Stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .stat-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;
        }
        
        .stat-card:hover {
          border-color: var(--accent-cyan);
        }
        
        .stat-icon {
          width: 44px;
          height: 44px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-cyan);
        }
        
        .stat-content {
          flex: 1;
        }
        
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        
        .stat-value {
          font-size: 1.6rem;
          font-weight: 700;
        }
        
        .stat-value.primary { color: var(--accent-cyan); }
        .stat-value.success { color: var(--accent-green); }
        .stat-value.warning { color: var(--accent-yellow); }
        .stat-value.accent { color: var(--accent-purple); }
        
        /* Tabs */
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          background: var(--bg-secondary);
          padding: 6px;
          border-radius: 12px;
          width: fit-content;
        }
        
        .tab {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .tab:hover {
          color: var(--text-primary);
        }
        
        .tab.active {
          background: var(--accent-cyan);
          color: #000;
        }
        
        /* Content */
        .content {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
        }
        
        .section-header {
          margin-bottom: 20px;
        }
        
        .section-header h2 {
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-secondary);
        }
        
        /* Org Chart */
        .org-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        
        .agent-level-1 {
          background: linear-gradient(135deg, var(--bg-tertiary), #2a2a4e);
          border: 2px solid var(--accent-cyan);
          border-radius: 16px;
          padding: 24px 40px;
          text-align: center;
          position: relative;
        }
        
        .agent-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        
        .agent-name {
          font-size: 1.2rem;
          font-weight: 700;
        }
        
        .agent-role {
          color: var(--accent-cyan);
          font-size: 0.85rem;
          margin-top: 4px;
        }
        
        .agent-status {
          font-size: 0.75rem;
          margin-top: 8px;
          padding: 4px 12px;
          border-radius: 12px;
          display: inline-block;
        }
        
        .agent-status.online {
          background: rgba(16, 185, 129, 0.2);
          color: var(--accent-green);
        }
        
        .connector-vertical {
          width: 2px;
          height: 30px;
          background: var(--border);
        }
        
        .agents-level-2 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        
        .agent-level-2 {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        
        .agent-level-2:hover {
          border-color: var(--accent-purple);
        }
        
        .agent-level-2 .agent-icon {
          font-size: 1.5rem;
        }
        
        .agent-level-2 .agent-name {
          font-size: 0.95rem;
          margin-bottom: 12px;
        }
        
        .agent-subagents {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          justify-content: center;
        }
        
        .subagent-tag {
          font-size: 0.7rem;
          background: var(--bg-primary);
          padding: 4px 8px;
          border-radius: 6px;
          color: var(--text-secondary);
        }
        
        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        
        .action-btn {
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px;
          text-align: center;
          color: var(--text-primary);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        
        .action-btn:hover {
          border-color: var(--accent-cyan);
          transform: translateY(-2px);
        }
        
        /* Tasks */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .task-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          border-left: 3px solid var(--border);
        }
        
        .task-item.done {
          border-left-color: var(--accent-green);
          opacity: 0.7;
        }
        
        .task-item.in-progress {
          border-left-color: var(--accent-yellow);
        }
        
        .task-item.todo {
          border-left-color: var(--text-secondary);
        }
        
        .task-status {
          color: var(--text-secondary);
        }
        
        .task-item.done .task-status {
          color: var(--accent-green);
        }
        
        .task-item.in-progress .task-status {
          color: var(--accent-yellow);
        }
        
        .status-dot-small {
          width: 10px;
          height: 10px;
          background: var(--text-secondary);
          border-radius: 50%;
        }
        
        .task-text {
          flex: 1;
        }
        
        .task-owner {
          font-size: 0.8rem;
          color: var(--text-secondary);
          background: var(--bg-primary);
          padding: 4px 10px;
          border-radius: 8px;
        }
        
        /* Files */
        .files-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        
        .file-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .file-card:hover {
          border-color: var(--accent-cyan);
        }
        
        .file-icon {
          font-size: 1.5rem;
        }
        
        .file-info {
          flex: 1;
        }
        
        .file-name {
          font-weight: 600;
          margin-bottom: 2px;
        }
        
        .file-desc {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        
        .file-arrow {
          color: var(--text-secondary);
        }
        
        /* Overview Grid */
        .overview-grid {
          display: grid;
          gap: 24px;
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .agents-level-2 {
            grid-template-columns: repeat(2, 1fr);
          }
          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
          .files-grid {
            grid-template-columns: 1fr;
          }
          .header {
            flex-direction: column;
            gap: 16px;
          }
        }
      `}</style>
    </div>
  );
}
