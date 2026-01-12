const fs = require('fs');
const path = require('path');

const modulesDir = '/workspaces/SMART_APP_v3/out/modules';

const navBar = `
  <!-- Fixed Top Navigation -->
  <nav class="top-nav">
    <div class="nav-left">
      <div class="nav-logo" onclick="goHome()">
        <svg viewBox="0 0 100 100">
          <path d="M30 55 Q30 65 35 70 Q45 80 50 80 Q55 80 65 70 Q70 65 70 55 L70 50 Q70 45 65 42 Q55 35 50 35 Q45 35 35 42 Q30 45 30 50 Z" fill="#1976D2"/>
          <path d="M15 40 L50 25 L85 40 L50 55 Z" fill="#2196F3"/>
          <path d="M15 40 L50 55 L50 57 L13 41 Z" fill="#1565C0"/>
          <path d="M85 40 L50 55 L50 57 L87 41 Z" fill="#1565C0"/>
          <circle cx="50" cy="40" r="3" fill="#0D47A1"/>
          <path d="M50 40 Q60 45 70 40 Q80 35 82 55 Q84 65 82 75" stroke="#1A1A1A" stroke-width="2" fill="none"/>
          <rect x="78" y="73" width="8" height="4" rx="1" fill="#2A2A2A"/>
          <path d="M79 77 L79 88 Q82 90 85 88 L85 77" fill="#1A1A1A"/>
        </svg>
      </div>
      <span class="page-title" id="page-title">Módulo</span>
    </div>
    <div class="nav-right">
      <button class="nav-btn" onclick="goHome()" title="Inicio">🏠</button>
      <button class="nav-btn" onclick="goToModule('resumen')" title="Resumen">📝</button>
      <button class="nav-btn" onclick="goToModule('mapa-mental')" title="Mapa Mental">🧠</button>
      <button class="nav-btn" onclick="goToModule('cuestionario')" title="Cuestionario">❓</button>
      <button class="nav-btn" onclick="goToModule('evaluacion')" title="Evaluación">📋</button>
    </div>
  </nav>
`;

const navScript = `
  <script>
    // Initialize theme from localStorage
    (function() {
      var theme = localStorage.getItem('smartstudent_theme') || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    })();
    
    function goBack() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/dashboard-static.html';
      }
    }
    
    function goHome() {
      window.location.href = '/dashboard-static.html';
    }
    
    function goToModule(module) {
      window.location.href = '/modules/' + module + '.html';
    }
  </script>
`;

const moduleTitles = {
  'resumen': 'Resúmenes',
  'mapa-mental': 'Mapas Conceptuales',
  'cuestionario': 'Cuestionarios',
  'evaluacion': 'Evaluaciones',
  'tareas': 'Tareas',
  'pruebas': 'Pruebas',
  'slides': 'Presentaciones',
  'libros': 'Biblioteca Digital',
  'comunicaciones': 'Comunicaciones',
  'calificaciones': 'Calificaciones',
  'asistencia': 'Asistencia',
  'estadisticas': 'Estadísticas',
  'gestion-usuarios': 'Usuarios',
  'solicitudes': 'Solicitudes',
  'calendario': 'Calendario',
  'financiera': 'Financiera'
};

const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(modulesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const moduleName = file.replace('.html', '');
  const title = moduleTitles[moduleName] || moduleName;
  
  // Add data-theme to html tag
  content = content.replace('<html lang="es">', '<html lang="es" data-theme="dark">');
  
  // Check if nav already exists
  if (content.includes('class="top-nav"')) {
    console.log('Skipping ' + file + ' - already has nav');
    return;
  }
  
  // Insert nav after <body>
  const customNav = navBar.replace('id="page-title">Módulo</span>', 'id="page-title">' + title + '</span>');
  content = content.replace('<body>', '<body>' + customNav);
  
  // Add script before </body> if not already present
  if (!content.includes('function goToModule')) {
    content = content.replace('</body>', navScript + '\n</body>');
  }
  
  fs.writeFileSync(filePath, content);
  console.log('Updated: ' + file);
});

console.log('\\n✅ All modules updated with fixed navigation bar!');
