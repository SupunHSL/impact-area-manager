import { useState, useMemo } from 'react';
import { AppState, ImpactArea } from '../App';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Plus, Pencil, Trash2, Network, Eye } from 'lucide-react';
import { AddImpactAreaModal } from './AddImpactAreaModal';
import { DiagramModal } from './DiagramModal';

interface SearchImpactAreasProps {
  appState: AppState;
}

export function SearchImpactAreas({ appState }: SearchImpactAreasProps) {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedFeature, setSelectedFeature] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingImpactArea, setEditingImpactArea] = useState<ImpactArea | null>(null);
  const [diagramImpactArea, setDiagramImpactArea] = useState<ImpactArea | null>(null);

  const { projects, features, impactAreas, setImpactAreas } = appState;

  // Filter features based on selected project
  const filteredFeatures = useMemo(() => {
    if (selectedProject === 'all') return features;
    return features.filter((f) => f.projectId === selectedProject);
  }, [features, selectedProject]);

  // Filter impact areas based on filters and search
  const filteredImpactAreas = useMemo(() => {
    return impactAreas.filter((ia) => {
      const projectMatch = selectedProject === 'all' || ia.projectId === selectedProject;
      const featureMatch = selectedFeature === 'all' || ia.featureId === selectedFeature;
      
      // Search by any word in impact features, impact paths, feature name, or sub features
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const feature = features.find((f) => f.id === ia.featureId);
        const featureName = feature?.name.toLowerCase() || '';
        
        // Check if query matches in feature name
        const featureNameMatch = featureName.includes(query);
        
        // Check if query matches any sub feature
        const subFeatureMatch = ia.subFeatures.some((sf) => 
          sf.toLowerCase().includes(query)
        );
        
        // Check if query matches any impact feature name
        const impactFeatureMatch = ia.impactFeatures.some((imf) => 
          imf.name.toLowerCase().includes(query)
        );
        
        // Check if query matches any impact path
        const impactPathMatch = ia.impactFeatures.some((imf) =>
          imf.impactPaths.some((path) => path.toLowerCase().includes(query))
        );
        
        if (!featureNameMatch && !subFeatureMatch && !impactFeatureMatch && !impactPathMatch) {
          return false;
        }
      }
      
      return projectMatch && featureMatch;
    });
  }, [impactAreas, selectedProject, selectedFeature, searchQuery, features]);

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || 'Unknown';
  };

  const getFeatureName = (featureId: string) => {
    return features.find((f) => f.id === featureId)?.name || 'Unknown';
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this impact area?')) {
      setImpactAreas(impactAreas.filter((ia) => ia.id !== id));
    }
  };

  const handleEdit = (impactArea: ImpactArea) => {
    setEditingImpactArea(impactArea);
    setIsAddModalOpen(true);
  };

  const handleViewDiagram = (impactArea: ImpactArea) => {
    setDiagramImpactArea(impactArea);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Search & View Impact Areas</h1>
          <p className="text-gray-600 mt-1">
            Filter and manage impact areas across projects
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingImpactArea(null);
            setIsAddModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Impact Area
        </Button>
      </div>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <h3 className="text-gray-900">Filters</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Feature</Label>
              <Select
                value={selectedFeature}
                onValueChange={setSelectedFeature}
                disabled={selectedProject === 'all'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Features</SelectItem>
                  {filteredFeatures.map((feature) => (
                    <SelectItem key={feature.id} value={feature.id}>
                      {feature.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by feature, sub feature, or impact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <h3 className="text-gray-900">
            Impact Areas ({filteredImpactAreas.length})
          </h3>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Feature</TableHead>
                  <TableHead>Sub Features</TableHead>
                  <TableHead>Impact Features</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredImpactAreas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      No impact areas found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredImpactAreas.map((impactArea) => (
                    <TableRow key={impactArea.id}>
                      <TableCell>{getProjectName(impactArea.projectId)}</TableCell>
                      <TableCell>{getFeatureName(impactArea.featureId)}</TableCell>
                      <TableCell>
                        {impactArea.subFeatures.length === 0 ? (
                          <span className="text-gray-400 italic">No sub features</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {impactArea.subFeatures.map((subFeature, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-md bg-purple-100 text-purple-700"
                              >
                                {subFeature}
                              </span>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View All ({impactArea.impactFeatures.length})
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[500px]" align="start">
                            <div className="space-y-3">
                              <h4 className="text-gray-900 mb-3">All Impact Features</h4>
                              <div className="space-y-3 max-h-96 overflow-y-auto">
                                {impactArea.impactFeatures.map((impactFeature, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-lg bg-blue-50 border border-blue-200"
                                  >
                                    <div className="flex items-start gap-2 mb-2">
                                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                        {idx + 1}
                                      </span>
                                      <span className="text-blue-900">{impactFeature.name}</span>
                                    </div>
                                    {impactFeature.impactPaths.length > 0 && (
                                      <div className="ml-8 space-y-1">
                                        <div className="text-gray-700">Impact Paths:</div>
                                        {impactFeature.impactPaths.map((path, pathIdx) => (
                                          <div
                                            key={pathIdx}
                                            className="text-gray-600 pl-3 border-l-2 border-green-300"
                                          >
                                            • {path}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    {impactFeature.description && (
                                      <div className="ml-8 mt-2 text-gray-600 italic">
                                        {impactFeature.description}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDiagram(impactArea)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          >
                            <Network className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(impactArea)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(impactArea.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddImpactAreaModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingImpactArea(null);
        }}
        appState={appState}
        editingImpactArea={editingImpactArea}
      />

      {diagramImpactArea && (
        <DiagramModal
          isOpen={!!diagramImpactArea}
          onClose={() => setDiagramImpactArea(null)}
          impactArea={diagramImpactArea}
          projectName={getProjectName(diagramImpactArea.projectId)}
          featureName={getFeatureName(diagramImpactArea.featureId)}
        />
      )}
    </div>
  );
}
