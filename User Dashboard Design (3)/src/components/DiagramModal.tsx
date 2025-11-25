import { ImpactArea } from '../App';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Card } from './ui/card';
import { ArrowRight, User, Calendar } from 'lucide-react';

interface DiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  impactArea: ImpactArea;
  projectName: string;
  featureName: string;
  subFeatureName?: string;
}

export function DiagramModal({
  isOpen,
  onClose,
  impactArea,
  projectName,
  featureName,
  subFeatureName,
}: DiagramModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Impact Flow Diagram</DialogTitle>
          <DialogDescription>
            Visualize the impact flow from project to impact features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metadata */}
          <Card className="p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span>Created by: {impactArea.createdBy}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Created: {impactArea.createdAt}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-4 h-4" />
                <span>Last updated by: {impactArea.lastUpdatedBy}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Updated: {impactArea.updatedAt}</span>
              </div>
            </div>
            {impactArea.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700">
                  <span className="text-gray-900">Overall Description: </span>
                  {impactArea.description}
                </p>
              </div>
            )}
          </Card>

          {/* Flow Diagram */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Impact Flow</h3>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Project */}
              <Card className="w-full max-w-md p-6 bg-indigo-50 border-indigo-200">
                <div className="text-center">
                  <div className="text-indigo-600 mb-2">Project</div>
                  <div className="text-indigo-900">{projectName}</div>
                </div>
              </Card>

              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />

              {/* Feature */}
              <Card className="w-full max-w-md p-6 bg-blue-50 border-blue-200">
                <div className="text-center">
                  <div className="text-blue-600 mb-2">Feature</div>
                  <div className="text-blue-900">{featureName}</div>
                </div>
              </Card>

              {subFeatureName && subFeatureName !== 'N/A' && (
                <>
                  <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />

                  {/* Sub Feature */}
                  <Card className="w-full max-w-md p-6 bg-purple-50 border-purple-200">
                    <div className="text-center">
                      <div className="text-purple-600 mb-2">Sub-Feature</div>
                      <div className="text-purple-900">{subFeatureName}</div>
                    </div>
                  </Card>
                </>
              )}

              <ArrowRight className="w-6 h-6 text-gray-400 rotate-90" />

              {/* Impact Features with Impact Paths */}
              <div className="w-full space-y-6">
                <div className="text-center text-green-600 mb-4">
                  Impact Features → Impact Paths
                </div>
                
                {impactArea.impactFeatures.map((impactFeature, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-green-50 border-green-200"
                  >
                    <div className="space-y-4">
                      {/* Impact Feature Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-green-300">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-green-900">{impactFeature.name}</div>
                          {impactFeature.description && (
                            <div className="text-green-700 italic mt-1">
                              {impactFeature.description}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Impact Paths */}
                      {impactFeature.impactPaths.length > 0 && (
                        <div className="space-y-2 pl-11">
                          <div className="text-green-700">Impact Paths:</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {impactFeature.impactPaths.map((path, pathIdx) => (
                              <div
                                key={pathIdx}
                                className="flex items-center gap-2 p-2 rounded bg-green-100 border border-green-300"
                              >
                                <ArrowRight className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span className="text-green-900">{path}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <Card className="p-4 bg-gray-50">
            <h4 className="text-gray-900 mb-3">Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-indigo-200 border border-indigo-300"></div>
                <span className="text-gray-700">Project</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-200 border border-blue-300"></div>
                <span className="text-gray-700">Feature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-purple-200 border border-purple-300"></div>
                <span className="text-gray-700">Sub Feature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-200 border border-green-300"></div>
                <span className="text-gray-700">Impact Feature</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}