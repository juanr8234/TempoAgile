// --- Data Store & State Management with Reactivity ---

const STORAGE_KEY = 'cadence_quality_store';

// --- Seeds: Initial Realistic Data ---
const DEFAULT_MEMBERS = [
  { id: 'm1', name: 'Juan R.', email: 'juanr8234@gmail.com', avatar: 'J', color: '#FF7A8A', workspaceIds: ['w1', 'w3'] },
  { id: 'm2', name: 'María G.', email: 'maria.g@nikolas.studio', avatar: 'M', color: '#6D5BFF', workspaceIds: ['w1'] },
  { id: 'm3', name: 'Alejandro P.', email: 'ale.p@nikolas.studio', avatar: 'A', color: '#4F8A6E', workspaceIds: ['w1'] },
  { id: 'm4', name: 'Lucía S.', email: 'lucia.s@nikolas.studio', avatar: 'L', color: '#FFB36E', workspaceIds: ['w2'] },
  { id: 'm5', name: 'Santiago M.', email: 'santiago@nikolas.studio', avatar: 'S', color: '#b59cff', workspaceIds: ['w2'] },
  { id: 'm6', name: 'Nicolás F.', email: 'nicolas@nikolas.studio', avatar: 'N', color: '#7CC5A2', workspaceIds: ['w1', 'w2'] }
];

const DEFAULT_PROJECTS = [
  {
    id: 'p1',
    workspaceId: 'w1',
    name: 'Ecommerce Deportes',
    sprint: 'Sprint #14',
    status: 'activo',
    methodology: 'Scrum',
    lastSync: 'hace 2 min',
    syncStatus: 'excellent',
    clientValidated: true,
    members: ['m1', 'm2', 'm3'],
    metricsHistory: [
      { sprint: 'S11', q: 11 },
      { sprint: 'S12', q: 10.8 },
      { sprint: 'S13', q: 9.8 },
      { sprint: 'S14', q: 10 }
    ]
  },
  {
    id: 'p2',
    workspaceId: 'w2',
    name: 'API Pagos v2',
    sprint: 'Sprint #7',
    status: 'activo',
    methodology: 'Kanban',
    lastSync: 'hace 12 min',
    syncStatus: 'excellent',
    clientValidated: true,
    members: ['m4', 'm5', 'm6'],
    metricsHistory: [
      { sprint: 'S4', q: 12 },
      { sprint: 'S5', q: 13 },
      { sprint: 'S6', q: 13.5 },
      { sprint: 'S7', q: 14 }
    ]
  },
  {
    id: 'p3',
    workspaceId: 'w1',
    name: 'App Mobile',
    sprint: 'Sprint #21',
    status: 'activo',
    methodology: 'Scrum',
    lastSync: 'hace 3 h',
    syncStatus: 'risk',
    clientValidated: false,
    members: ['m1', 'm6'],
    metricsHistory: [
      { sprint: 'S18', q: 9 },
      { sprint: 'S19', q: 8.5 },
      { sprint: 'S20', q: 7.2 },
      { sprint: 'S21', q: 7 }
    ]
  },
  {
    id: 'p4',
    workspaceId: 'w1',
    name: 'Portal Cliente',
    sprint: 'Sprint #2',
    status: 'arranque',
    methodology: 'Híbrido',
    lastSync: 'hace 38 min',
    syncStatus: 'good',
    clientValidated: false,
    members: ['m1', 'm4'],
    metricsHistory: [
      { sprint: 'S1', q: 4.5 },
      { sprint: 'S2', q: 5 }
    ]
  },
  {
    id: 'p5',
    workspaceId: 'w2',
    name: 'Migración Postgres',
    sprint: 'Sprint #5',
    status: 'activo',
    methodology: 'XP',
    lastSync: 'ahora',
    syncStatus: 'excellent',
    clientValidated: true,
    members: ['m3', 'm5'],
    metricsHistory: [
      { sprint: 'S3', q: 10.5 },
      { sprint: 'S4', q: 11.2 },
      { sprint: 'S5', q: 12 }
    ]
  },
  {
    id: 'p6',
    workspaceId: 'w3',
    name: 'Rediseño Landing',
    sprint: 'Sprint #1',
    status: 'planificado',
    methodology: 'Kanban',
    lastSync: 'aún sin actividad',
    syncStatus: 'neutral',
    clientValidated: false,
    members: ['m4'],
    metricsHistory: [
      { sprint: 'S1', q: 2 }
    ]
  }
];

