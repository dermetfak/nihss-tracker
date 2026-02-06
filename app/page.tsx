'use client';

import { useState, useEffect, useCallback } from 'react';
import AssessmentForm from '@/components/AssessmentForm';
import HistoryDrawer from '@/components/HistoryDrawer';
import { NIHSSAssessment } from '@/lib/nihss';
import { getAssessments } from '@/lib/storage';

export default function Home() {
  const [assessments, setAssessments] = useState<NIHSSAssessment[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [lastSaved, setLastSaved] = useState<NIHSSAssessment | null>(null);

  const loadAssessments = useCallback(() => {
    setAssessments(getAssessments());
  }, []);

  useEffect(() => {
    loadAssessments();
  }, [loadAssessments]);

  const handleSave = useCallback((assessment: NIHSSAssessment) => {
    setLastSaved(assessment);
    loadAssessments();
    // Show success message briefly
    setTimeout(() => setLastSaved(null), 3000);
  }, [loadAssessments]);

  const handleLoadAssessment = useCallback((assessment: NIHSSAssessment) => {
    // In a full implementation, this would load the assessment into the form
    // For now, we'll just alert the user
    alert(`Loaded assessment from ${new Date(assessment.timestamp).toLocaleDateString()}\nScore: ${assessment.totalScore}`);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">NIHSS Tracker</h1>
              <p className="text-xs text-gray-500">National Institutes of Health Stroke Scale</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="About NIHSS"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">History</span>
              {assessments.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {assessments.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Success Toast */}
      {lastSaved && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Assessment saved! Score: {lastSaved.totalScore}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto">
        {/* History Drawer - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-20 h-[calc(100vh-5rem)]">
            <HistoryDrawer
              assessments={assessments}
              isOpen={true}
              onClose={() => {}}
              onSelect={handleLoadAssessment}
              onDelete={loadAssessments}
            />
          </div>
        </div>

        {/* Mobile Drawer */}
        <HistoryDrawer
          assessments={assessments}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSelect={(a) => {
            handleLoadAssessment(a);
            setIsDrawerOpen(false);
          }}
          onDelete={loadAssessments}
        />

        {/* Assessment Form */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-2xl mx-auto">
            <AssessmentForm onSave={handleSave} />
          </div>
        </main>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowInfo(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">About NIHSS</h2>
              <button 
                onClick={() => setShowInfo(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>
                The <strong className="text-gray-900">NIH Stroke Scale (NIHSS)</strong> is a standardized tool used to measure stroke severity 
                and determine appropriate treatment.
              </p>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-medium text-blue-900 mb-2">Scoring Guide:</p>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• <strong>0</strong> — No stroke symptoms</li>
                  <li>• <strong>1-4</strong> — Mild stroke</li>
                  <li>• <strong>5-15</strong> — Moderate stroke</li>
                  <li>• <strong>16-20</strong> — Severe stroke</li>
                  <li>• <strong>21-42</strong> — Very severe stroke</li>
                </ul>
              </div>
              <p className="text-sm">
                All 15 items must be assessed for a complete evaluation. Higher scores indicate more severe impairment.
              </p>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-sm text-gray-500">
            NIHSS Tracker • Built with Next.js • Running locally on Raspberry Pi
          </p>
        </div>
      </footer>
    </div>
  );
}
