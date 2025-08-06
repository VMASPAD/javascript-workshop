import {
  writeTextFile,
  readTextFile,
  exists,
  remove,
  readDir,
  mkdir,
  BaseDirectory,
  copyFile
} from '@tauri-apps/plugin-fs';

export interface ProjectFile {
  id: string;
  name: string;
  type: 'javascript' | 'html' | 'css';
  content: string;
  lastModified: number;
}

export interface ProjectFolder {
  id: string;
  name: string;
  files: ProjectFile[];
  createdAt: number;
}

export class FileSystemManager {
  private basePath = 'javascript-workshop/projects';

  constructor() {
    this.initializeFileSystem();
  }

  private async initializeFileSystem() {
    try {
      const baseExists = await exists(this.basePath, { baseDir: BaseDirectory.AppData });
      if (!baseExists) {
        await mkdir(this.basePath, { baseDir: BaseDirectory.AppData, recursive: true });
      }
    } catch (error) {
      console.error('Error initializing file system:', error);
    }
  }

  // Crear un nuevo proyecto con archivos base - JavaScript integrado en HTML
  async createProject(projectName: string): Promise<ProjectFolder> {
    const projectId = `project_${Date.now()}`;
    const projectPath = `${this.basePath}/${projectId}`;
    
    try {
      // Crear directorio del proyecto
      await mkdir(projectPath, { baseDir: BaseDirectory.AppData, recursive: true });
      
      // Crear archivos base - JavaScript integrado en HTML
      const files: ProjectFile[] = [
        {
          id: `${projectId}_html`,
          name: projectName,
          type: 'html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName} - Modern Web Application</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <meta name="description" content="A modern web application built with JavaScript Workshop">
    <meta name="keywords" content="javascript, web development, modern, responsive">
</head>
<body>
    <div id="app">
        <!-- Hero Section -->
        <header class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">
                    🚀 ${projectName}
                </h1>
                <p class="hero-subtitle">
                    A modern, interactive web application built with cutting-edge JavaScript technologies.
                    Experience seamless user interfaces and powerful functionality.
                </p>
                
                <!-- Navigation -->
                <nav class="hero-nav">
                    <ul>
                        <li><a href="#features" class="nav-link">✨ Features</a></li>
                        <li><a href="#demo" class="nav-link">🎯 Demo</a></li>
                        <li><a href="#about" class="nav-link">📖 About</a></li>
                        <li><a href="#contact" class="nav-link">📞 Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
        
        <main>
            <!-- Welcome Section -->
            <section id="features" class="section">
                <div class="container">
                    <div class="welcome-card card">
                        <div class="card-header">
                            <h2>🎉 Welcome to ${projectName}</h2>
                            <p>
                                Discover a world of possibilities with our innovative platform. 
                                Built for developers, designed for users, crafted with passion.
                            </p>
                        </div>
                        <a href="#demo" class="cta-button">
                            🚀 Get Started
                        </a>
                    </div>
                    
                    <!-- Features Grid -->
                    <div class="features-grid">
                        <div class="feature-item">
                            <div class="feature-icon">⚡</div>
                            <h3>Lightning Fast</h3>
                            <p>Optimized performance with modern JavaScript and efficient algorithms</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🎨</div>
                            <h3>Beautiful Design</h3>
                            <p>Stunning user interface with smooth animations and responsive layouts</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🔒</div>
                            <h3>Secure & Reliable</h3>
                            <p>Built with security best practices and tested for reliability</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📱</div>
                            <h3>Mobile Ready</h3>
                            <p>Fully responsive design that works perfectly on all devices</p>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🔧</div>
                            <h3>Customizable</h3>
                            <p>Easy to modify and extend with your own features</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Demo Section -->
            <section id="demo" class="section demo-section">
                <div class="container">
                    <h2 class="section-title">🎯 Interactive Demo</h2>
                    <div class="demo-content">
                        <div class="demo-box">
                            <h3>Click Counter</h3>
                            <p>Clicks: <span id="click-counter">0</span></p>
                            <button id="counter-btn" class="demo-button">Click Me!</button>
                        </div>
                        <div class="demo-box">
                            <h3>Current Time</h3>
                            <p id="current-time" class="time-display">Loading...</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        
        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <p>&copy; 2025 ${projectName} | Built with JavaScript Workshop ❤️</p>
                <p class="footer-note">Created on <span id="creation-date"></span></p>
            </div>
        </footer>
    </div>
</body>
</html>`,
          lastModified: Date.now()
        },
        {
          id: `${projectId}_javascript`,
          name: projectName,
          type: 'javascript',
          content: `// ${projectName} - JavaScript Code
// This code will be automatically integrated into the HTML file

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ${projectName} is loading...');
    
    // Set creation date
    const creationDate = document.getElementById('creation-date');
    if (creationDate) {
        creationDate.textContent = new Date().toLocaleDateString();
    }
    
    // Initialize click counter
    initClickCounter();
    
    // Initialize time display
    initTimeDisplay();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    console.log('✅ ${projectName} loaded successfully!');
});

// Click Counter Feature
function initClickCounter() {
    let clickCount = 0;
    const counterDisplay = document.getElementById('click-counter');
    const counterButton = document.getElementById('counter-btn');
    
    if (counterButton && counterDisplay) {
        counterButton.addEventListener('click', function() {
            clickCount++;
            counterDisplay.textContent = clickCount;
            
            // Add some visual feedback
            counterButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                counterButton.style.transform = 'scale(1)';
            }, 100);
            
            // Log the click
            console.log(\`Click count: \${clickCount}\`);
        });
    }
}

// Real-time Clock Feature
function initTimeDisplay() {
    const timeDisplay = document.getElementById('current-time');
    
    if (timeDisplay) {
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            timeDisplay.textContent = timeString;
        }
        
        // Update immediately
        updateTime();
        
        // Update every second
        setInterval(updateTime, 1000);
    }
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Example async function
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        showNotification('Failed to fetch data', 'error');
        return null;
    }
}

// Example class
class TodoManager {
    constructor() {
        this.todos = [];
        this.nextId = 1;
    }
    
    addTodo(text) {
        const todo = {
            id: this.nextId++,
            text: text,
            completed: false,
            createdAt: new Date()
        };
        this.todos.push(todo);
        console.log('Todo added:', todo);
        return todo;
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            console.log('Todo toggled:', todo);
        }
        return todo;
    }
    
    getTodos() {
        return this.todos;
    }
}

// Initialize TodoManager
const todoManager = new TodoManager();

// Example of event delegation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('demo-button')) {
        showNotification('Demo button clicked!', 'success');
    }
});

// Add some interactive features when the app loads
console.log('📝 JavaScript Workshop integration ready!');
console.log('💡 Tip: All JavaScript code is now embedded in the HTML file.');`,
          lastModified: Date.now()
        },
        {
          id: `${projectId}_css`,
          name: projectName,
          type: 'css',
          content: `/* ${projectName} - Modern CSS Styles */
/* Built with JavaScript Workshop */

/* CSS Custom Properties (Variables) */
:root {
    --primary-color: #3b82f6;
    --primary-dark: #1d4ed8;
    --secondary-color: #8b5cf6;
    --accent-color: #06b6d4;
    --background-color: #f8fafc;
    --surface-color: #ffffff;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    --border-color: #e2e8f0;
    --shadow-light: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-heavy: 0 10px 25px rgba(0, 0, 0, 0.15);
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
}

/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    overflow-x: hidden;
}

/* Main App Container */
#app {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--surface-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-heavy);
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
    overflow: hidden;
    position: relative;
}

/* Container */
.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

/* Hero Section */
.hero-section {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white;
    padding: var(--spacing-xl) var(--spacing-md);
    position: relative;
    overflow: hidden;
}

.hero-section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
}

.hero-content {
    text-align: center;
    position: relative;
    z-index: 1;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
    background: linear-gradient(45deg, #ffffff, #e2e8f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-lg);
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

/* Navigation */
.hero-nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
}

.nav-link {
    color: white;
    text-decoration: none;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-weight: 500;
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Sections */
.section {
    padding: var(--spacing-xl) 0;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: var(--spacing-xl);
    color: var(--text-primary);
}

/* Cards */
.card {
    background: var(--surface-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-medium);
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-heavy);
}

.welcome-card {
    text-align: center;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.card-header h2 {
    font-size: 2.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
}

.card-header p {
    font-size: 1.125rem;
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

/* Buttons */
.cta-button {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
    color: white;
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: 50px;
    font-size: 1.125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    text-decoration: none;
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
}

.cta-button:active {
    transform: translateY(-1px);
}

/* Features Grid */
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    margin-top: var(--spacing-lg);
}

.feature-item {
    text-align: center;
    padding: var(--spacing-lg);
    background: var(--surface-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-light);
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
}

.feature-item:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-medium);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: var(--spacing-sm);
    display: block;
}

.feature-item h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    color: var(--text-primary);
}

.feature-item p {
    color: var(--text-secondary);
    line-height: 1.5;
}

/* Demo Section */
.demo-section {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.demo-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
}

.demo-box {
    background: var(--surface-color);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-light);
    border: 1px solid var(--border-color);
    text-align: center;
}

.demo-box h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
}

.demo-button {
    background: linear-gradient(135deg, var(--secondary-color) 0%, #7c3aed 100%);
    color: white;
    padding: var(--spacing-xs) var(--spacing-md);
    border: none;
    border-radius: var(--radius-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: var(--spacing-sm);
}

.demo-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
}

.time-display {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--primary-color);
    font-family: 'Courier New', monospace;
}

#click-counter {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--secondary-color);
}

/* Footer */
.footer {
    background: var(--background-color);
    text-align: center;
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    color: var(--text-secondary);
}

.footer-note {
    font-size: 0.875rem;
    margin-top: var(--spacing-xs);
    color: var(--text-muted);
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .section-title {
        font-size: 2rem;
    }
    
    .card-header h2 {
        font-size: 1.875rem;
    }
    
    .hero-nav ul {
        gap: var(--spacing-sm);
    }
    
    .nav-link {
        padding: 0.5rem var(--spacing-sm);
        font-size: 0.9rem;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .demo-content {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 480px) {
    #app {
        margin: var(--spacing-sm);
        border-radius: var(--radius-sm);
    }
    
    .hero-section {
        padding: var(--spacing-lg) var(--spacing-sm);
    }
    
    .container {
        padding: 0 var(--spacing-sm);
    }
}

/* Animation Classes */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.6s ease forwards;
}

/* Loading Animation */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.pulse {
    animation: pulse 2s infinite;
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.mt-1 { margin-top: var(--spacing-xs); }
.mt-2 { margin-top: var(--spacing-sm); }
.mt-3 { margin-top: var(--spacing-md); }
.mb-1 { margin-bottom: var(--spacing-xs); }
.mb-2 { margin-bottom: var(--spacing-sm); }
.mb-3 { margin-bottom: var(--spacing-md); }`,
          lastModified: Date.now()
        }
      ];

      // Guardar archivos en el sistema
      for (const file of files) {
        await this.saveFile(projectId, file);
      }

      const project: ProjectFolder = {
        id: projectId,
        name: projectName,
        files,
        createdAt: Date.now()
      };

      // Guardar metadata del proyecto
      await this.saveProjectMetadata(project);

      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  // Obtener lista de proyectos
  async getProjects(): Promise<ProjectFolder[]> {
    try {
      const projectsExist = await exists(this.basePath, { baseDir: BaseDirectory.AppData });
      if (!projectsExist) {
        return [];
      }

      const entries = await readDir(this.basePath, { baseDir: BaseDirectory.AppData });
      const projects: ProjectFolder[] = [];

      for (const entry of entries) {
        if (entry.isDirectory) {
          try {
            const metadataPath = `${this.basePath}/${entry.name}/metadata.json`;
            const metadataExists = await exists(metadataPath, { baseDir: BaseDirectory.AppData });
            
            if (metadataExists) {
              const metadata = await readTextFile(metadataPath, { baseDir: BaseDirectory.AppData });
              const project = JSON.parse(metadata) as ProjectFolder;
              
              // Cargar archivos del proyecto
              project.files = await this.loadProjectFiles(project.id);
              projects.push(project);
            }
          } catch (error) {
            console.error(`Error loading project ${entry.name}:`, error);
          }
        }
      }

      return projects.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  }

  // Cargar archivos de un proyecto específico
  async loadProjectFiles(projectId: string): Promise<ProjectFile[]> {
    try {
      const projectPath = `${this.basePath}/${projectId}`;
      const entries = await readDir(projectPath, { baseDir: BaseDirectory.AppData });
      const files: ProjectFile[] = [];

      for (const entry of entries) {
        if (!entry.isDirectory && entry.name !== 'metadata.json') {
          const filePath = `${projectPath}/${entry.name}`;
          const content = await readTextFile(filePath, { baseDir: BaseDirectory.AppData });
          
          // Determinar tipo de archivo por extensión
          let type: 'javascript' | 'html' | 'css' = 'javascript';
          const fileName = entry.name.toLowerCase();
          if (fileName.endsWith('.html')) type = 'html';
          else if (fileName.endsWith('.css')) type = 'css';
          else if (fileName.endsWith('.js')) type = 'javascript';

          // Generar ID único basado en el tipo y nombre del archivo
          const file: ProjectFile = {
            id: `${projectId}_${type}_${entry.name}`,
            name: entry.name.replace(/\.(js|html|css)$/, ''),
            type,
            content,
            lastModified: Date.now()
          };

          console.log(`📁 Loaded file: ${entry.name} as ${type} with ${content.length} characters`);
          files.push(file);
        }
      }

      console.log(`📂 Project ${projectId} loaded with ${files.length} files:`, files.map(f => `${f.name}.${f.type === 'javascript' ? 'js' : f.type}`));
      return files;
    } catch (error) {
      console.error('Error loading project files:', error);
      return [];
    }
  }

  // Guardar archivo individual
  async saveFile(projectId: string, file: ProjectFile): Promise<void> {
    try {
      const extension = file.type === 'javascript' ? 'js' : file.type;
      const fileName = `${file.name}.${extension}`;
      const filePath = `${this.basePath}/${projectId}/${fileName}`;
      
      await writeTextFile(filePath, file.content, { baseDir: BaseDirectory.AppData });
      
      // Actualizar metadata del archivo
      file.lastModified = Date.now();
    } catch (error) {
      console.error('Error saving file:', error);
      throw error;
    }
  }

  // Cargar archivo específico
  async loadFile(projectId: string, fileId: string): Promise<ProjectFile | null> {
    try {
      const project = await this.getProject(projectId);
      if (!project) return null;

      return project.files.find(f => f.id === fileId) || null;
    } catch (error) {
      console.error('Error loading file:', error);
      return null;
    }
  }

  // Obtener proyecto específico
  async getProject(projectId: string): Promise<ProjectFolder | null> {
    try {
      const metadataPath = `${this.basePath}/${projectId}/metadata.json`;
      const metadataExists = await exists(metadataPath, { baseDir: BaseDirectory.AppData });
      
      if (!metadataExists) return null;

      const metadata = await readTextFile(metadataPath, { baseDir: BaseDirectory.AppData });
      const project = JSON.parse(metadata) as ProjectFolder;
      
      // Cargar archivos actualizados
      project.files = await this.loadProjectFiles(projectId);
      
      return project;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  // Eliminar proyecto
  async deleteProject(projectId: string): Promise<void> {
    try {
      const projectPath = `${this.basePath}/${projectId}`;
      await remove(projectPath, { baseDir: BaseDirectory.AppData, recursive: true });
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Eliminar archivo específico
  async deleteFile(projectId: string, file: ProjectFile): Promise<void> {
    try {
      const extension = file.type === 'javascript' ? 'js' : file.type;
      const fileName = `${file.name}.${extension}`;
      const filePath = `${this.basePath}/${projectId}/${fileName}`;
      
      await remove(filePath, { baseDir: BaseDirectory.AppData });
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Renombrar proyecto
  async renameProject(projectId: string, newName: string): Promise<void> {
    try {
      const project = await this.getProject(projectId);
      if (!project) throw new Error('Project not found');

      project.name = newName;
      await this.saveProjectMetadata(project);

      // Actualizar nombres de archivos para que coincidan con el nuevo nombre del proyecto
      for (const file of project.files) {
        if (file.name === project.name) {
          file.name = newName;
          await this.saveFile(projectId, file);
        }
      }
    } catch (error) {
      console.error('Error renaming project:', error);
      throw error;
    }
  }

  // Duplicar proyecto
  async duplicateProject(projectId: string, newName: string): Promise<ProjectFolder> {
    try {
      const originalProject = await this.getProject(projectId);
      if (!originalProject) throw new Error('Project not found');

      // Crear nuevo proyecto con el contenido del original
      const newProjectId = `project_${Date.now()}`;
      const newProjectPath = `${this.basePath}/${newProjectId}`;
      
      await mkdir(newProjectPath, { baseDir: BaseDirectory.AppData, recursive: true });

      const newFiles: ProjectFile[] = originalProject.files.map(file => ({
        ...file,
        id: file.id.replace(projectId, newProjectId),
        name: file.name === originalProject.name ? newName : file.name,
        lastModified: Date.now()
      }));

      // Guardar archivos duplicados
      for (const file of newFiles) {
        await this.saveFile(newProjectId, file);
      }

      const newProject: ProjectFolder = {
        id: newProjectId,
        name: newName,
        files: newFiles,
        createdAt: Date.now()
      };

      await this.saveProjectMetadata(newProject);
      return newProject;
    } catch (error) {
      console.error('Error duplicating project:', error);
      throw error;
    }
  }

  // Exportar proyecto como ZIP (simulado con archivos separados)
  async exportProject(projectId: string): Promise<void> {
    try {
      const project = await this.getProject(projectId);
      if (!project) throw new Error('Project not found');

      // Crear directorio de exportación
      const exportPath = `exports/${project.name}_${Date.now()}`;
      await mkdir(exportPath, { baseDir: BaseDirectory.Download, recursive: true });

      // Copiar archivos al directorio de exportación
      for (const file of project.files) {
        const extension = file.type === 'javascript' ? 'js' : file.type;
        const fileName = `${file.name}.${extension}`;
        const sourcePath = `${this.basePath}/${projectId}/${fileName}`;
        const destPath = `${exportPath}/${fileName}`;
        
        await copyFile(sourcePath, destPath, {
          fromPathBaseDir: BaseDirectory.AppData,
          toPathBaseDir: BaseDirectory.Download
        });
      }

      console.log(`Project exported to Downloads/${exportPath}`);
    } catch (error) {
      console.error('Error exporting project:', error);
      throw error;
    }
  }

  // Guardar metadata del proyecto
  private async saveProjectMetadata(project: ProjectFolder): Promise<void> {
    try {
      const metadataPath = `${this.basePath}/${project.id}/metadata.json`;
      const metadata = {
        id: project.id,
        name: project.name,
        createdAt: project.createdAt,
        files: project.files.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type,
          lastModified: f.lastModified
        }))
      };
      
      await writeTextFile(metadataPath, JSON.stringify(metadata, null, 2), { 
        baseDir: BaseDirectory.AppData 
      });
    } catch (error) {
      console.error('Error saving project metadata:', error);
      throw error;
    }
  }

  // Importar proyecto desde archivos
  async importProject(projectName: string, files: { name: string; content: string; type: 'javascript' | 'html' | 'css' }[]): Promise<ProjectFolder> {
    try {
      const projectId = `project_${Date.now()}`;
      const projectPath = `${this.basePath}/${projectId}`;
      
      await mkdir(projectPath, { baseDir: BaseDirectory.AppData, recursive: true });

      const projectFiles: ProjectFile[] = files.map((file, index) => ({
        id: `${projectId}_${file.type}_${index}`,
        name: file.name,
        type: file.type,
        content: file.content,
        lastModified: Date.now()
      }));

      // Guardar archivos importados
      for (const file of projectFiles) {
        await this.saveFile(projectId, file);
      }

      const project: ProjectFolder = {
        id: projectId,
        name: projectName,
        files: projectFiles,
        createdAt: Date.now()
      };

      await this.saveProjectMetadata(project);
      return project;
    } catch (error) {
      console.error('Error importing project:', error);
      throw error;
    }
  }
}

// Instancia global del FileSystemManager
export const fileSystemManager = new FileSystemManager();