const DEFAULT_STORIES = [
  // Ecommerce Deportes
  { id: 'us-140', projectId: 'p1', code: 'US-140', title: 'Pasarela de pagos con Tarjeta de Crédito', points: 8, status: 'Completada', hasAcceptanceCriteria: true, acText: '1. Transacción exitosa con Visa y Mastercard.\n2. Rechazo correcto ante fondos insuficientes.' },
  { id: 'us-141', projectId: 'p1', code: 'US-141', title: 'Filtro por marca y precio en catálogo', points: 5, status: 'Completada', hasAcceptanceCriteria: true, acText: '1. Filtros combinados cargan en <1s.\n2. Opción de limpiar filtros activa.' },
  { id: 'us-142', projectId: 'p1', code: 'US-142', title: 'Integración de notificaciones de envío por WhatsApp', points: 3, status: 'En Proceso', hasAcceptanceCriteria: false, acText: '' },
  { id: 'us-148', projectId: 'p1', code: 'US-148', title: 'Historial de compras del usuario', points: 5, status: 'En Proceso', hasAcceptanceCriteria: false, acText: '' },
  { id: 'us-153', projectId: 'p1', code: 'US-153', title: 'Recuperar contraseña vía mail', points: 2, status: 'En Proceso', hasAcceptanceCriteria: false, acText: '' },
  // Unestimated stories for Ecommerce Deportes (Insight #1)
  { id: 'us-160', projectId: 'p1', code: 'US-160', title: 'Añadir productos al carrito desde Home', points: null, status: 'Pendiente', hasAcceptanceCriteria: true, acText: '1. Botón comprar en listado.\n2. Actualización de contador de header en vivo.' },
  { id: 'us-161', projectId: 'p1', code: 'US-161', title: 'Exportar facturas en PDF', points: null, status: 'Pendiente', hasAcceptanceCriteria: true, acText: '1. Botón visible en detalles de orden.\n2. PDF contiene datos de facturación oficial.' },
  { id: 'us-162', projectId: 'p1', code: 'US-162', title: 'Cupón de descuento en Checkout', points: null, status: 'Pendiente', hasAcceptanceCriteria: true, acText: '1. Validar cupones de un solo uso.\n2. Aplicar descuento porcentual y fijo.' },

  // API Pagos v2
  { id: 'us-201', projectId: 'p2', code: 'US-201', title: 'Webhooks de eventos de cobro', points: 5, status: 'Completada', hasAcceptanceCriteria: true, acText: '1. Reintentos ante error 5xx.\n2. Firma HMAC de seguridad.' },
  { id: 'us-202', projectId: 'p2', code: 'US-202', title: 'Endpoints de consulta de saldo', points: 3, status: 'Completada', hasAcceptanceCriteria: true, acText: '1. Cache de 15s para requests duplicadas.\n2. Rate limit a 100 req/min.' },
  { id: 'us-203', projectId: 'p2', code: 'US-203', title: 'Encriptación de credenciales PCI-DSS', points: 8, status: 'Completada', hasAcceptanceCriteria: true, acText: '1. HSM simulación.\n2. Logs auditables.' },

  // App Mobile
  { id: 'us-301', projectId: 'p3', code: 'US-301', title: 'Login con FaceID / TouchID', points: 5, status: 'Pendiente', hasAcceptanceCriteria: true, acText: '1. Integración biométrica nativa de iOS y Android.' },
  { id: 'us-302', projectId: 'p3', code: 'US-302', title: 'Modo Offline en base de datos local', points: 8, status: 'En Proceso', hasAcceptanceCriteria: false, acText: '' },

  // Portal Cliente
  { id: 'us-401', projectId: 'p4', code: 'US-401', title: 'Subida de logos de empresa', points: 3, status: 'Pendiente', hasAcceptanceCriteria: false, acText: '' },
  { id: 'us-402', projectId: 'p4', code: 'US-402', title: 'Formulario de contacto soporte', points: 2, status: 'En Proceso', hasAcceptanceCriteria: true, acText: '1. Validación de email y teléfono.' },

  // Migración Postgres
  { id: 'us-501', projectId: 'p5', code: 'US-501', title: 'Dump de tablas históricas', points: 8, status: 'Completada', hasAcceptanceCriteria: true, acText: '1. Migrar 10M de filas con <5m downtime.' },
  { id: 'us-502', projectId: 'p5', code: 'US-502', title: 'Optimizar índices de queries complejas', points: 5, status: 'Completada', hasAcceptanceCriteria: true, acText: '1. Queries bajan de 1500ms a <80ms.' },

  // Rediseño Landing
  { id: 'us-601', projectId: 'p6', code: 'US-601', title: 'Hero Section con video animado', points: 5, status: 'Pendiente', hasAcceptanceCriteria: false, acText: '' },
  { id: 'us-602', projectId: 'p6', code: 'US-602', title: 'Sección de testimonios dinámicos', points: 3, status: 'Pendiente', hasAcceptanceCriteria: false, acText: '' }
];

