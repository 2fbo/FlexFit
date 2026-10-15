import React, { useState, useEffect } from 'react';
import { Ticket, User, Page, Priority, TicketStatus } from './types';
import { 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Plus, 
  LogOut, 
  LogIn, 
  Check, 
  Filter,
  Download 
} from 'lucide-react';

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 1,
    equipment: 'Treadmill 2',
    location: 'Cardio Area',
    issue: 'Belt slipping at high speed',
    priority: 'High',
    status: 'Open',
    dateReported: '2026-09-15'
  },
  {
    id: 2,
    equipment: 'Rowing Machine 1',
    location: 'Main Gym Floor',
    issue: 'Display screen not turning on',
    priority: 'Medium',
    status: 'Open',
    dateReported: '2026-09-16'
  },
  {
    id: 3,
    equipment: 'Cable Crossover',
    location: 'Free Weights Area',
    issue: 'Right cable frayed near handle',
    priority: 'High',
    status: 'Open',
    dateReported: '2026-09-16'
  },
  {
    id: 4,
    equipment: 'Spin Bike 4',
    location: 'Studio 1',
    issue: 'Resistance knob stuck',
    priority: 'Low',
    status: 'Resolved',
    dateReported: '2026-09-14'
  },
  {
    id: 5,
    equipment: 'Chest Press Machine',
    location: 'Resistance Area',
    issue: 'Seat adjustment pin missing',
    priority: 'Medium',
    status: 'Resolved',
    dateReported: '2026-09-13'
  }
];

