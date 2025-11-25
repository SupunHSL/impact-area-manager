import { useState, useEffect } from 'react';
import { AppState, ImpactArea, ImpactFeature } from '../App';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card } from './ui/card';
import { Plus, X, Trash2 } from 'lucide-react';

interface AddImpactAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  appState: AppState;
  editingImpactArea: ImpactArea | null;
}

export function AddImpactAreaModal({
  isOpen,
  onClose,
  appState,
  editingImpactArea,
}: AddImpactAreaModalProps) {
  const { projects, features, impactAreas, setProjects, setFeatures, setImpactAreas } =
    appState;

  const [projectId, setProjectId] = useState('');
  const [featureId, setFeatureId] = useState('');
  const [subFeatures, setSubFeatures] = useState<string[]>(['']);
  const [impactFeatures, setImpactFeatures] = useState<ImpactFeature[]>([
    { id: '', name: '', impactPaths: [''], description: '' },
  ]);
  const [description, setDescription] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newFeatureName, setNewFeatureName] = useState('');
  const [showNewProject, setShowNewProject] = useState(false);
  const [showNewFeature, setShowNewFeature] = useState(false);

  useEffect(() => {
    if (editingImpactArea) {
      setProjectId(editingImpactArea.projectId);
      setFeatureId(editingImpactArea.featureId);
      setSubFeatures(editingImpactArea.subFeatures.length > 0 ? editingImpactArea.subFeatures : ['']);
      setImpactFeatures(editingImpactArea.impactFeatures.length > 0 ? editingImpactArea.impactFeatures : [
        { id: '', name: '', impactPaths: [''], description: '' },
      ]);
      setDescription(editingImpactArea.description || '');
    } else {
      resetForm();
    }
  }, [editingImpactArea, isOpen]);

  const resetForm = () => {
    setProjectId('');
    setFeatureId('');
    setSubFeatures(['']);
    setImpactFeatures([{ id: '', name: '', impactPaths: [''], description: '' }]);
    setDescription('');
    setNewProjectName('');
    setNewFeatureName('');
    setShowNewProject(false);
    setShowNewFeature(false);
  };

  const filteredFeatures = features.filter((f) => f.projectId === projectId);

  // Sub Features handlers
  const handleAddSubFeature = () => {
    setSubFeatures([...subFeatures, '']);
  };

  const handleRemoveSubFeature = (index: number) => {
    setSubFeatures(subFeatures.filter((_, i) => i !== index));
  };

  const handleUpdateSubFeature = (index: number, value: string) => {
    const updated = [...subFeatures];
    updated[index] = value;
    setSubFeatures(updated);
  };

  // Impact Features handlers
  const handleAddImpactFeature = () => {
    setImpactFeatures([
      ...impactFeatures,
      { id: `if${Date.now()}`, name: '', impactPaths: [''], description: '' },
    ]);
  };

  const handleRemoveImpactFeature = (index: number) => {
    setImpactFeatures(impactFeatures.filter((_, i) => i !== index));
  };

  const handleUpdateImpactFeatureName = (index: number, value: string) => {
    const updated = [...impactFeatures];
    updated[index].name = value;
    setImpactFeatures(updated);
  };

  const handleUpdateImpactFeatureDescription = (index: number, value: string) => {
    const updated = [...impactFeatures];
    updated[index].description = value;
    setImpactFeatures(updated);
  };

  const handleAddImpactPath = (impactFeatureIndex: number) => {
    const updated = [...impactFeatures];
    updated[impactFeatureIndex].impactPaths.push('');
    setImpactFeatures(updated);
  };

  const handleRemoveImpactPath = (impactFeatureIndex: number, pathIndex: number) => {
    const updated = [...impactFeatures];
    updated[impactFeatureIndex].impactPaths = updated[impactFeatureIndex].impactPaths.filter(
      (_, i) => i !== pathIndex
    );
    setImpactFeatures(updated);
  };

  const handleUpdateImpactPath = (
    impactFeatureIndex: number,
    pathIndex: number,
    value: string
  ) => {
    const updated = [...impactFeatures];
    updated[impactFeatureIndex].impactPaths[pathIndex] = value;
    setImpactFeatures(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalProjectId = projectId;
    let finalFeatureId = featureId;

    // Handle new project
    if (showNewProject && newProjectName.trim()) {
      const newProject = {
        id: `p${Date.now()}`,
        name: newProjectName.trim(),
      };
      setProjects([...projects, newProject]);
      finalProjectId = newProject.id;
    }

    // Handle new feature
    if (showNewFeature && newFeatureName.trim()) {
      const newFeature = {
        id: `f${Date.now()}`,
        projectId: finalProjectId,
        name: newFeatureName.trim(),
      };
      setFeatures([...features, newFeature]);
      finalFeatureId = newFeature.id;
    }

    // Filter out empty sub features (sub features are optional)
    const filteredSubFeatures = subFeatures.filter((sf) => sf.trim() !== '');

    // Filter and validate impact features (at least one required with name)
    const filteredImpactFeatures = impactFeatures
      .filter((imf) => imf.name.trim() !== '')
      .map((imf) => ({
        ...imf,
        id: imf.id || `if${Date.now()}_${Math.random()}`,
        impactPaths: imf.impactPaths.filter((path) => path.trim() !== ''),
      }));

    if (!finalProjectId || !finalFeatureId || filteredImpactFeatures.length === 0) {
      alert('Please fill in Project, Feature, and at least one Impact Feature');
      return;
    }

    if (editingImpactArea) {
      // Update existing
      const updated: ImpactArea = {
        ...editingImpactArea,
        projectId: finalProjectId,
        featureId: finalFeatureId,
        subFeatures: filteredSubFeatures,
        impactFeatures: filteredImpactFeatures,
        description: description.trim(),
        lastUpdatedBy: 'Current User',
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setImpactAreas(
        impactAreas.map((ia) => (ia.id === editingImpactArea.id ? updated : ia))
      );
    } else {
      // Create new
      const newImpactArea: ImpactArea = {
        id: `ia${Date.now()}`,
        projectId: finalProjectId,
        featureId: finalFeatureId,
        subFeatures: filteredSubFeatures,
        impactFeatures: filteredImpactFeatures,
        description: description.trim(),
        createdBy: 'Current User',
        lastUpdatedBy: 'Current User',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setImpactAreas([...impactAreas, newImpactArea]);
    }

    onClose();
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingImpactArea ? 'Edit Impact Area' : 'Add Impact Area'}
          </DialogTitle>
          <DialogDescription>
            {editingImpactArea ? 'Edit the details of the impact area.' : 'Add a new impact area.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label>Project *</Label>
            {!showNewProject ? (
              <div className="flex gap-2">
                <Select
                  value={projectId}
                  onValueChange={(value) => {
                    setProjectId(value);
                    setFeatureId('');
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewProject(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowNewProject(false);
                    setNewProjectName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Feature Selection */}
          <div className="space-y-2">
            <Label>Feature *</Label>
            {!showNewFeature ? (
              <div className="flex gap-2">
                <Select
                  value={featureId}
                  onValueChange={setFeatureId}
                  disabled={!projectId && !showNewProject}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a feature" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredFeatures.map((feature) => (
                      <SelectItem key={feature.id} value={feature.id}>
                        {feature.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewFeature(true)}
                  disabled={!projectId && !showNewProject}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new feature name"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowNewFeature(false);
                    setNewFeatureName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Sub Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sub Features (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSubFeature}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Sub Feature
              </Button>
            </div>
            <div className="space-y-2">
              {subFeatures.map((subFeature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Sub feature ${index + 1}`}
                    value={subFeature}
                    onChange={(e) => handleUpdateSubFeature(index, e.target.value)}
                    className="flex-1"
                  />
                  {subFeatures.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubFeature(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Impact Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Impact Features * (Impact Feature → Impact Paths)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddImpactFeature}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Impact Feature
              </Button>
            </div>

            <div className="space-y-4">
              {impactFeatures.map((impactFeature, impactFeatureIndex) => (
                <Card key={impactFeatureIndex} className="p-4 bg-blue-50 border-blue-200">
                  <div className="space-y-4">
                    {/* Impact Feature Name */}
                    <div className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Label>Impact Feature Name *</Label>
                        <Input
                          placeholder="Enter impact feature name"
                          value={impactFeature.name}
                          onChange={(e) =>
                            handleUpdateImpactFeatureName(impactFeatureIndex, e.target.value)
                          }
                        />
                      </div>
                      {impactFeatures.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImpactFeature(impactFeatureIndex)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-7"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Impact Paths */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Impact Paths (Optional)</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddImpactPath(impactFeatureIndex)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Path
                        </Button>
                      </div>
                      {impactFeature.impactPaths.map((path, pathIndex) => (
                        <div key={pathIndex} className="flex gap-2">
                          <Input
                            placeholder={`Impact path ${pathIndex + 1}`}
                            value={path}
                            onChange={(e) =>
                              handleUpdateImpactPath(
                                impactFeatureIndex,
                                pathIndex,
                                e.target.value
                              )
                            }
                            className="flex-1"
                          />
                          {impactFeature.impactPaths.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveImpactPath(impactFeatureIndex, pathIndex)
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Textarea
                        placeholder="Enter description for this impact feature"
                        value={impactFeature.description}
                        onChange={(e) =>
                          handleUpdateImpactFeatureDescription(
                            impactFeatureIndex,
                            e.target.value
                          )
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Overall Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Overall Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter overall description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              {editingImpactArea ? 'Update' : 'Create'} Impact Area
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}