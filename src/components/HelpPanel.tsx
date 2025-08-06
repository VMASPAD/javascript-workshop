import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { X, BookOpen, Code, Palette, Globe, Zap, FileText } from 'lucide-react';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              JavaScript Workshop Help
            </CardTitle>
            <CardDescription>
              Learn how to use the JavaScript Workshop effectively
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[70vh]">
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="html-css">HTML & CSS</TabsTrigger>
              <TabsTrigger value="file-system">File System</TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    Welcome to JavaScript Workshop
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    JavaScript Workshop is a powerful IDE for creating and managing JavaScript, HTML, and CSS projects. 
                    Each project contains three synchronized files that work together to create complete web applications.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🚀 Quick Start</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Click "New Project" to create your first project</li>
                    <li>Enter a project name and click "Create Project"</li>
                    <li>Click "Open" on your new project to start editing</li>
                    <li>Switch between JavaScript, HTML, and CSS files using the tabs</li>
                    <li>Use "Save" to save your changes, "Run" for JavaScript, "Preview" for HTML</li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">💡 Key Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>File Management:</strong> Create, save, edit, and delete project files</li>
                    <li>• <strong>Live Editing:</strong> Monaco Editor with syntax highlighting and IntelliSense</li>
                    <li>• <strong>Code Execution:</strong> Run JavaScript code and see console output</li>
                    <li>• <strong>Live Preview:</strong> Preview HTML/CSS in a new window</li>
                    <li>• <strong>Project Export:</strong> Download your projects to your computer</li>
                    <li>• <strong>Auto-save:</strong> Your work is automatically saved</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="javascript" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-yellow-500" />
                    JavaScript Development
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Write and execute JavaScript code with full console output and error handling.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🎯 Running Code</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Click the "Play" button to execute your JavaScript code</li>
                    <li>• Console output appears in the right panel</li>
                    <li>• Use <code className="bg-muted px-1 rounded">console.log()</code> to output values</li>
                    <li>• Errors are caught and displayed with helpful messages</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">📝 Code Examples</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm"><code>{`// Variables and functions
const greeting = "Hello, World!";
console.log(greeting);

// Arrays and loops
const numbers = [1, 2, 3, 4, 5];
numbers.forEach(num => console.log(num * 2));

// Async/await
async function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data loaded!"), 1000);
  });
}

fetchData().then(data => console.log(data));`}</code></pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">⚡ Editor Features</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Auto-completion (Ctrl+Space)</li>
                    <li>• Code formatting (Alt+Shift+F)</li>
                    <li>• Find/Replace (Ctrl+F / Ctrl+H)</li>
                    <li>• Multi-cursor editing (Alt+Click)</li>
                    <li>• Bracket matching and auto-closing</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="html-css" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    HTML Development
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create modern web pages with HTML5 and responsive CSS styling.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🌐 HTML Structure</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm"><code>{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Welcome!</h1>
        <button id="btn">Click me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`}</code></pre>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    CSS Styling
                  </h3>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🎨 Modern CSS</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm"><code>{`/* Modern CSS with Flexbox and Grid */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
}

.card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 2rem;
    color: white;
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}`}</code></pre>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">📱 Responsive Design</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Use CSS Grid and Flexbox for layouts</li>
                    <li>• Add media queries for mobile responsiveness</li>
                    <li>• Use relative units (rem, %, vw, vh)</li>
                    <li>• Test with the preview feature</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="file-system" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    File System Management
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Learn how to manage your projects and files effectively.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">📁 Project Structure</h4>
                  <p className="text-sm text-muted-foreground mb-2">Each project contains three synchronized files:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>JavaScript (.js):</strong> Your interactive code and logic</li>
                    <li>• <strong>HTML (.html):</strong> Your page structure and content</li>
                    <li>• <strong>CSS (.css):</strong> Your styling and visual design</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">💾 File Operations</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Create:</strong> New projects are created with template files</li>
                    <li>• <strong>Save:</strong> Files are automatically saved and stored locally</li>
                    <li>• <strong>Export:</strong> Download projects to your Downloads folder</li>
                    <li>• <strong>Duplicate:</strong> Create copies of existing projects</li>
                    <li>• <strong>Delete:</strong> Remove projects permanently (with confirmation)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🔄 Auto-sync</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your HTML, CSS, and JavaScript files are automatically linked:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• HTML automatically includes your CSS and JS files</li>
                    <li>• Changes are reflected in real-time</li>
                    <li>• All files share the same project name</li>
                    <li>• Export creates a complete, working webpage</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">💡 Best Practices</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Save frequently using Ctrl+S or the Save button</li>
                    <li>• Use descriptive project names</li>
                    <li>• Export projects before major changes</li>
                    <li>• Test your code regularly with Run/Preview</li>
                    <li>• Organize code with comments and proper formatting</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default HelpPanel;
