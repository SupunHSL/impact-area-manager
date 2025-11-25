import { useState } from 'react';
import { AppState, Project, Feature, SubFeature } from '../App';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, FolderOpen, FileText, Layers } from 'lucide-react';

interface ManageProjectsProps {
  appState: AppState;
}

type ModalType = 'addProject' | 'editProject' | 'addFeature' | 'editFeature' | 'addSubFeature' | 'editSubFeature' | null;

export function ManageProjects({ appState }: ManageProjectsProps) {
  const { projects, features, subFeatures, impactAreas, setProjects, setFeatures, setSubFeatures, setImpactAreas } =
    appState;

  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [selectedSubFeature, setSelectedSubFeature] = useState<SubFeature | null>(null);
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

  const toggleFeature = (featureId: string) => {
    const newExpanded = new Set(expandedFeatures);
    if (newExpanded.has(featureId)) {
      newExpanded.delete(featureId);
    } else {
      newExpanded.add(featureId);
    }
    setExpandedFeatures(newExpanded);
  };

  const openModal = (
    type: ModalType,
    project?: Project,
    feature?: Feature,
    subFeature?: SubFeature
  ) => {
    setModalType(type);
    setSelectedProject(project || null);
    setSelectedFeature(feature || null);
    setSelectedSubFeature(subFeature || null);
    setFormValue(
      type === 'editProject' && project
        ? project.name
        : type === 'editFeature' && feature
        ? feature.name
        : type === 'editSubFeature' && subFeature
        ? subFeature.name
        : ''
    );
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedProject(null);
    setSelectedFeature(null);
    setSelectedSubFeature(null);
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
    } else if (modalType === 'addSubFeature' && selectedFeature) {
      const newSubFeature: SubFeature = {
        id: `sf${Date.now()}`,
        featureId: selectedFeature.id,
        name: formValue.trim(),
      };
      setSubFeatures([...subFeatures, newSubFeature]);
    } else if (modalType === 'editSubFeature' && selectedSubFeature) {
      setSubFeatures(
        subFeatures.map((sf) =>
          sf.id === selectedSubFeature.id ? { ...sf, name: formValue.trim() } : sf
        )
      );
    }

    closeModal();
  };

  const handleDeleteProject = (project: Project) => {
    if (
      !confirm(
        `Are you sure you want to delete "${project.name}"? This will also delete all associated features, sub-features, and impact areas.`
      )
    ) {
      return;
    }

    // Delete related features
    const featureIds = features
      .filter((f) => f.projectId === project.id)
      .map((f) => f.id);
    
    // Delete related sub-features
    setSubFeatures(subFeatures.filter((sf) => !featureIds.includes(sf.featureId)));
    
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
        `Are you sure you want to delete "${feature.name}"? This will also delete all associated sub-features and impact areas.`
      )
    ) {
      return;
    }

    // Delete related sub-features
    setSubFeatures(subFeatures.filter((sf) => sf.featureId !== feature.id));

    // Delete related impact areas
    setImpactAreas(impactAreas.filter((ia) => ia.featureId !== feature.id));

    // Delete feature
    setFeatures(features.filter((f) => f.id !== feature.id));
  };

  const handleDeleteSubFeature = (subFeature: SubFeature) => {
    if (
      !confirm(
        `Are you sure you want to delete "${subFeature.name}"? This will also update related impact areas.`
      )
    ) {
      return;
    }

    // Update related impact areas
    setImpactAreas(
      impactAreas.map((ia) =>
        ia.subFeatureId === subFeature.id
          ? { ...ia, subFeatureId: undefined }
          : ia
      )
    );

    // Delete sub-feature
    setSubFeatures(subFeatures.filter((sf) => sf.id !== subFeature.id));
  };

  const getProjectFeatures = (projectId: string) => {
    return features.filter((f) => f.projectId === projectId);
  };

  const getFeatureSubFeatures = (featureId: string) => {
    return subFeatures.filter((sf) => sf.featureId === featureId);
  };

  const getFeatureImpactCount = (featureId: string) => {
    return impactAreas.filter((ia) => ia.featureId === featureId).length;
  };

  const getSubFeatureImpactCount = (subFeatureId: string) => {
    return impactAreas.filter((ia) => ia.subFeatureId === subFeatureId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">Manage Projects</h1>
          <p className="text-gray-600 mt-1">
            Organize projects, features, and sub-features
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
                  <div className="p-4 flex items-center justify-between bg-indigo-50 border-b">
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
                        <div className="space-y-3">
                          {projectFeatures.map((feature) => {
                            const impactCount = getFeatureImpactCount(feature.id);
                            const featureSubFeatures = getFeatureSubFeatures(feature.id);
                            const isFeatureExpanded = expandedFeatures.has(feature.id);

                            return (
                              <Card key={feature.id} className="bg-blue-50 border-blue-200">
                                <Collapsible
                                  open={isFeatureExpanded}
                                  onOpenChange={() => toggleFeature(feature.id)}
                                >
                                  <div className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      {featureSubFeatures.length > 0 && (
                                        <CollapsibleTrigger>
                                          <ChevronRight
                                            className={`w-4 h-4 text-gray-500 transition-transform ${
                                              isFeatureExpanded ? 'transform rotate-90' : ''
                                            }`}
                                          />
                                        </CollapsibleTrigger>
                                      )}
                                      {featureSubFeatures.length === 0 && (
                                        <div className="w-4" />
                                      )}
                                      <FileText className="w-4 h-4 text-blue-600" />
                                      <div className="flex-1">
                                        <div className="text-gray-900">{feature.name}</div>
                                        <div className="text-gray-600">
                                          {featureSubFeatures.length} sub-feature
                                          {featureSubFeatures.length !== 1 ? 's' : ''} • {impactCount} impact area
                                          {impactCount !== 1 ? 's' : ''}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          openModal('addSubFeature', project, feature)
                                        }
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add Sub-Feature
                                      </Button>
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

                                  {featureSubFeatures.length > 0 && (
                                    <CollapsibleContent>
                                      <div className="px-3 pb-3 pl-10 space-y-2">
                                        {featureSubFeatures.map((subFeature) => {
                                          const subImpactCount = getSubFeatureImpactCount(subFeature.id);

                                          return (
                                            <div
                                              key={subFeature.id}
                                              className="flex items-center justify-between p-2 rounded-lg bg-white border border-purple-200 hover:shadow-sm transition-shadow"
                                            >
                                              <div className="flex items-center gap-2">
                                                <Layers className="w-3 h-3 text-purple-600" />
                                                <div>
                                                  <div className="text-gray-900">{subFeature.name}</div>
                                                  <div className="text-gray-600">
                                                    {subImpactCount} impact area
                                                    {subImpactCount !== 1 ? 's' : ''}
                                                  </div>
                                                </div>
                                              </div>

                                              <div className="flex items-center gap-2">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                    openModal(
                                                      'editSubFeature',
                                                      project,
                                                      feature,
                                                      subFeature
                                                    )
                                                  }
                                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                >
                                                  <Pencil className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() =>
                                                    handleDeleteSubFeature(subFeature)
                                                  }
                                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </Button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </CollapsibleContent>
                                  )}
                                </Collapsible>
                              </Card>
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
              {modalType === 'addSubFeature' && `Add Sub-Feature to ${selectedFeature?.name}`}
              {modalType === 'editSubFeature' && 'Edit Sub-Feature'}
            </DialogTitle>
            <DialogDescription>
              {modalType === 'addProject' && 'Create a new project to organize your features and impact areas.'}
              {modalType === 'editProject' && 'Update the project name.'}
              {modalType === 'addFeature' && 'Add a new feature to this project.'}
              {modalType === 'editFeature' && 'Update the feature name.'}
              {modalType === 'addSubFeature' && 'Add a new sub-feature to this feature.'}
              {modalType === 'editSubFeature' && 'Update the sub-feature name.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {modalType?.includes('Project') && 'Project Name'}
                  {modalType?.includes('Feature') && !modalType?.includes('Sub') && 'Feature Name'}
                  {modalType?.includes('SubFeature') && 'Sub-Feature Name'}
                </Label>
                <Input
                  id="name"
                  placeholder={`Enter ${
                    modalType?.includes('Project')
                      ? 'project'
                      : modalType?.includes('SubFeature')
                      ? 'sub-feature'
                      : 'feature'
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
