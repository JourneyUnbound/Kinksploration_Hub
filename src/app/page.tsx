import React from 'react';
import { KinksplorationHub } from '../components/KinksplorationHub';
import { HubDAL } from '../lib/hub-dal';

// This is a Server Component that fetches initial data
export default async function HomePage() {
  // Fetch activities from Supabase for the checklist
  const activities = await HubDAL.fetchActivities();
  
  return (
    <main>
      <KinksplorationHub 
        initialChecklistActivities={activities} 
        currentUserId="user-1" 
      />
    </main>
  );
}
