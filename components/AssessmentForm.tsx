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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleScoreChange = useCallback((itemId: string, value: number) => {
    setItems(prev => ({ ...prev, [itemId]: value }));
  }, []);

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
  }, [items, notes, onSave]);

  const handleReset = useCallback(() => {
    if (confirm('Clear all scores?')) {
      setItems({});
      setNotes('');
    }
  }, []);

  const currentScore = calculateTotal(items);
  const answeredCount = Object.keys(items).length;
  const totalItems = NIHSS_ITEMS.length;

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
            <span className="text-blue-100">{answeredCount} of {totalItems} items scored</span>
            <span className="text-blue-200">{Math.round((answeredCount / totalItems) * 100)}% complete</span>
          </div>
          <div className="mt-2 bg-blue-900/30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white/90 h-full transition-all duration-500"
              style={{ width: `${(answeredCount / totalItems) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Assessment Items */}
      <div className="space-y-3">
        {NIHSS_ITEMS.map((item, index) => {
          const currentValue = items[item.id] ?? -1;
          const isExpanded = expandedItem === item.id;
          
          return (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {currentValue >= 0 ? (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                      {currentValue}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-400 text-sm">
                      —
                    </span>
                  )}
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="pt-4 grid gap-2">
                    {item.options.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          currentValue === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={item.id}
                          value={option.value}
                          checked={currentValue === option.value}
                          onChange={() => handleScoreChange(item.id, option.value)}
                          className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{option.value} — {option.label}</span>
                          </div>
                          {option.description && (
                            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
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
          disabled={answeredCount === 0}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:bg-gray-300 disabled:shadow-none transition-all"
        >
          Save Assessment
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
