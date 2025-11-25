import { useState } from 'react';
import { AppState, Project, Feature } from '../App';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Plus, Pencil, Trash2, ChevronDown, FolderOpen, FileText } from 'lucide-react';

interface ManageProjectsProps {
  appState: AppState;
}

type ModalType = 'addProject' | 'editProject' | 'addFeature' | 'editFeature' | null;

export function ManageProjects({ appState }: ManageProjectsProps) {
  const { projects, features, impactAreas, setProjects, setFeatures, setImpactAreas } =
    appState;

  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [formValue, setFormValue] = useState('');

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const openModal = (
    type: ModalType,
    project?: Project,
    feature?: Feature
  ) => {
    setModalType(type);
    setSelectedProject(project || null);
    setSelectedFeature(feature || null);
    setFormValue(
      type === 'editProject' && project
        ? project.name
        : type === 'editFeature' && feature
        ? feature.name
        : ''
    );
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedProject(null);
    setSelectedFeature(null);
    setFormValue('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue.trim()) return;

    if (modalType === 'addProject') {
      const newProject: Project = {
        id: `p${Date.now()}`,
        name: formValue.trim(),
      };
      setProjects([...projects, newProject]);
    } else if (modalType === 'editProject' && selectedProject) {
      setProjects(
        projects.map((p) =>
          p.id === selectedProject.id ? { ...p, name: formValue.trim() } : p
        )
      );
    } else if (modalType === 'addFeature' && selectedProject) {
      const newFeature: Feature = {
        id: `f${Date.now()}`,
        projectId: selectedProject.id,
        name: formValue.trim(),
      };
      setFeatures([...features, newFeature]);
    } else if (modalType === 'editFeature' && selectedFeature) {
      setFeatures(
        features.map((f) =>
          f.id === selectedFeature.id ? { ...f, name: formValue.trim() } : f
        )
      );
    }

    closeModal();
  };

  const handleDeleteProject = (project: Project) => {
    if (
      !confirm(
        `Are you sure you want to delete "${project.name}"? This will also delete all associated features and impact areas.`
      )
    ) {
      return;
    }

    // Delete related features
    const featureIds = features
      .filter((f) => f.projectId === project.id)
      .map((f) => f.id);
    setFeatures(features.filter((f) => f.projectId !== project.id));

    // Delete related impact areas
    setImpactAreas(
      impactAreas.filter(
        (ia) => ia.projectId !== project.id && !featureIds.includes(ia.featureId)
      )
    );

    // Delete project
    setProjects(projects.filter((p) => p.id !== project.id));
  };

  const handleDeleteFeature = (feature: Feature) => {
    if (
      !confirm(
        `Are you sure you want to delete "${feature.name}"? This will also delete all associated impact areas.`
      )
    ) {
      return;
    }

    // Delete related impact areas
    setImpactAreas(impactAreas.filter((ia) => ia.featureId !== feature.id));

    // Delete feature
    setFeatures(features.filter((f) => f.id !== feature.id));
  };

  const getProjectFeatures = (projectId: string) => {
    return features.filter((f) => f.projectId === projectId);
  };

  const getFeatureImpactCount = (featureId: string) => {
    return impactAreas.filter((ia) => ia.featureId === featureId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Manage Projects</h1>
          <p className="text-gray-600 mt-1">
            Organize projects and their features
          </p>
        </div>
        <Button
          onClick={() => openModal('addProject')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No projects yet. Create your first project to get started.
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => {
            const projectFeatures = getProjectFeatures(project.id);
            const isExpanded = expandedProjects.has(project.id);

            return (
              <Card key={project.id} className="overflow-hidden">
                <Collapsible
                  open={isExpanded}
                  onOpenChange={() => toggleProject(project.id)}
                >
                  <div className="p-4 flex items-center justify-between bg-gray-50 border-b">
                    <CollapsibleTrigger className="flex items-center gap-3 flex-1 text-left">
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          isExpanded ? 'transform rotate-180' : ''
                        }`}
                      />
                      <FolderOpen className="w-5 h-5 text-indigo-600" />
                      <div className="flex-1">
                        <h3 className="text-gray-900">{project.name}</h3>
                        <p className="text-gray-600">
                          {projectFeatures.length} feature
                          {projectFeatures.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </CollapsibleTrigger>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openModal('addFeature', project)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Feature
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openModal('editProject', project)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="p-4">
                      {projectFeatures.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No features in this project yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {projectFeatures.map((feature) => {
                            const impactCount = getFeatureImpactCount(feature.id);

                            return (
                              <div
                                key={feature.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-white border hover:shadow-sm transition-shadow"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <div>
                                    <div className="text-gray-900">{feature.name}</div>
                                    <div className="text-gray-600">
                                      {impactCount} impact area
                                      {impactCount !== 1 ? 's' : ''}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      openModal('editFeature', project, feature)
                                    }
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteFeature(feature)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal */}
      <Dialog open={modalType !== null} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalType === 'addProject' && 'Add New Project'}
              {modalType === 'editProject' && 'Edit Project'}
              {modalType === 'addFeature' && `Add Feature to ${selectedProject?.name}`}
              {modalType === 'editFeature' && 'Edit Feature'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {modalType?.includes('Project') ? 'Project' : 'Feature'} Name
                </Label>
                <Input
                  id="name"
                  placeholder={`Enter ${
                    modalType?.includes('Project') ? 'project' : 'feature'
                  } name`}
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                {modalType?.includes('add') ? 'Create' : 'Update'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
