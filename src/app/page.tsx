import React from 'react';
import { KinksplorationHub } from '../components/KinksplorationHub';
import { HubDAL } from '../lib/hub-dal';

export const dynamic = 'force-dynamic';

type Activities = Awaited<ReturnType<typeof HubDAL.fetchActivities>>;

export default async function HomePage() {
  let activities: Activities = [];

  try {
    activities = await HubDAL.fetchActivities();
  } catch (error) {
    console.error('Failed to load activities:', error);
  }

  return (
    <main>
      <KinksplorationHub
        initialChecklistActivities={activities as any}
        currentUserId="user-1"
      />
    </main>
  );
}
