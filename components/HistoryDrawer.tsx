'use client';

import { useState } from 'react';
import { NIHSSAssessment, NIHSS_ITEMS } from '@/lib/nihss';
import { deleteAssessment } from '@/lib/storage';

interface HistoryDrawerProps {
  assessments: NIHSSAssessment[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (assessment: NIHSSAssessment) => void;
  onDelete: () => void;
}

export default function HistoryDrawer({ 
  assessments, 
  isOpen, 
  onClose, 
  onSelect,
  onDelete 
}: HistoryDrawerProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<NIHSSAssessment | null>(null);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this assessment?')) {
      deleteAssessment(id);
      onDelete();
      if (selectedAssessment?.id === id) {
        setSelectedAssessment(null);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:hidden'}
        flex flex-col border-r border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">History</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{assessments.length} saved</span>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Assessment List */}
        <div className="flex-1 overflow-y-auto">
          {assessments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500">No assessments yet</p>
              <p className="text-sm text-gray-400 mt-1">Complete an assessment to save it</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  onClick={() => setSelectedAssessment(assessment)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">{assessment.totalScore}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(assessment.timestamp)} at {formatTime(assessment.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(assessment.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAssessment && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedAssessment(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Assessment Detail</p>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-4xl font-bold">{selectedAssessment.totalScore}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAssessment(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-4">
                {formatDate(selectedAssessment.timestamp)} at {formatTime(selectedAssessment.timestamp)}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              <div className="space-y-3">
                {NIHSS_ITEMS.map((item, index) => {
                  const score = selectedAssessment.items[item.id] ?? 0;
                  const option = item.options.find(o => o.value === score);
                  
                  return (
                    <div key={item.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-400 w-5">{index + 1}</span>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                        {option && (
                          <p className="text-sm text-gray-500 ml-7">{option.label}</p>
                        )}
                      </div>
                      <span className="font-bold text-gray-900 ml-4">{score}</span>
                    </div>
                  );
                })}
              </div>

              {selectedAssessment.notes && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Notes</p>
                  <p className="text-sm text-yellow-700">{selectedAssessment.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  onSelect(selectedAssessment);
                  setSelectedAssessment(null);
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Load This Assessment
              </button>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
