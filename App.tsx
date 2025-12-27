
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  History,
  Landmark
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { MOCK_CLIENTS, MOCK_CONTRACTS, MOCK_USER } from './constants';
import { Client, Contract, ContractStatus, InstallmentStatus, User, AuditLog } from './types';
import { formatCurrency, calculatePMT, generateInstallments } from './utils/finance';
import { analyzePortfolio } from './services/geminiService';

// --- Sub-Components ---

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void 
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-slate-50">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const MetricCard: React.FC<{ 
  label: string; 
  value: string; 
  change?: string; 
  positive?: boolean; 
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, change, positive, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
        {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })}
      </div>
      {change && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {change}
        </span>
      )}
    </div>
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
    </div>
  </div>
);

// --- Main Views ---

const DashboardView: React.FC = () => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const data = [
    { name: 'Jan', revenue: 45000, expenses: 32000 },
    { name: 'Feb', revenue: 52000, expenses: 35000 },
    { name: 'Mar', revenue: 48000, expenses: 38000 },
    { name: 'Apr', revenue: 61000, expenses: 42000 },
    { name: 'May', revenue: 55000, expenses: 40000 },
    { name: 'Jun', revenue: 67000, expenses: 45000 },
  ];

  const pieData = [
    { name: 'Ativos', value: 75, color: '#2563eb' },
    { name: 'Em Atraso', value: 15, color: '#f43f5e' },
    { name: 'Quitados', value: 10, color: '#10b981' },
  ];

  const triggerAnalysis = async () => {
    setLoadingAi(true);
    const result = await analyzePortfolio({ portfolioSize: 5000000, defaultRate: 0.05, growth: 0.12 });
    setAiAnalysis(result || "Analysis failed.");
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Carteira Ativa" value="R$ 4.250.000" change="+12%" positive icon={<DollarSign/>} color="bg-blue-600" />
        <MetricCard label="Novos Contratos" value="128" change="+5%" positive icon={<FileText/>} color="bg-indigo-600" />
        <MetricCard label="Inadimplência" value="4.8%" change="-0.5%" positive icon={<AlertCircle/>} color="bg-rose-600" />
        <MetricCard label="Rentabilidade Méd." value="18.2%" change="+2%" positive icon={<TrendingUp/>} color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Crescimento da Carteira" className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Status dos Contratos">
          <div className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full mt-4 space-y-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card title="Limbank AI Insights" className="border-blue-100 bg-blue-50 bg-opacity-30">
        <div className="space-y-4">
          {!aiAnalysis ? (
            <div className="flex flex-col items-center py-8 text-center">
              <BrainCircuit className="w-12 h-12 text-blue-400 mb-4" />
              <h4 className="text-lg font-semibold text-slate-800">Obtenha Análise Estratégica</h4>
              <p className="text-slate-500 max-w-md mx-auto mb-6">Nossa IA analisa tendências de market e comportamento de pagamento para otimizar sua rentabilidade.</p>
              <button 
                onClick={triggerAnalysis}
                disabled={loadingAi}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loadingAi ? 'Processando...' : 'Analisar Carteira'}
              </button>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Relatório Gerado pela IA</span>
                <button onClick={() => setAiAnalysis(null)} className="text-slate-400 hover:text-slate-600 text-sm">Limpar</button>
              </div>
              <div className="text-slate-700 whitespace-pre-wrap text-sm leading-relaxed bg-white p-4 rounded-lg border border-blue-100">
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const ClientsView: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.taxId.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou CPF..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      <Card title="Base de Clientes" className="border-none shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Documento</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Renda</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Score</th>
                <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{client.name}</div>
                        <div className="text-xs text-slate-500">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{client.taxId}</td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-900">{formatCurrency(client.income)}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      client.creditScore > 700 ? 'bg-emerald-100 text-emerald-700' : 
                      client.creditScore > 500 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {client.creditScore}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Ver Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const ContractsView: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Contratos</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Novo Contrato</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {contracts.map(contract => (
          <div key={contract.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">ID: {contract.id}</span>
                <h4 className="text-lg font-bold text-slate-900 mt-1">
                  {MOCK_CLIENTS.find(c => c.id === contract.clientId)?.name}
                </h4>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                {contract.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
              <div>
                <p className="text-xs text-slate-400 mb-1">Valor do Crédito</p>
                <p className="font-bold text-slate-900">{formatCurrency(contract.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Taxa Mensal</p>
                <p className="font-bold text-slate-900">{contract.interestRate}% am</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Prazo</p>
                <p className="font-bold text-slate-900">{contract.term} meses</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Saldo Devedor</p>
                <p className="font-bold text-rose-600">{formatCurrency(contract.remainingBalance)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Progresso de Pagamento</span>
                <span className="font-bold text-slate-700">32%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[32%]" />
              </div>
            </div>

            <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2">
              <span>Gerenciar Parcelas</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminView: React.FC = () => {
  const [logs] = useState<AuditLog[]>([
    { id: '1', userId: 'u1', userName: 'Admin', action: 'Login', timestamp: '2023-11-15 08:30', details: 'Acesso via Desktop' },
    { id: '2', userId: 'u1', userName: 'Admin', action: 'Novo Contrato', timestamp: '2023-11-15 10:15', details: 'Contrato CT1 criado para João Silva' },
    { id: '3', userId: 'u2', userName: 'Carlos Op', action: 'Alteração Cadastro', timestamp: '2023-11-15 11:00', details: 'Alteração de renda Maria Oliveira' },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Administração e Segurança</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Níveis de Acesso">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100">
              <div>
                <p className="font-bold text-slate-900">Admin</p>
                <p className="text-xs text-slate-500">Controle total do sistema</p>
              </div>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center border border-slate-100 opacity-60">
              <div>
                <p className="font-bold text-slate-900">Operador</p>
                <p className="text-xs text-slate-500">Gestão de contratos e clientes</p>
              </div>
              <Users className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </Card>

        <Card title="Logs de Auditoria">
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="flex space-x-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="mt-1">
                  <History className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-slate-900">{log.userName}</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-blue-600 font-medium mb-1">{log.action}</p>
                  <p className="text-xs text-slate-500">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- App Shell ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'contracts' | 'reports' | 'admin'>('dashboard');
  const [user] = useState<User>(MOCK_USER);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'clients': return <ClientsView />;
      case 'contracts': return <ContractsView />;
      case 'admin': return <AdminView />;
      default: return <div className="p-10 text-center text-slate-400">Em desenvolvimento...</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Landmark className="w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tighter text-blue-900">LIMBANK</span>
        </div>
        <button className="p-2 text-slate-500">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-blue-900">LIMBANK</span>
          </div>

          <nav className="space-y-2">
            <SidebarItem 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            <SidebarItem 
              icon={<Users className="w-5 h-5" />} 
              label="Clientes" 
              active={activeTab === 'clients'} 
              onClick={() => setActiveTab('clients')} 
            />
            <SidebarItem 
              icon={<FileText className="w-5 h-5" />} 
              label="Contratos" 
              active={activeTab === 'contracts'} 
              onClick={() => setActiveTab('contracts')} 
            />
            <SidebarItem 
              icon={<BarChart3 className="w-5 h-5" />} 
              label="Relatórios" 
              active={activeTab === 'reports'} 
              onClick={() => setActiveTab('reports')} 
            />
            <SidebarItem 
              icon={<Settings className="w-5 h-5" />} 
              label="Admin" 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')} 
            />
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors font-medium">
            <LogOut className="w-5 h-5" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
        <header className="mb-8 hidden md:flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <p className="text-slate-500 text-sm mt-1">Bem-vindo de volta, {user.name.split(' ')[0]}.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Clock className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600">Sistema Online</span>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default App;