const DEFAULT_INSIGHTS = [
  {
    id: 'in-1',
    projectId: 'p1',
    category: 'crit',
    title: '3 US sin estimar en el sprint que termina mañana',
    body: 'Subir M1 +2 si las estimás antes del cierre. Tomó 4 min en promedio en sprints anteriores.',
    actionLabel: 'Estimar ahora →',
    actionType: 'estimate',
    completed: false
  },
  {
    id: 'in-2',
    projectId: 'p1',
    category: 'warn',
    title: 'M4 cayó 30% en los últimos 3 sprints',
    body: 'Principal causa: las US dejaron de incluir criterios de aceptación. Mirá US #142, #148, #153.',
    actionLabel: 'Ver detalle',
    actionType: 'acceptance_criteria',
    completed: false
  },
  {
    id: 'in-3',
    projectId: 'p3',
    category: 'suggest',
    title: 'El cliente no validó el último release',
    body: 'Mandale un magic-link para que apruebe el sprint #20 (impacta M3).',
    actionLabel: 'Enviar link',
    actionType: 'magic_link',
    completed: false
  },
  {
    id: 'in-4',
    projectId: 'p2',
    category: 'info',
    title: '¡Mejor sprint del trimestre!',
    body: 'Cerraron M1–M4 en verde por primera vez. Compartir con el equipo en retro.',
    actionLabel: 'Generar resumen',
    actionType: 'sprint_summary',
    completed: false
  }
];

const DEFAULT_SETTINGS = {
  weights: { m1: 25, m2: 25, m3: 25, m4: 25 },
  integrations: { github: true, jira: false, slack: true }
};

const DEFAULT_WORKSPACES = [
  { id: 'w1', name: 'Nikolas Studio', membersCount: 8, logo: 'N', active: true },
  { id: 'w2', name: 'Acme Software', membersCount: 15, logo: 'A', active: false },
  { id: 'w3', name: 'Proyectos Personales', membersCount: 1, logo: 'P', active: false }
];

// --- Store Implementation ---
class Store {
  constructor() {
    this.listeners = [];
    this.loadFromStorage();
  }