export default function App() {
  // Navigation
  const [currentPage, setCurrentPage] = useState<Page>('home');
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('flexfit_user');
    return saved ? JSON.parse(saved) : { username: 'admin', role: 'Manager' };
  });

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Tickets state
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem('flexfit_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Add Ticket form state
  const [newEquipment, setNewEquipment] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newIssue, setNewIssue] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');
  const [addSuccess, setAddSuccess] = useState(false);

  // Save tickets
  useEffect(() => {
    localStorage.setItem('flexfit_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername === 'admin' && loginPassword === 'password123') {
      const user: User = { username: 'admin', role: 'Manager' };
      setCurrentUser(user);
      localStorage.setItem('flexfit_user', JSON.stringify(user));
      setLoginError('');
      setCurrentPage('dashboard');
    } else {
      setLoginError('Invalid username or password. (Use admin / password123)');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('flexfit_user');
    setCurrentPage('home');
  };

  // Handle Add Ticket (INSERT query simulation)
  const handleAddTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEquipment || !newLocation || !newIssue) {
      alert('Please fill in all required fields.');
      return;
    }

    const newTicket: Ticket = {
      id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
      equipment: newEquipment,
      location: newLocation,
      issue: newIssue,
      priority: newPriority,
      status: 'Open',
      dateReported: new Date().toISOString().split('T')[0]
    };

    setTickets([newTicket, ...tickets]);
    setNewEquipment('');
    setNewLocation('');
    setNewIssue('');
    setNewPriority('Medium');
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
      setCurrentPage('dashboard');
    }, 1000);
  };

  // Handle Resolve (UPDATE query simulation)
  const handleResolveTicket = (id: number) => {
    if (window.confirm('Are you sure you want to mark this ticket as Resolved?')) {
      setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    }
  };

  // Statistics calculation
  const totalJobs = tickets.length;
  const openJobs = tickets.filter(t => t.status === 'Open').length;
  const resolvedJobs = tickets.filter(t => t.status === 'Resolved').length;

  // Filtered tickets
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.equipment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.issue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div id="app-wrapper" className="min-h-screen bg-[#f4f6f9] text-[#333333] flex flex-col font-sans antialiased">
      
      {/* Navigation Bar */}
      <header id="site-header" className="bg-[#2b4c7e] text-white py-3.5 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center font-bold text-white text-lg">
              F
            </div>
            <button 
              id="brand-link"
              onClick={() => setCurrentPage('home')}
              className="text-xl font-bold text-white hover:text-blue-100 text-left cursor-pointer"
            >
              FlexFit Tracker
            </button>
          </div>

          <nav id="main-nav" className="flex items-center gap-4 text-sm flex-wrap">
            <button 
              id="nav-home"
              onClick={() => setCurrentPage('home')}
              className={`hover:underline cursor-pointer ${currentPage === 'home' ? 'text-white font-bold underline' : 'text-blue-100'}`}
            >
              Home
            </button>
            
            {currentUser ? (
              <>
                <button 
                  id="nav-dashboard"
                  onClick={() => setCurrentPage('dashboard')}
                  className={`hover:underline cursor-pointer ${currentPage === 'dashboard' ? 'text-white font-bold underline' : 'text-blue-100'}`}
                >
                  Dashboard
                </button>
                <button 
                  id="nav-add-ticket"
                  onClick={() => setCurrentPage('add-ticket')}
                  className={`hover:underline cursor-pointer ${currentPage === 'add-ticket' ? 'text-white font-bold underline' : 'text-blue-100'}`}
                >
                  + Add Ticket
                </button>
                
                <span id="user-display" className="text-xs text-blue-200 hidden md:inline border-l border-blue-800 pl-3">
                  Staff: <strong>{currentUser.username}</strong>
                </span>

                <a 
                  id="nav-download-zip"
                  href="/flexfit-gym-tracker.zip"
                  download="flexfit-gym-tracker.zip"
                  title="Download Project ZIP"
                  className="bg-blue-800 hover:bg-blue-900 text-white text-xs px-2.5 py-1 rounded cursor-pointer transition flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download ZIP
                </a>

                <button 
                  id="nav-logout"
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded cursor-pointer transition flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <a 
                  id="nav-download-zip"
                  href="/flexfit-gym-tracker.zip"
                  download="flexfit-gym-tracker.zip"
                  title="Download Project ZIP"
                  className="bg-blue-800 hover:bg-blue-900 text-white text-xs px-2.5 py-1 rounded cursor-pointer transition flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download ZIP
                </a>
                <button 
                  id="nav-login"
                  onClick={() => setCurrentPage('login')}
                  className="bg-white text-[#2b4c7e] hover:bg-blue-50 text-xs px-3 py-1.5 rounded font-bold cursor-pointer transition flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" /> Staff Login
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Page Content */}
      <main id="main-content" className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">

        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <div id="page-home" className="space-y-6">
            <div className="bg-white border border-slate-300 rounded-md p-7 shadow-xs">
              <h2 id="home-title" className="text-2xl font-bold text-slate-800 mb-2">
                Welcome to FlexFit Maintenance Tracker
              </h2>
              <p id="home-subtitle" className="text-slate-600 mb-6 text-sm">
                A simple internal software tool to record gym equipment faults, assign maintenance jobs, and track repairs across our gym facilities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div id="feature-card-report" className="bg-slate-50 border border-slate-200 p-4 rounded text-sm">
                  <div className="text-[#2b4c7e] font-bold mb-1 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Report Faults
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Gym floor staff can quickly log damaged equipment (Treadmills, Weights, Cables) before members complain.
                  </p>
                </div>

                <div id="feature-card-dashboard" className="bg-slate-50 border border-slate-200 p-4 rounded text-sm">
                  <div className="text-[#2b4c7e] font-bold mb-1 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    Engineer Dashboard
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Engineers can view open jobs, search by location, and mark tickets as Resolved in 1-click.
                  </p>
                </div>

                <div id="feature-card-database" className="bg-slate-50 border border-slate-200 p-4 rounded text-sm">
                  <div className="text-[#2b4c7e] font-bold mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Database Records
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    All maintenance records and staff logins are permanently stored in the SQLite database.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 flex-wrap">
                {currentUser ? (
                  <>
                    <button
                      id="home-dashboard-btn"
                      onClick={() => setCurrentPage('dashboard')}
                      className="bg-[#2b4c7e] hover:bg-blue-900 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer transition"
                    >
                      Go to Maintenance Dashboard &rarr;
                    </button>
                    <button
                      id="home-report-btn"
                      onClick={() => setCurrentPage('add-ticket')}
                      className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer transition"
                    >
                      + Report New Issue
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="home-login-btn"
                      onClick={() => setCurrentPage('login')}
                      className="bg-[#2b4c7e] hover:bg-blue-900 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer transition"
                    >
                      Staff Login &rarr;
                    </button>
                    <span className="text-xs text-slate-500">
                      Test Login: <code>admin</code> / <code>password123</code>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LOGIN PAGE */}
        {currentPage === 'login' && (
          <div id="page-login" className="max-w-md mx-auto">
            <div className="bg-white border border-slate-300 rounded-md p-7 shadow-xs">
              <h2 id="login-heading" className="text-xl font-bold text-slate-800 mb-1">Staff Login</h2>
              <p className="text-xs text-slate-500 mb-5">
                Enter your credentials to access maintenance records.
              </p>

              {loginError && (
                <div id="login-error-alert" className="bg-red-50 border border-red-300 text-red-700 p-2.5 rounded text-xs mb-4">
                  {loginError}
                </div>
              )}

              <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-username-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    id="login-username-input"
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#2b4c7e]"
                  />
                </div>

                <div>
                  <label htmlFor="login-password-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="e.g. password123"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#2b4c7e]"
                  />
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  className="w-full bg-[#2b4c7e] hover:bg-blue-900 text-white py-2 rounded text-sm font-semibold cursor-pointer transition"
                >
                  Log In
                </button>
              </form>

              <div id="test-account-box" className="mt-5 p-3 bg-slate-50 border border-dashed border-slate-300 rounded text-xs text-slate-600">
                <div className="font-bold text-slate-700 mb-1">Test Account:</div>
                <div>Username: <code className="bg-slate-200 px-1 py-0.5 rounded">admin</code></div>
                <div>Password: <code className="bg-slate-200 px-1 py-0.5 rounded">password123</code></div>
                <button
                  id="autofill-test-btn"
                  type="button"
                  onClick={() => {
                    setLoginUsername('admin');
                    setLoginPassword('password123');
                  }}
                  className="mt-2 text-xs text-[#2b4c7e] underline hover:text-blue-900 cursor-pointer block"
                >
                  Fill test details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD PAGE */}
        {currentPage === 'dashboard' && (
          <div id="page-dashboard" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 id="dashboard-heading" className="text-2xl font-bold text-slate-800">Maintenance Dashboard</h2>
                <p className="text-xs text-slate-500">Active maintenance jobs and equipment repair requests</p>
              </div>

              <button
                id="dashboard-add-btn"
                onClick={() => setCurrentPage('add-ticket')}
                className="bg-[#2b4c7e] hover:bg-blue-900 text-white px-3.5 py-2 rounded text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Add New Ticket
              </button>
            </div>

            {/* Statistics */}
            <div id="dashboard-stats-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div id="stat-card-total" className="bg-white border border-slate-200 p-4 rounded text-center shadow-2xs">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Jobs</div>
                <div id="stat-total-number" className="text-3xl font-bold text-slate-800 mt-1">{totalJobs}</div>
              </div>
              <div id="stat-card-open" className="bg-white border border-slate-200 p-4 rounded text-center shadow-2xs">
                <div className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Open Jobs</div>
                <div id="stat-open-number" className="text-3xl font-bold text-amber-600 mt-1">{openJobs}</div>
              </div>
              <div id="stat-card-resolved" className="bg-white border border-slate-200 p-4 rounded text-center shadow-2xs">
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Resolved Jobs</div>
                <div id="stat-resolved-number" className="text-3xl font-bold text-emerald-600 mt-1">{resolvedJobs}</div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div id="search-filter-bar" className="bg-white border border-slate-200 p-3 rounded flex flex-wrap gap-2 items-center">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search equipment, location or issue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-[#2b4c7e]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  id="status-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white text-slate-700"
                >
                  <option value="">All Statuses</option>
                  <option value="Open">Open Only</option>
                  <option value="Resolved">Resolved Only</option>
                </select>

                {(searchQuery || statusFilter) && (
                  <button
                    id="filter-reset-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 underline px-1 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Tickets Table */}
            <div id="tickets-table-wrapper" className="bg-white border border-slate-200 rounded overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table id="tickets-table" className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 font-semibold">
                      <th className="p-3">ID</th>
                      <th className="p-3">Equipment</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Issue Description</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((t) => (
                        <tr key={t.id} id={`ticket-row-${t.id}`} className={`hover:bg-slate-50 ${t.status === 'Resolved' ? 'bg-slate-50/50 text-slate-500' : ''}`}>
                          <td className="p-3 font-mono text-slate-400">#{t.id}</td>
                          <td className="p-3 font-bold text-slate-800">{t.equipment}</td>
                          <td className="p-3 text-slate-600">{t.location}</td>
                          <td className="p-3 max-w-xs">{t.issue}</td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              t.priority === 'High' ? 'bg-red-100 text-red-700' :
                              t.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                              t.status === 'Open' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {t.status === 'Open' ? (
                              <button
                                id={`resolve-ticket-${t.id}`}
                                onClick={() => handleResolveTicket(t.id)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-2xs"
                              >
                                Mark Resolved
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-end gap-1">
                                <Check className="w-3 h-3" /> Done
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No maintenance tickets found matching your query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ADD TICKET PAGE */}
        {currentPage === 'add-ticket' && (
          <div id="page-add-ticket" className="max-w-xl mx-auto">
            <div className="bg-white border border-slate-300 rounded-md p-7 shadow-xs">
              <h2 id="add-ticket-heading" className="text-xl font-bold text-slate-800 mb-1">Report Equipment Fault</h2>
              <p className="text-xs text-slate-500 mb-5">
                Fill out the details below to add a new maintenance job to the database.
              </p>

              {addSuccess && (
                <div id="add-ticket-success" className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded text-xs mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ticket created successfully! Redirecting to dashboard...
                </div>
              )}

              <form id="add-ticket-form" onSubmit={handleAddTicketSubmit} className="space-y-4">
                <div>
                  <label htmlFor="new-equipment-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Equipment Name / Machine Type *
                  </label>
                  <input
                    id="new-equipment-input"
                    type="text"
                    required
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    placeholder="e.g. Treadmill 4, Dumbbell Bench, Cable Machine"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#2b4c7e]"
                  />
                </div>

                <div>
                  <label htmlFor="new-location-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Gym Location / Area *
                  </label>
                  <input
                    id="new-location-input"
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Cardio Zone, Ground Floor, Free Weights"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#2b4c7e]"
                  />
                </div>

                <div>
                  <label htmlFor="new-priority-select" className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    id="new-priority-select"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:border-[#2b4c7e]"
                  >
                    <option value="Low">Low - Minor cosmetic wear</option>
                    <option value="Medium">Medium - Machine partially usable</option>
                    <option value="High">High - Out of order / Safety hazard</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="new-issue-textarea" className="block text-xs font-semibold text-slate-700 mb-1">
                    Fault Description *
                  </label>
                  <textarea
                    id="new-issue-textarea"
                    rows={4}
                    required
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    placeholder="Describe what is wrong or damaged with the equipment..."
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-[#2b4c7e]"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    id="add-ticket-submit-btn"
                    type="submit"
                    className="bg-[#2b4c7e] hover:bg-blue-900 text-white px-4 py-2 rounded text-sm font-semibold cursor-pointer transition"
                  >
                    Submit Ticket
                  </button>
                  <button
                    id="add-ticket-cancel-btn"
                    type="button"
                    onClick={() => setCurrentPage('dashboard')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded text-sm font-semibold cursor-pointer transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer id="site-footer" className="bg-[#1e293b] text-slate-400 text-xs py-4 text-center mt-auto border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 FlexFit Gym Services &bull; Equipment Maintenance System</span>
          <div className="flex gap-4 text-[11px] items-center">
            <a id="footer-download-link" href="/flexfit-gym-tracker.zip" download="flexfit-gym-tracker.zip" className="hover:text-white cursor-pointer flex items-center gap-1 text-blue-300">
              <Download className="w-3 h-3" /> Download ZIP
            </a>
            <button id="footer-home-link" onClick={() => setCurrentPage('home')} className="hover:text-white cursor-pointer">Home</button>
            <button id="footer-dashboard-link" onClick={() => setCurrentPage('dashboard')} className="hover:text-white cursor-pointer">Dashboard</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
