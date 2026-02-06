'use client';

import { useState, useCallback } from 'react';
import { NIHSS_ITEMS, NIHSSAssessment, calculateTotal, getSeverity, getSeverityLabel } from '@/lib/nihss';
import { saveAssessment } from '@/lib/storage';

interface AssessmentFormProps {
  onSave: (assessment: NIHSSAssessment) => void;
}

export default function AssessmentForm({ onSave }: AssessmentFormProps) {
  const [items, setItems] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const handleScoreChange = useCallback((itemId: string, value: number) => {
    setItems(prev => ({ ...prev, [itemId]: value }));
    // Auto-advance to next item after selection
    if (currentStep < NIHSS_ITEMS.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 200);
    }
  }, [currentStep]);

  const handleSave = useCallback(() => {
    const totalScore = calculateTotal(items);
    const severity = getSeverity(totalScore);
    
    const assessment: NIHSSAssessment = {
      id: `assess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      totalScore,
      severity,
      items: { ...items },
      notes: notes.trim() || undefined,
    };
    
    saveAssessment(assessment);
    onSave(assessment);
    
    // Reset form
    setItems({});
    setNotes('');
    setCurrentStep(0);
    setShowReview(false);
  }, [items, notes, onSave]);

  const handleReset = useCallback(() => {
    if (confirm('Clear all scores?')) {
      setItems({});
      setNotes('');
      setCurrentStep(0);
      setShowReview(false);
    }
  }, []);

  const currentScore = calculateTotal(items);
  const answeredCount = Object.keys(items).length;
  const currentItem = NIHSS_ITEMS[currentStep];
  const currentValue = items[currentItem?.id] ?? -1;

  if (showReview) {
    return (
      <div className="space-y-6">
        {/* Review Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Review Assessment</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-5xl font-bold">{currentScore}</span>
            <span className="text-blue-200">/ 42</span>
          </div>
          <p className="text-xl font-semibold mt-1">{getSeverityLabel(getSeverity(currentScore))}</p>
          <p className="text-blue-100 text-sm mt-2">{answeredCount} of {NIHSS_ITEMS.length} items scored</p>
        </div>

        {/* Review List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Assessment Summary</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {NIHSS_ITEMS.map((item, index) => {
              const score = items[item.id] ?? -1;
              const option = item.options.find(o => o.value === score);
              
              return (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full text-sm flex items-center justify-center font-semibold ${
                      score >= 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {score >= 0 ? score : '—'}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">{option?.label || 'Not scored'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentStep(index);
                      setShowReview(false);
                    }}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional observations..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
          >
            Save Assessment
          </button>
          <button
            onClick={() => setShowReview(false)}
            className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-gray-300 transition-all"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Score</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-bold">{currentScore}</span>
              <span className="text-blue-200">/ 42</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Severity</p>
            <p className="text-2xl font-semibold mt-1">{getSeverityLabel(getSeverity(currentScore))}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-500/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-100">{answeredCount} of {NIHSS_ITEMS.length} items scored</span>
            <span className="text-blue-200">{Math.round((answeredCount / NIHSS_ITEMS.length) * 100)}% complete</span>
          </div>
          <div className="mt-2 bg-blue-900/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white/90 h-full transition-all duration-500"
              style={{ width: `${(answeredCount / NIHSS_ITEMS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-1 overflow-x-auto pb-2">
        {NIHSS_ITEMS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`flex-shrink-0 w-8 h-8 rounded-full text-sm font-semibold transition-all ${
              index === currentStep
                ? 'bg-blue-600 text-white'
                : index < currentStep || items[NIHSS_ITEMS[index].id] >= 0
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Current Item Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
              {currentStep + 1}
            </span>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{currentItem.name}</h3>
              <p className="text-sm text-gray-500">{currentItem.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {currentItem.options.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                currentValue === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                currentValue === option.value
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300'
              }`}>
                {currentValue === option.value && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1" onClick={() => handleScoreChange(currentItem.id, option.value)}>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">{option.value}</span>
                  <span className="font-semibold text-gray-700">{option.label}</span>
                </div>
                {option.description && (
                  <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>

        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 font-medium disabled:text-gray-400 hover:bg-gray-200 rounded-lg transition-all disabled:hover:bg-transparent"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <span className="text-sm text-gray-500 font-medium">
            {currentStep + 1} of {NIHSS_ITEMS.length}
          </span>

          <button
            onClick={() => setCurrentStep(prev => Math.min(NIHSS_ITEMS.length - 1, prev + 1))}
            disabled={currentStep === NIHSS_ITEMS.length - 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 font-medium disabled:text-gray-400 hover:bg-gray-200 rounded-lg transition-all disabled:hover:bg-transparent"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowReview(true)}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
        >
          Review & Save
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