  // --- Load and Save DB ---
  loadFromStorage() {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        const hasWorkspaceIdsOnMembers = parsed.members && parsed.members.length > 0 && parsed.members[0].workspaceIds;
        const hasWorkspaceIdOnProjects = parsed.projects && parsed.projects.length > 0 && parsed.projects[0].workspaceId;

        // Migración/Reset si detecta que es el esquema antiguo sin workspaceId en proyectos o workspaceIds en miembros
        if (!hasWorkspaceIdOnProjects || !hasWorkspaceIdsOnMembers) {
          this.initializeSeeds();
        } else {
          this.state = parsed;
        }
      } else {
        this.initializeSeeds();
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
      this.initializeSeeds();
    }
  }

  initializeSeeds() {
    this.state = {
      currentUser: null,
      workspaces: DEFAULT_WORKSPACES,
      projects: DEFAULT_PROJECTS,
      stories: DEFAULT_STORIES,
      insights: DEFAULT_INSIGHTS,
      members: DEFAULT_MEMBERS,
      settings: DEFAULT_SETTINGS
    };
    this.saveToStorage();
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }

  // --- Pub-Sub Mechanics ---
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveToStorage();
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch (err) {
        console.error('Error in subscription callback:', err);
      }
    });
  }

  // --- State Selectors ---
  getActiveWorkspace() {
    return this.state.workspaces.find(w => w.active) || this.state.workspaces[0];
  }

  getWorkspaces() {
    return this.state.workspaces;
  }

  getProjects() {
    const activeWs = this.getActiveWorkspace();
    // Filtrar proyectos que pertenezcan al Workspace activo
    return this.state.projects
      .filter(p => p.workspaceId === activeWs.id)
      .map(project => {
        const metrics = this.calculateProjectMetrics(project.id);
        const qualityScore = parseFloat(
          (
            (metrics.m1 * this.state.settings.weights.m1 +
              metrics.m2 * this.state.settings.weights.m2 +
              metrics.m3 * this.state.settings.weights.m3 +
              metrics.m4 * this.state.settings.weights.m4) /
            100
          ).toFixed(1)
        );

        return {
          ...project,
          metrics,
          qualityScore
        };
      });
  }

  getProjectById(id) {
    const project = this.state.projects.find(p => p.id === id);
    if (!project) return null;

    const metrics = this.calculateProjectMetrics(id);
    const qualityScore = parseFloat(
      (
        (metrics.m1 * this.state.settings.weights.m1 +
          metrics.m2 * this.state.settings.weights.m2 +
          metrics.m3 * this.state.settings.weights.m3 +
          metrics.m4 * this.state.settings.weights.m4) /
        100
      ).toFixed(1)
    );

    return {
      ...project,
      metrics,
      qualityScore
    };
  }

  getProjectStories(projectId) {
    return this.state.stories.filter(s => s.projectId === projectId);
  }

  getInsights() {
    const activeWs = this.getActiveWorkspace();
    const activeProjectIds = this.state.projects
      .filter(p => p.workspaceId === activeWs.id)
      .map(p => p.id);
    
    // Solo mostramos insights de los proyectos activos y que no estén completados
    return this.state.insights.filter(
      i => !i.completed && activeProjectIds.includes(i.projectId)
    );
  }

  getMembers() {
    const activeWs = this.getActiveWorkspace();
    // Solo mostramos los miembros del equipo que pertenezcan al Workspace activo
    return this.state.members.filter(m => m.workspaceIds && m.workspaceIds.includes(activeWs.id));
  }

  getAllMembers() {
    return this.state.members;
  }

  getSettings() {
    return this.state.settings;
  }

  // --- Quality Calculus Engine ---
  calculateProjectMetrics(projectId) {
    const stories = this.state.stories.filter(s => s.projectId === projectId);
    const projectObj = this.state.projects.find(p => p.id === projectId);

    // M1: Entregables (Basado en la proporción de puntos completados frente a puntos estimados)
    // También castiga si hay historias sin estimar.
    let m1 = 0;
    const estimatedStories = stories.filter(s => s.points !== null);
    const unestimatedStoriesCount = stories.filter(s => s.points === null).length;

    if (estimatedStories.length > 0) {
      const totalPoints = estimatedStories.reduce((acc, curr) => acc + curr.points, 0);
      const completedPoints = estimatedStories
        .filter(s => s.status === 'Completada')
        .reduce((acc, curr) => acc + curr.points, 0);
      
      const ratio = totalPoints > 0 ? completedPoints / totalPoints : 0;
      m1 = ratio * 16;
      
      // Castigo por historias desestimadas en sprint activo: -1 punto por historia sin estimar (mínimo 0)
      m1 = Math.max(0, m1 - (unestimatedStoriesCount * 1.2));
    } else {
      m1 = unestimatedStoriesCount > 0 ? 2 : 12; // Base baja si no hay nada estimado
    }

    // M2: Equipo (Basado en la distribución del backlog, historias asignadas y sync)
    // Para simplificar, calculamos según la proporción de miembros asignados y sprint estable.
    let m2 = 12.5; // Por defecto estable
    if (projectId === 'p1') m2 = 14.1; // Deportes
    if (projectId === 'p2') m2 = 14.4; // Pagos v2
    if (projectId === 'p3') m2 = 11.2; // App Mobile
    if (projectId === 'p4') m2 = 9.6;  // Portal Cliente
    if (projectId === 'p5') m2 = 12.5; // Postgres
    if (projectId === 'p6') m2 = 5.6;  // Landing

    // Si hay algún cambio local, re-ajustamos levemente para simular actividad
    const completedCount = stories.filter(s => s.status === 'Completada').length;
    if (stories.length > 0) {
      m2 = Math.min(16, m2 + (completedCount / stories.length) * 1.5);
    }

    // M3: Cliente (Basado en si el cliente validó el release actual)
    let m3 = 8;
    if (projectObj) {
      m3 = projectObj.clientValidated ? 14.8 : 6.0;
      if (projectId === 'p2') m3 = 12.8; // Pagos v2
      if (projectId === 'p5') m3 = 14.4; // Postgres
      if (projectId === 'p6') m3 = 3.2;  // Landing
    }

    // M4: Requerimientos (Basado en el porcentaje de historias que tienen Criterios de Aceptación)
    let m4 = 16;
    if (stories.length > 0) {
      const storiesWithAc = stories.filter(s => s.hasAcceptanceCriteria);
      const ratio = storiesWithAc.length / stories.length;
      m4 = ratio * 16;
    }

    // Ajustar precisión a 1 decimal y limitar a rango [0, 16]
    return {
      m1: Math.min(16, Math.max(0, parseFloat(m1.toFixed(1)))),
      m2: Math.min(16, Math.max(0, parseFloat(m2.toFixed(1)))),
      m3: Math.min(16, Math.max(0, parseFloat(m3.toFixed(1)))),
      m4: Math.min(16, Math.max(0, parseFloat(m4.toFixed(1))))
    };
  }

  getGlobalWorkspaceMetrics() {
    const projects = this.getProjects();
    if (projects.length === 0) return { score: 0, label: 'Sin datos', delta: 0 };

    const sum = projects.reduce((acc, curr) => acc + curr.qualityScore, 0);
    const average = parseFloat((sum / projects.length).toFixed(1));

    let label = 'Deficiente';
    if (average >= 12) label = 'Excelente';
    else if (average >= 6) label = 'Aceptable';
    else if (average >= 0) label = 'Riesgo';

    return {
      score: average,
      label,
      delta: '+1.2' // Hardcoded delta del sprint vs anterior
    };
  }

  // --- State Mutators ---
  switchWorkspace(workspaceId) {
    this.state.workspaces.forEach(w => {
      w.active = w.id === workspaceId;
    });
    this.notify();
  }

  createStory({ projectId, title, points, hasAcceptanceCriteria, acText }) {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    const stories = this.getProjectStories(projectId);
    const codeNum = 100 + stories.length + 1;
    const code = `US-${codeNum}`;

    const newStory = {
      id: `us-${Date.now()}`,
      projectId,
      code,
      title,
      points: points ? parseInt(points, 10) : null,
      status: 'Pendiente',
      hasAcceptanceCriteria: !!hasAcceptanceCriteria,
      acText: acText || ''
    };

    this.state.stories.push(newStory);
    
    // Si se agrega una historia con criterios, puede impactar positivamente las tendencias
    // Disparamos notificaciones y recalculamos.
    this.notify();
    return newStory;
  }

  estimateStory(storyId, points) {
    const story = this.state.stories.find(s => s.id === storyId);
    if (story) {
      story.points = parseInt(points, 10);
      
      // Verificar si el proyecto tiene historias sin estimar pendientes en sprint.
      // Si ya no quedan historias sin estimar para este proyecto, marcar Insight de estimar como completado.
      this.checkEstimationInsight(story.projectId);
      
      this.notify();
      return true;
    }
    return false;
  }

  checkEstimationInsight(projectId) {
    const stories = this.state.stories.filter(s => s.projectId === projectId);
    const unestimatedCount = stories.filter(s => s.points === null).length;
    if (unestimatedCount === 0) {
      const insight = this.state.insights.find(i => i.projectId === projectId && i.actionType === 'estimate');
      if (insight) {
        insight.completed = true;
      }
    }
  }

  saveAcceptanceCriteria(storyId, acText) {
    const story = this.state.stories.find(s => s.id === storyId);
    if (story) {
      story.acText = acText;
      story.hasAcceptanceCriteria = acText.trim().length > 0;

      // Evaluar si ya se solucionó el problema de falta de criterios en el Ecommerce Deportes
      if (story.projectId === 'p1') {
        const targetIds = ['us-142', 'us-148', 'us-153'];
        const allFixed = targetIds.every(id => {
          const s = this.state.stories.find(st => st.id === id);
          return s && s.hasAcceptanceCriteria;
        });

        if (allFixed) {
          const insight = this.state.insights.find(i => i.projectId === 'p1' && i.actionType === 'acceptance_criteria');
          if (insight) {
            insight.completed = true;
          }
        }
      }

      this.notify();
      return true;
    }
    return false;
  }

  validateClientRelease(projectId) {
    const project = this.state.projects.find(p => p.id === projectId);
    if (project) {
      project.clientValidated = true;

      // Marcar insight de magic link correspondiente como completado
      const insight = this.state.insights.find(i => i.projectId === projectId && i.actionType === 'magic_link');
      if (insight) {
        insight.completed = true;
      }

      this.notify();
      return true;
    }
    return false;
  }

  dismissInsight(insightId) {
    const insight = this.state.insights.find(i => i.id === insightId);
    if (insight) {
      insight.completed = true;
      this.notify();
      return true;
    }
    return false;
  }

  saveSettings(weights, integrations) {
    this.state.settings.weights = { ...weights };
    this.state.settings.integrations = { ...integrations };
    this.notify();
  }

  getCurrentUser() {
    return this.state.currentUser || null;
  }

  login(email, name) {
    const cleanEmail = email.trim().toLowerCase();
    const existingMember = this.state.members.find(m => m.email.trim().toLowerCase() === cleanEmail);

    if (existingMember) {
      this.state.currentUser = {
        id: existingMember.id,
        name: existingMember.name,
        email: existingMember.email,
        avatar: existingMember.avatar,
        color: existingMember.color
      };
    } else {
      const firstLetter = (name || email || 'U').charAt(0).toUpperCase();
      const colors = ['#00F2FE', '#7F00FF', '#FF7A8A', '#6D5BFF', '#4F8A6E', '#FFB36E'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      this.state.currentUser = {
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email: email,
        avatar: firstLetter,
        color: randomColor
      };
    }
    
    this.notify();
    return this.state.currentUser;
  }

  logout() {
    this.state.currentUser = null;
    this.notify();
  }
}

export const store = new Store();
