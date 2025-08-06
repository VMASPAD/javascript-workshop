import { useState, useRef, useEffect } from 'preact/hooks';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { fileSystemManager } from '../lib/fs';
import { 
  Download, 
  Upload, 
  Play, 
  RotateCcw, 
  Copy, 
  FileText,
  Sun,
  Moon,
  Code,
  Palette,
  Globe,
  Eye,
  Terminal,
  Sparkles,
  Monitor,
  Zap,
  BookOpen,
  Search,
  Command,
  Brackets,
  Type, 
  Keyboard,
  Save,
  Database,
  Trash2,
  TextSelection
} from 'lucide-react';

interface FileEditorProps {
  initialCode: string;
  language: 'javascript' | 'html' | 'css';
  onSave: (content: string) => Promise<void>;
  fileName: string;
  projectId?: string;
}

function FileEditor({ initialCode, language, onSave, fileName, projectId }: FileEditorProps) {
  // Estados principales
  const [jsCode, setJsCode] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [activeTab, setActiveTab] = useState(language);
  const [output, setOutput] = useState('');
  const [theme, setTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar todos los archivos del proyecto
  const loadProjectFiles = async () => {
    if (!projectId) return;
    
    try {
      console.log('🔄 Starting to load project files...');
      
      const project = await fileSystemManager.getProject(projectId);
      if (project && project.files) {
        console.log('🔍 Loading project files:', project.files.map(f => ({
          id: f.id,
          type: f.type,
          name: f.name,
          contentLength: f.content.length,
          contentPreview: f.content.substring(0, 50) + '...'
        })));
        
        // Buscar archivos por tipo
        const jsFile = project.files.find(f => f.type === 'javascript');
        const htmlFile = project.files.find(f => f.type === 'html');
        const cssFile = project.files.find(f => f.type === 'css');
        
        console.log('📄 Found files:', {
          js: jsFile ? `YES (${jsFile.content.length} chars)` : 'NO',
          html: htmlFile ? `YES (${htmlFile.content.length} chars)` : 'NO',
          css: cssFile ? `YES (${cssFile.content.length} chars)` : 'NO'
        });
        
        // Cargar archivos uno por uno con logs detallados
        if (jsFile && jsFile.content) {
          console.log('📄 Loading JS file:', jsFile.content.substring(0, 100) + '...');
          setJsCode(jsFile.content);
        } else {
          console.log('❌ No JS file found or empty content');
          setJsCode('// JavaScript code will appear here\nconsole.log("Hello World!");');
        }
        
        if (htmlFile && htmlFile.content) {
          console.log('🌐 Loading HTML file:', htmlFile.content.substring(0, 100) + '...');
          setHtmlCode(htmlFile.content);
        } else {
          console.log('❌ No HTML file found or empty content');
          setHtmlCode('<!DOCTYPE html>\n<html>\n<head>\n<title>New Page</title>\n</head>\n<body>\n\n</body>\n</html>');
        }
        
        if (cssFile && cssFile.content) {
          console.log('🎨 Loading CSS file:', cssFile.content.substring(0, 100) + '...');
          setCssCode(cssFile.content);
        } else {
          console.log('❌ No CSS file found or empty content');
          setCssCode('/* CSS styles will appear here */\nbody {\n  font-family: Arial, sans-serif;\n}');
        }
        
        console.log('✅ Project files loaded successfully');
        console.log('📊 Final state preview:', {
          jsLength: jsFile?.content.length || 0,
          htmlLength: htmlFile?.content.length || 0,
          cssLength: cssFile?.content.length || 0
        });
      } else {
        console.error('❌ No project found or no files in project');
      }
    } catch (error) {
      console.error('❌ Error loading project files:', error);
    }
  };

  // Configurar código inicial
  useEffect(() => {
    const initializeContent = async () => {
      setIsInitialLoad(true);
      
      if (projectId) {
        // Para proyectos, siempre empezar en HTML y cargar todos los archivos
        console.log('🔄 Initializing project:', projectId);
        setActiveTab('html');
        await loadProjectFiles();
      } else {
        // Si no hay projectId, solo configurar el archivo actual
        console.log('🔄 Initializing single file:', language);
        switch (language) {
          case 'javascript':
            setJsCode(initialCode);
            break;
          case 'html':
            setHtmlCode(initialCode);
            break;
          case 'css':
            setCssCode(initialCode);
            break;
        }
      }
      
      // Marcar que la carga inicial ha terminado
      setTimeout(() => {
        setIsInitialLoad(false);
        console.log('✅ Initial load completed');
      }, 1000);
    };
    
    initializeContent();
  }, [initialCode, language, projectId]);

  // Efecto adicional para manejar cambios de proyecto
  useEffect(() => {
    if (projectId) {
      console.log(`🔄 Project changed to: ${projectId}`);
      setIsInitialLoad(true);
      // Resetear tab a HTML cuando cambia el proyecto
      setActiveTab('html');
      // Recargar archivos
      const reloadFiles = async () => {
        await loadProjectFiles();
        setTimeout(() => setIsInitialLoad(false), 500);
      };
      reloadFiles();
    }
  }, [projectId]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: true },
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
    });
  };

  // Funciones de utilidad del editor
  const triggerCommandPalette = () => {
    editorRef.current?.trigger('keyboard', 'editor.action.quickCommand', {});
  };

  const triggerAutoComplete = () => {
    editorRef.current?.trigger('keyboard', 'editor.action.triggerSuggest', {});
  };

  const triggerSearch = () => {
    editorRef.current?.trigger('keyboard', 'actions.find', {});
  };

  const triggerReplace = () => {
    editorRef.current?.trigger('keyboard', 'editor.action.startFindReplaceAction', {});
  };

  const formatCode = () => {
    editorRef.current?.trigger('keyboard', 'editor.action.formatDocument', {});
  };

  const foldAll = () => {
    editorRef.current?.trigger('keyboard', 'editor.foldAll', {});
  };

  const unfoldAll = () => {
    editorRef.current?.trigger('keyboard', 'editor.unfoldAll', {});
  };

  // Plantillas de código
  const insertTemplate = (template: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const id = { major: 1, minor: 1 };
    const text = template;
    const op = { identifier: id, range: selection, text: text, forceMoveMarkers: true };
    editor.executeEdits("my-source", [op]);
    editor.focus();
  };

  const insertConsoleLog = () => {
    insertTemplate('console.log();');
  };

  const insertFunction = () => {
    insertTemplate(`function functionName() {
    // Your code here
    return;
}`);
  };

  const insertArrowFunction = () => {
    insertTemplate('const functionName = () => {\n    // Your code here\n    return;\n};');
  };

  const insertAsyncFunction = () => {
    insertTemplate(`async function functionName() {
    try {
        // Your async code here
        const result = await someAsyncOperation();
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}`);
  };

  const insertForLoop = () => {
    insertTemplate(`for (let i = 0; i < array.length; i++) {
    // Your code here
    console.log(array[i]);
}`);
  };

  const insertTryCatch = () => {
    insertTemplate(`try {
    // Your code here
} catch (error) {
    console.error('Error:', error);
}`);
  };

  const insertEventListener = () => {
    insertTemplate(`document.addEventListener('event', (e) => {
    // Your event handler code here
});`);
  };

  const insertClass = () => {
    insertTemplate(`class ClassName {
    constructor() {
        // Constructor code here
    }
    
    method() {
        // Method code here
    }
}`);
  };

  // Obtener código actual
  const getCurrentCode = () => {
    switch (activeTab) {
      case 'javascript': return jsCode;
      case 'html': return htmlCode;
      case 'css': return cssCode;
      default: return '';
    }
  };

  const getCurrentLanguage = () => {
    return activeTab;
  };

  const updateCurrentCode = (code: string) => {
    switch (activeTab) {
      case 'javascript': setJsCode(code); break;
      case 'html': setHtmlCode(code); break;
      case 'css': setCssCode(code); break;
    }
  };

  // Ejecutar código JavaScript
  const executeCode = () => {
    if (activeTab !== 'javascript') {
      setOutput('Code execution is only available for JavaScript files. Use the preview button for HTML/CSS.');
      return;
    }

    setOutput('');
    
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    let outputMessages: string[] = [];
    
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      outputMessages.push(`✅ LOG: ${message}`);
      originalLog(...args);
    };
    
    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      outputMessages.push(`❌ ERROR: ${message}`);
      originalError(...args);
    };
    
    console.warn = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      outputMessages.push(`⚠️ WARNING: ${message}`);
      originalWarn(...args);
    };

    try {
      const func = new Function(jsCode);
      const result = func();
      
      if (result !== undefined) {
        outputMessages.push(`🎯 RESULT: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`);
      }
      
      if (outputMessages.length === 0) {
        outputMessages.push('✨ Code executed successfully! No console output.');
      }
    } catch (error) {
      outputMessages.push(`💥 EXECUTION ERROR: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      setOutput(outputMessages.join('\n'));
    }
  };

  // Guardar archivo
  const saveFile = async () => {
    try {
      setIsLoading(true);
      const currentCode = getCurrentCode();
      const currentType = getCurrentLanguage();
      
      console.log(`💾 Saving ${currentType} file with ${currentCode.length} characters`);
      
      // Guardar mediante la función onSave proporcionada (solo para el archivo actual)
      await onSave(currentCode);
      
      // Si tenemos projectId, guardar solo el archivo que está siendo editado
      if (projectId) {
        const project = await fileSystemManager.getProject(projectId);
        if (project) {
          // Encontrar el archivo actual que corresponde al tab activo
          const currentFile = project.files.find(file => file.type === currentType);
          if (currentFile) {
            console.log(`📝 Found ${currentType} file in project:`, currentFile.name);
            
            // Solo actualizar y guardar el archivo que está siendo editado
            const updatedFile = {
              ...currentFile,
              content: currentCode,
              lastModified: Date.now()
            };
            
            console.log(`💿 Saving ${currentType} to filesystem`);
            await fileSystemManager.saveFile(projectId, updatedFile);
            console.log(`✅ ${currentType} file saved successfully`);
          } else {
            console.error(`❌ No ${currentType} file found in project`);
          }
        }
      }
      
      setLastSaved(new Date().toLocaleTimeString());
      setAutoSaveStatus('saved');
      
      // Cambiar a idle después de 2 segundos
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Error saving file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-guardar archivo específico cuando hay cambios
  const autoSaveCurrentFile = async () => {
    if (!projectId || isInitialLoad) {
      console.log('⏸️ Skipping auto-save: no projectId or initial load in progress');
      return;
    }
    
    try {
      setAutoSaveStatus('saving');
      const currentCode = getCurrentCode();
      const currentType = getCurrentLanguage();
      
      console.log(`🔍 Auto-save check for ${currentType}:`, {
        hasContent: currentCode.trim() !== '',
        isLoading: isLoading,
        codeLength: currentCode.length
      });
      
      // Solo auto-guardar si hay contenido y no está cargando
      if (currentCode.trim() !== '' && !isLoading) {
        const project = await fileSystemManager.getProject(projectId);
        if (project) {
          // Encontrar el archivo correspondiente al tab actual
          const currentFile = project.files.find(f => f.type === currentType);
          
          if (currentFile) {
            console.log(`📋 Comparing content for ${currentType}:`, {
              currentLength: currentCode.length,
              savedLength: currentFile.content.length,
              hasChanged: currentFile.content !== currentCode
            });
          }
          
          // Solo guardar si el contenido realmente ha cambiado
          if (currentFile && currentFile.content !== currentCode) {
            const updatedFile = {
              ...currentFile,
              content: currentCode,
              lastModified: Date.now()
            };
            
            await fileSystemManager.saveFile(projectId, updatedFile);
            console.log(`✅ Auto-saved ${currentType} file (${currentCode.length} chars)`);
            setLastSaved(new Date().toLocaleTimeString());
            setAutoSaveStatus('saved');
            
            // Cambiar a idle después de 2 segundos
            setTimeout(() => setAutoSaveStatus('idle'), 2000);
          } else {
            console.log(`ℹ️ No changes detected for ${currentType} file`);
            setAutoSaveStatus('idle');
          }
        }
      } else {
        console.log('⏸️ Skipping auto-save: empty content or loading');
        setAutoSaveStatus('idle');
      }
    } catch (error) {
      console.error('❌ Auto-save error:', error);
      setAutoSaveStatus('idle');
    }
  };

  // Auto-guardado inteligente cada 5 segundos cuando hay cambios
  useEffect(() => {
    if (!projectId || isInitialLoad) return;
    
    console.log('⏰ Setting up auto-save interval');
    const interval = setInterval(async () => {
      console.log('⏰ Auto-save interval triggered');
      await autoSaveCurrentFile();
    }, 5000); // Auto-guardar cada 5 segundos

    return () => {
      console.log('🛑 Clearing auto-save interval');
      clearInterval(interval);
    };
  }, [projectId, activeTab, jsCode, htmlCode, cssCode, isLoading, isInitialLoad]);

  // Auto-guardado inmediato al cambiar de tab para preservar cambios
  useEffect(() => {
    if (projectId && !isInitialLoad) {
      console.log(`🔄 Tab changed to: ${activeTab}, saving previous tab`);
      const saveBeforeTabChange = async () => {
        await autoSaveCurrentFile();
      };
      
      saveBeforeTabChange();
    }
  }, [activeTab]);

  // Auto-actualizar preview cuando el código cambie (con debounce para mejor rendimiento)
  useEffect(() => {
    if (!showPreview) return;
    
    const timeoutId = setTimeout(() => {
      const generatedContent = generatePreview();
      setPreviewContent(generatedContent);
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [jsCode, htmlCode, cssCode, showPreview]);

  // Descargar archivo actual
  const downloadCurrentFile = () => {
    const code = getCurrentCode();
    const extension = activeTab === 'javascript' ? '.js' : `.${activeTab}`;
    const mimeType = activeTab === 'javascript' ? 'text/javascript' : 
                     activeTab === 'html' ? 'text/html' : 'text/css';
    
    const blob = new Blob([code], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Descargar proyecto completo
  const downloadCompleteProject = () => {
    const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <style>
${cssCode}
    </style>
</head>
<body>
${htmlCode.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>|<\/body>[\s\S]*?<\/html>/gi, '')}
    
    <script>
${jsCode}
    </script>
</body>
</html>`;

    const blob = new Blob([completeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}-complete.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Subir archivo
  const uploadCode = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        const extension = file.name.split('.').pop()?.toLowerCase();
        
        if (extension === 'js' || extension === 'mjs') {
          setJsCode(content);
          setActiveTab('javascript');
        } else if (extension === 'html' || extension === 'htm') {
          setHtmlCode(content);
          setActiveTab('html');
        } else if (extension === 'css') {
          setCssCode(content);
          setActiveTab('css');
        }
      };
      reader.readAsText(file);
    }
  };

  // Limpiar código
  const clearCurrentCode = () => {
    switch (activeTab) {
      case 'javascript':
        setJsCode('// Clean JavaScript code\n\n');
        break;
      case 'html':
        setHtmlCode(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page</title>
</head>
<body>
    
</body>
</html>`);
        break;
      case 'css':
        setCssCode('/* Clean CSS styles */\n\n');
        break;
    }
    setOutput('');
  };

  // Copiar código
  const copyCurrentCode = async () => {
    try {
      await navigator.clipboard.writeText(getCurrentCode());
    } catch (err) {
      console.error('Error copying code:', err);
    }
  };

  // Controles de tema y fuente
  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark');
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    editorRef.current?.updateOptions({ fontSize: newSize });
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 10);
    setFontSize(newSize);
    editorRef.current?.updateOptions({ fontSize: newSize });
  };

  // Generar vista previa
  const generatePreview = () => {
    if (activeTab === 'javascript') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Preview</title>
    <style>
      body { font-family: 'Inter', sans-serif; padding: 20px; background: #f8fafc; }
      .console { background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h2>🚀 JavaScript Execution</h2>
    <div class="console" id="output">Ready to execute JavaScript...</div>
    <script>
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      let outputDiv = document.getElementById('output');
      outputDiv.innerHTML = '';
      
      console.log = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        outputDiv.innerHTML += '✅ LOG: ' + message + '\\n';
        originalLog(...args);
      };
      
      console.error = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        outputDiv.innerHTML += '❌ ERROR: ' + message + '\\n';
        originalError(...args);
      };
      
      console.warn = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        outputDiv.innerHTML += '⚠️ WARNING: ' + message + '\\n';
        originalWarn(...args);
      };
      
      try {
        ${jsCode}
        if (outputDiv.innerHTML === '') {
          outputDiv.innerHTML = '✨ Code executed successfully! No console output.';
        }
      } catch(e) {
        outputDiv.innerHTML += '💥 EXECUTION ERROR: ' + e.message;
      }
    </script>
</body>
</html>`;
    }
    
    // Para HTML, integrar CSS en el <style> y JavaScript en el <script>
    let cleanHtml = htmlCode;
    
    // Remover referencias a archivos externos (CSS y JS)
    cleanHtml = cleanHtml.replace(/<link[^>]*href=[^>]*\.css[^>]*>/gi, '');
    cleanHtml = cleanHtml.replace(/<script[^>]*src=[^>]*\.js[^>]*><\/script>/gi, '');
    
    // Si el HTML ya tiene CSS y JavaScript integrados, usar tal como está
    if (cleanHtml.includes('<style>') && cleanHtml.includes('<script>')) {
      // Solo integrar el JavaScript del editor si no está ya incluido
      if (!cleanHtml.includes(jsCode.trim().substring(0, 50))) {
        // Agregar o reemplazar el JavaScript en el <script> tag existente
        cleanHtml = cleanHtml.replace(/<script[^>]*>([\s\S]*?)<\/script>/i, () => {
          return `<script>
        // CSS styles will be inserted here by the preview system
        // No external file references needed for the workshop environment
        
        ${jsCode}
    </script>`;
        });
      }
      
      // Agregar o reemplazar CSS en el <style> tag existente
      if (!cleanHtml.includes(cssCode.trim().substring(0, 50))) {
        cleanHtml = cleanHtml.replace(/<style[^>]*>([\s\S]*?)<\/style>/i, () => {
          return `<style>
        /* CSS styles will be inserted here by the preview system */
        /* No external file references needed for the workshop environment */
        
        ${cssCode}
    </style>`;
        });
      }
      
      return cleanHtml;
    }
    
    // Si el HTML no tiene CSS y JS integrados, integrarlos manualmente
    // Extraer title si existe
    const titleMatch = cleanHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'Live Preview';
    
    // Extraer meta viewport si existe
    const viewportMatch = cleanHtml.match(/<meta[^>]*name=['"]*viewport['"]*[^>]*>/i);
    const viewport = viewportMatch ? viewportMatch[0] : '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    
    // Extraer contenido del body
    const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : cleanHtml.replace(/<!DOCTYPE[^>]*>|<\/?html[^>]*>|<\/?head[^>]*>|<\/?body[^>]*>/gi, '');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    ${viewport}
    <title>${title}</title>
    <style>
${cssCode}
    </style>
</head>
<body>
${bodyContent}
    <script>
      try {
        ${jsCode}
      } catch(e) {
        console.error('JavaScript Error:', e);
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #dc2626; color: white; padding: 10px; border-radius: 5px; z-index: 9999; font-family: monospace; max-width: 300px; font-size: 12px;';
        errorDiv.textContent = 'JS Error: ' + e.message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
      }
    </script>
</body>
</html>`;
  };

  const openPreview = () => {
    const generatedContent = generatePreview();
    setPreviewContent(generatedContent);
    setShowPreview(true);
  };

  const openPreviewInNewWindow = () => {
    const previewContent = generatePreview();
    const blob = new Blob([previewContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const getLanguageIcon = () => {
    switch (activeTab) {
      case 'javascript':
        return '📄';
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      default:
        return '📝';
    }
  };

  return (
    <div className="min-h-screen ">
 

      <main className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-6xl">{getLanguageIcon()}</span>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-400   bg-clip-text text-transparent">
                  {fileName}.{activeTab === 'javascript' ? 'js' : activeTab}
                </h1>
                <p className="text-xl text-muted-foreground mt-2">
                  Professional {activeTab.toUpperCase()} Development Environment
                  {lastSaved && ` • Last saved: ${lastSaved}`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* File Tabs */}
          <motion.div 
            className="flex justify-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              onClick={() => setActiveTab('javascript')}
              variant={activeTab === 'javascript' ? 'default' : 'outline'}
              size="lg"
              className="gap-2"
            >
              <Code className="w-5 h-5" />
              JavaScript
            </Button>
            <Button
              onClick={() => setActiveTab('html')}
              variant={activeTab === 'html' ? 'default' : 'outline'}
              size="lg"
              className="gap-2"
            >
              <Globe className="w-5 h-5" />
              HTML
            </Button>
            <Button
              onClick={() => setActiveTab('css')}
              variant={activeTab === 'css' ? 'default' : 'outline'}
              size="lg"
              className="gap-2"
            >
              <Palette className="w-5 h-5" />
              CSS
            </Button>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="mb-6 bg-card/50 backdrop-blur-xl border-border">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* File Operations */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={saveFile}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-orange-600 to-amber-400 hover:from-orange-700 hover:to-amber-500"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Saving...' : `Save ${activeTab.toUpperCase()}`}
                    </Button>
                    
                    {/* Auto-save indicator */}
                    {projectId && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border">
                        {autoSaveStatus === 'saving' && (
                          <>
                            <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-muted-foreground">Auto-saving...</span>
                          </>
                        )}
                        {autoSaveStatus === 'saved' && (
                          <>
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-sm text-green-600">Auto-saved</span>
                          </>
                        )}
                        {autoSaveStatus === 'idle' && lastSaved && (
                          <>
                            <div className="w-3 h-3 bg-gray-400 rounded-full" />
                            <span className="text-sm text-muted-foreground">Last saved: {lastSaved}</span>
                          </>
                        )}
                      </div>
                    )}
                    <Button variant="outline" onClick={downloadCurrentFile}>
                      <Download className="w-4 h-4 mr-2" />
                      Download {activeTab.toUpperCase()}
                    </Button>
                    <Button variant="outline" onClick={downloadCompleteProject}>
                      <Database className="w-4 h-4 mr-2" />
                      Download Project
                    </Button>
                    <Button variant="outline" onClick={uploadCode}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>

                  {/* Code Actions */}
                  <div className="flex flex-wrap gap-2">
                    {activeTab === 'javascript' && (
                      <Button 
                        onClick={executeCode}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Run
                      </Button>
                    )}
                    <Button variant="outline" onClick={openPreview}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" onClick={openPreviewInNewWindow}>
                      <Monitor className="w-4 h-4 mr-2" />
                      New Window
                    </Button>
                    <Button variant="outline" onClick={copyCurrentCode}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" onClick={clearCurrentCode}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>

                  {/* Editor Controls */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={decreaseFontSize} disabled={fontSize <= 10}>
                      <Type className="w-4 h-4" />
                      -
                    </Button>
                    <Button variant="outline" size="sm" onClick={increaseFontSize} disabled={fontSize >= 24}>
                      <Type className="w-4 h-4" />
                      +
                    </Button>
                    <Button variant="outline" size="sm" onClick={toggleTheme}>
                      {theme === 'vs-dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button> 
                  </div>
                </div>

                {/* JavaScript Templates */}
                {activeTab === 'javascript' && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Quick Templates
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={insertConsoleLog}>
                        Console.log
                      </Button>
                      <Button variant="outline" size="sm" onClick={insertFunction}>
                        Function
                      </Button>
                      <Button variant="outline" size="sm" onClick={insertArrowFunction}>
                        Arrow Function
                      </Button>
                      <Button variant="outline" size="sm" onClick={insertAsyncFunction}>
                        Async Function
                      </Button>
                      <Button variant="outline" size="sm" onClick={insertForLoop}>
                        For Loop
                      </Button>
                      <Button variant="outline" size="sm" onClick={insertTryCatch}>
                        Try/Catch
                      </Button>
                      <Button variant="outline" size="sm" onClick={insertEventListener}>
                        Event Listener
                      </Button>
                      <Button variant="outline" size="sm" onClick={insertClass}>
                        Class
                      </Button>
                    </div>
                  </div>
                )}

                {/* Editor Shortcuts */}
                <div className="mt-4 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Keyboard className="w-4 h-4" />
                    Editor Commands
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={triggerCommandPalette}>
                      <Command className="w-4 h-4 mr-1" />
                      Command Palette
                    </Button>
                    <Button onClick={formatCode} variant="outline" size="sm">
                      <TextSelection className="w-4 h-4 mr-1" />
                      Format Code 
                    </Button>
                    <Button variant="outline" size="sm" onClick={triggerAutoComplete}>
                      <Sparkles className="w-4 h-4 mr-1" />
                      Auto Complete
                    </Button>
                    <Button variant="outline" size="sm" onClick={triggerSearch}>
                      <Search className="w-4 h-4 mr-1" />
                      Find
                    </Button>
                    <Button variant="outline" size="sm" onClick={triggerReplace}>
                      <Search className="w-4 h-4 mr-1" />
                      Replace
                    </Button>
                    <Button variant="outline" size="sm" onClick={foldAll}>
                      <Brackets className="w-4 h-4 mr-1" />
                      Fold All
                    </Button>
                    <Button variant="outline" size="sm" onClick={unfoldAll}>
                      <Brackets className="w-4 h-4 mr-1" />
                      Unfold All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="h-[700px] bg-card/50 backdrop-blur-xl border-border overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {activeTab.toUpperCase()} Editor
                    <span className="text-sm font-normal text-muted-foreground ml-auto">
                      Font: {fontSize}px | Theme: {theme}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-80px)]">
                  <Editor
                    height="100%"
                    language={getCurrentLanguage()}
                    value={getCurrentCode()}
                    theme={theme}
                    onChange={(value: string | undefined) => updateCurrentCode(value || '')}
                    onMount={handleEditorDidMount}
                    options={{
                      fontSize: fontSize,
                      minimap: { enabled: true },
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: 'on',
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: 'on',
                      tabCompletion: 'on',
                      quickSuggestions: true,
                      contextmenu: true,
                      mouseWheelZoom: true,
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Output/Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="h-[700px] bg-card/50 backdrop-blur-xl border-border overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    {activeTab === 'javascript' ? 'Console Output' : showPreview ? 'Live Preview' : 'Preview Panel'}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (activeTab === 'javascript') {
                          setOutput('');
                        } else {
                          setShowPreview(false);
                          setPreviewContent('');
                        }
                      }}
                      className="ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-80px)]">
                  {activeTab === 'javascript' ? (
                    <pre className="p-4 text-sm bg-muted font-mono h-full overflow-auto whitespace-pre-wrap">
                      {output || '🎯 Click "Run" to execute your JavaScript code and see the output here...\n\n💡 Pro Tips:\n• Use console.log() to output values\n• Try async/await functions\n• Experiment with modern JavaScript features\n• Check the browser console for additional details'}
                    </pre>
                  ) : showPreview ? (
                    <div className="h-full relative">
                      <iframe
                        srcDoc={previewContent}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                        title="Live Preview"
                      />
                      <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-md p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPreview(false)}
                        >
                          ✕ Close Preview
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center bg-muted">
                      <div className="text-center space-y-4">
                        <Monitor className="w-16 h-16 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold mb-2">Live Preview</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Click "Preview" to see your {activeTab.toUpperCase()} code rendered live
                          </p>
                          <Button onClick={openPreview} className="gap-2">
                            <Eye className="w-4 h-4" />
                            Open Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Features Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Card className="mt-6 bg-card/30 backdrop-blur-xl border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Features & Shortcuts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Keyboard className="w-4 h-4" />
                      Keyboard Shortcuts
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <kbd>Ctrl+S</kbd> - Save file</li>
                      <li>• <kbd>Ctrl+/</kbd> - Toggle comment</li>
                      <li>• <kbd>Ctrl+D</kbd> - Select next occurrence</li>
                      <li>• <kbd>Alt+Shift+F</kbd> - Format code</li>
                      <li>• <kbd>Ctrl+Space</kbd> - Trigger autocomplete</li>
                      <li>• <kbd>F12</kbd> - Go to definition</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Smart Features
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• IntelliSense autocomplete</li>
                      <li>• Syntax highlighting</li>
                      <li>• Error detection</li>
                      <li>• Code folding</li>
                      <li>• Multiple cursors</li>
                      <li>• Bracket matching</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Quick Actions
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Run JavaScript code instantly</li>
                      <li>• Live HTML/CSS preview</li>
                      <li>• Download single files or complete project</li>
                      <li>• Upload and edit existing files</li>
                      <li>• Insert code templates</li>
                      <li>• Smart auto-save every 5 seconds</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".js,.mjs,.jsx,.ts,.tsx,.html,.htm,.css"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </main>
    </div>
  );
}

export default FileEditor;
