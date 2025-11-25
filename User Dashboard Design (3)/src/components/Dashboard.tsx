import { useState } from 'react';
import { AppState } from '../App';
import { Button } from './ui/button';
import { SearchImpactAreas } from './SearchImpactAreas';
import { ManageProjects } from './ManageProjects';
import { Search, FolderKanban, LogOut, Menu, X } from 'lucide-react';

interface DashboardProps {
  appState: AppState;
  onLogout: () => void;
}

type View = 'search' | 'projects';

export function Dashboard({ appState, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<View>('search');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-16'
        } flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && <h2 className="text-indigo-900">Impact Manager</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={currentView === 'search' ? 'default' : 'ghost'}
            className={`w-full justify-start ${
              currentView === 'search' ? 'bg-indigo-600 text-white' : ''
            }`}
            onClick={() => setCurrentView('search')}
          >
            <Search className="w-5 h-5 mr-2" />
            {sidebarOpen && 'Search & View Impact Areas'}
          </Button>

          <Button
            variant={currentView === 'projects' ? 'default' : 'ghost'}
            className={`w-full justify-start ${
              currentView === 'projects' ? 'bg-indigo-600 text-white' : ''
            }`}
            onClick={() => setCurrentView('projects')}
          >
            <FolderKanban className="w-5 h-5 mr-2" />
            {sidebarOpen && 'Manage Projects'}
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {currentView === 'search' && <SearchImpactAreas appState={appState} />}
          {currentView === 'projects' && <ManageProjects appState={appState} />}
        </div>
      </main>
    </div>
  );
}
