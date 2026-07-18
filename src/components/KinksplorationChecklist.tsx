import React, { useState, useEffect, useMemo } from 'react';
import { HubDAL } from '../lib/hub-dal';
import { KinksplorationStorage } from '../lib/local-storage';
import type { Activity, Need, ChecklistResponse } from '../lib/hub-types';

export default function KinksplorationChecklist() {
  // --- State Management ---
  const [activities, setActivities] = useState<Activity[]>([]);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [userResponses, setUserResponses] = useState<ChecklistResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Filter and Search UI State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // --- Load Data on Component Mount ---
  useEffect(() => {
    async function loadChecklistData() {
      try {
        setIsLoading(true);
        const [fetchedActivities, fetchedNeeds] = await Promise.all([
          HubDAL.fetchActivities(),
          HubDAL.fetchNeeds(),
        ]);
        
        setActivities(fetchedActivities);
        setNeeds(fetchedNeeds);
        
        // Sync with local storage user session records
        const savedResponses = KinksplorationStorage.getChecklistResponses();
        setUserResponses(savedResponses);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize Checklist components.');
      } finally {
        setIsLoading(false);
      }
    }

    loadChecklistData();
  }, []);

  // --- Helper: Find or Create a Response Reference ---
  const getResponseForActivity = (activityId: string): ChecklistResponse => {
    return userResponses.find(r => r.activityId === activityId) || {
      activityId,
      ratingStars: 0,
      experienceStatus: 'Unexplored',
      isHardLimit: false,
      isSoftLimit: false,
      fetishToggle: false,
      personalNotes: '',
      markVisited: false,
    };
  };

  // --- Handler: Single-Field Delta Updates ---
  const updateResponse = (activityId: string, updates: Partial<ChecklistResponse>) => {
    const target = getResponseForActivity(activityId);
    const updatedRecord: ChecklistResponse = { ...target, ...updates };
    
    // Business Rule Enforcement: If marked as Hard Limit, clear soft limit conflicts
    if (updates.isHardLimit) {
      updatedRecord.isSoftLimit = false;
    }
    if (updates.isSoftLimit) {
      updatedRecord.isHardLimit = false;
    }

    const nextResponses = userResponses.filter(r => r.activityId !== activityId);
    nextResponses.push(updatedRecord);
    
    setUserResponses(nextResponses);
    KinksplorationStorage.saveChecklistResponses(nextResponses);
  };

  // --- Computed Metrics ---
  const categories = useMemo(() => {
    const list = new Set(activities.map(a => a.category).filter(Boolean));
    return ['All', ...Array.from(list)] as string[];
  }, [activities]);

  const completionMetrics = useMemo(() => {
    if (activities.length === 0) return { total: 0, completed: 0, percent: 0 };
    const answeredCount = userResponses.filter(r => 
      r.ratingStars > 0 || r.isHardLimit || r.isSoftLimit || r.markVisited
    ).length;
    return {
      total: activities.length,
      completed: answeredCount,
      percent: Math.round((answeredCount / activities.length) * 100),
    };
  }, [activities, userResponses]);

  // --- Filter Logic ---
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const response = getResponseForActivity(activity.id);
      
      const matchesSearch = 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.aliases.some(alias => alias.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesCategory = selectedCategory === 'All' || activity.category === selectedCategory;
      
      let matchesStatus = true;
      if (statusFilter === 'Hard Limit') matchesStatus = response.isHardLimit;
      else if (statusFilter === 'Soft Limit') matchesStatus = response.isSoftLimit;
      else if (statusFilter === 'Fetish') matchesStatus = response.fetishToggle;
      else if (statusFilter === 'Visited') matchesStatus = response.markVisited;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [activities, searchTerm, selectedCategory, statusFilter, userResponses]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Kinksploration™ Catalogs...</div>;
  if (error) return <div className="p-8 text-red-500 bg-red-50 border border-red-200 rounded">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      
      {/* Header & Metrics */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Kinksploration™ Checklist</h1>
          <p className="text-sm text-gray-500 mt-1">Authoritative Activity Inventory</p>
        </div>
        
        {/* Progress Tracker */}
        <div className="bg-gray-50 p-4 border rounded-xl min-w-[240px]">
          <div className="flex justify-between text-sm font-semibold mb-2">
            <span className="text-gray-600">Dynamic Progress</span>
            <span className="text-indigo-600">{completionMetrics.percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${completionMetrics.percent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">
            {completionMetrics.completed} of {completionMetrics.total} Items Configured
          </p>
        </div>
      </header>

      {/* Control Panel: Filters, Search, Category Selector */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 border rounded-xl shadow-sm">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Search Activities</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-indigo-500"
            placeholder="Search by name or alias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Filter Category</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-indigo-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Limit / Preference Filter</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-indigo-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Items</option>
            <option value="Hard Limit">Hard Limits Only</option>
            <option value="Soft Limit">Soft Limits Only</option>
            <option value="Fetish">Fetish Toggles</option>
            <option value="Visited">Marked Visited</option>
          </select>
        </div>
      </section>

      {/* Activity Evaluation Matrix */}
      <main className="space-y-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl text-gray-400 text-sm">
            No matching items found in the configuration catalogs.
          </div>
        ) : (
          filteredActivities.map(activity => {
            const currentResponse = getResponseForActivity(activity.id);
            
            // Resolve associated NVC Needs by matching activity category or tag mappings
            const resolvedNeeds = needs.filter(n => n.category === activity.category);

            return (
              <article 
                key={activity.id} 
                className={`p-5 border rounded-xl bg-white shadow-sm transition-all duration-150 ${
                  currentResponse.isHardLimit ? 'border-red-300 bg-red-50/20' : 
                  currentResponse.isSoftLimit ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  
                  {/* Info Column */}
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-900">{activity.name}</h3>
                      {activity.subgroup && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                          {activity.subgroup}
                        </span>
                      )}
                      {currentResponse.isHardLimit && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded">Hard Limit</span>
                      )}
                      {currentResponse.isSoftLimit && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded">Soft Limit</span>
                      )}
                    </div>
                    
                    {activity.tooltip && <p className="text-sm text-gray-600 italic">{activity.tooltip}</p>}
                    
                    {activity.aliases && activity.aliases.length > 0 && (
                      <p className="text-xs text-gray-400">Aliases: {activity.aliases.join(', ')}</p>
                    )}

                    {/* Resolved NVC Needs Mapping */}
                    {resolvedNeeds.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-gray-400 block mb-1">Associated NVC Needs:</span>
                        <div className="flex flex-wrap gap-1">
                          {resolvedNeeds.map(need => (
                            <span 
                              key={need.id} 
                              className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md"
                              title={need.description || undefined}
                            >
                              {need.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interaction Matrix Column */}
                  <div className="flex flex-wrap items-center gap-4 lg:self-center border-t lg:border-t-0 pt-4 lg:pt-0">
                    
                    {/* Star Preferences Selector */}
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase text-gray-400 mb-1">Interest</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((stars) => (
                          <button
                            key={stars}
                            type="button"
                            className={`text-xl transition-transform active:scale-95 ${
                              stars <= currentResponse.ratingStars ? 'text-indigo-600' : 'text-gray-200'
                            }`}
                            onClick={() => updateResponse(activity.id, { ratingStars: stars })}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hard Limit Toggle */}
                    <button
                      type="button"
                      className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors ${
                        currentResponse.isHardLimit 
                          ? 'bg-red-600 text-white border-red-600' 
                          : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                      }`}
                      onClick={() => updateResponse(activity.id, { isHardLimit: !currentResponse.isHardLimit })}
                    >
                      Hard Limit
                    </button>

                    {/* Soft Limit Toggle */}
                    <button
                      type="button"
                      className={`px-3 py-1.5 text-xs font-bold border rounded-lg transition-colors ${
                        currentResponse.isSoftLimit 
                          ? 'bg-amber-500 text-white border-amber-500' 
                          : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'
                      }`}
                      onClick={() => updateResponse(activity.id, { isSoftLimit: !currentResponse.isSoftLimit })}
                    >
                      Soft Limit
                    </button>

                    {/* Fetish Toggle */}
                    <label className="flex flex-col items-center cursor-pointer select-none">
                      <span className="text-[10px] font-bold uppercase text-gray-400 mb-1">Fetish</span>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        checked={currentResponse.fetishToggle}
                        onChange={(e) => updateResponse(activity.id, { fetishToggle: e.target.checked })}
                      />
                    </label>

                    {/* Visited Checkbox */}
                    <label className="flex flex-col items-center cursor-pointer select-none">
                      <span className="text-[10px] font-bold uppercase text-gray-400 mb-1">Visited</span>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        checked={currentResponse.markVisited}
                        onChange={(e) => updateResponse(activity.id, { markVisited: e.target.checked })}
                      />
                    </label>
                  </div>

                </div>

                {/* Free-form Personal Notes Input */}
                <div className="mt-3.5 pt-3 border-t border-gray-100">
                  <input
                    type="text"
                    className="w-full bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-xs border border-transparent hover:border-gray-200 focus:border-indigo-500 rounded-lg px-3 py-2 text-gray-700 focus:outline-none transition-all"
                    placeholder="Add personal notes, situational constraints, or context adjustments for this activity..."
                    value={currentResponse.personalNotes || ''}
                    onChange={(e) => updateResponse(activity.id, { personalNotes: e.target.value })}
                  />
                </div>

              </article>
            );
          })
        )}
      </main>

    </div>
  );
}