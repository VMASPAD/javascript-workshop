import { useState, useEffect } from 'preact/hooks';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { fileSystemManager, ProjectFolder, ProjectFile } from '../lib/fs';
import FileEditor from './FileEditor';
import HelpPanel from './HelpPanel';
import { HelpCircle } from 'lucide-react';

interface ProjectManagerProps {
  onProjectSelect?: (project: ProjectFolder, file: ProjectFile) => void;
}

function ProjectManager({ onProjectSelect }: ProjectManagerProps) {
  const [projects, setProjects] = useState<ProjectFolder[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectFolder | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const loadedProjects = await fileSystemManager.getProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      setIsLoading(true);
      const newProject = await fileSystemManager.createProject(newProjectName.trim());
      setProjects(prev => [newProject, ...prev]);
      setNewProjectName('');
      setShowNewProjectDialog(false);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await fileSystemManager.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        setSelectedFile(null);
        setShowEditor(false);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const duplicateProject = async (project: ProjectFolder) => {
    const newName = prompt('Enter name for the duplicated project:', `${project.name} Copy`);
    if (!newName?.trim()) return;

    try {
      setIsLoading(true);
      const duplicatedProject = await fileSystemManager.duplicateProject(project.id, newName.trim());
      setProjects(prev => [duplicatedProject, ...prev]);
    } catch (error) {
      console.error('Error duplicating project:', error);
      alert('Error duplicating project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportProject = async (project: ProjectFolder) => {
    try {
      setIsLoading(true);
      await fileSystemManager.exportProject(project.id);
      alert(`Project "${project.name}" has been exported to your Downloads folder.`);
    } catch (error) {
      console.error('Error exporting project:', error);
      alert('Error exporting project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openProject = async (project: ProjectFolder) => {
    try {
      const fullProject = await fileSystemManager.getProject(project.id);
      if (fullProject && fullProject.files.length > 0) {
        setSelectedProject(fullProject);
        setSelectedFile(fullProject.files[0]); // Select first file by default
        setShowEditor(true);
        
        if (onProjectSelect) {
          onProjectSelect(fullProject, fullProject.files[0]);
        }
      }
    } catch (error) {
      console.error('Error opening project:', error);
      alert('Error opening project. Please try again.');
    }
  };

/*   const selectFile = (file: ProjectFile) => {
    setSelectedFile(file);
    if (selectedProject && onProjectSelect) {
      onProjectSelect(selectedProject, file);
    }
  }; */

  const saveCurrentFile = async (content: string) => {
    if (!selectedProject || !selectedFile) return;

    try {
      const updatedFile = { ...selectedFile, content };
      await fileSystemManager.saveFile(selectedProject.id, updatedFile);
      
      // Update local state
      setSelectedFile(updatedFile);
      setSelectedProject(prev => {
        if (!prev) return prev;
        const updatedFiles = prev.files.map(f => 
          f.id === updatedFile.id ? updatedFile : f
        );
        return { ...prev, files: updatedFiles };
      });
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file. Please try again.');
    }
  };

  const formatFileSize = (content: string) => {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showEditor && selectedProject && selectedFile) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowEditor(false)}
            >
              ← Back to Projects
            </Button>
            <div>
              <h2 className="font-semibold">{selectedProject.name}</h2> 
            </div>
          </div> 
        </div>
        
        <FileEditor
          initialCode={selectedFile.content}
          language={selectedFile.type}
          onSave={saveCurrentFile}
          fileName={selectedFile.name}
          projectId={selectedProject.id}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center max-md:flex-col justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-400 bg-clip-text text-transparent">
              🚀 JavaScript Workshop
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Create, manage, and edit your JavaScript projects
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowHelp(true)}
              size="lg"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            <Button
              onClick={() => setShowNewProjectDialog(true)}
              disabled={isLoading}
              size="lg"
            > New Project
            </Button>
          </div>
        </div>

        {/* New Project Dialog */}
        {showNewProjectDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>
                  Enter a name for your new JavaScript project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={(e: any) => setNewProjectName(e.target?.value || '')}
                  onKeyDown={(e) => e.key === 'Enter' && createNewProject()}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewProjectDialog(false);
                      setNewProjectName('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={createNewProject}
                    disabled={!newProjectName.trim() || isLoading}
                  >
                    Create Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects Grid */}
        {isLoading && projects.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first JavaScript project to get started
            </p>
            <Button
              onClick={() => setShowNewProjectDialog(true)}
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-amber-400 hover:from-orange-700 hover:to-amber-500"
            >
              ✨ Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        📁 {project.name}
                      </CardTitle>
                      <CardDescription>
                        Created {formatDate(project.createdAt)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Files Info */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Files ({project.files.length})</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {project.files.map((file) => (
                          <div
                            key={file.id}
                            className="bg-muted rounded p-2 text-center"
                          >
                            <div className="font-medium">
                              {file.type === 'javascript' ? '📄 JS' : 
                               file.type === 'html' ? '🌐 HTML' : '🎨 CSS'}
                            </div>
                            <div className="text-muted-foreground mt-1">
                              {formatFileSize(file.content)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => openProject(project)}
                        className="flex-1"
                      >
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateProject(project)}
                        disabled={isLoading}
                      >
                        📋
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportProject(project)}
                        disabled={isLoading}
                      >
                        📤
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                        disabled={isLoading}
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Help Panel */}
        <HelpPanel 
          isOpen={showHelp} 
          onClose={() => setShowHelp(false)} 
        />
      </div>
    </div>
  );
}

export default ProjectManager;
