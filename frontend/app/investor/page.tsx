// frontend/app/investor/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConciergeRail } from "@/components/concierge-rail";
import { Search } from "lucide-react";
import Link from 'next/link';
import axios from 'axios';

// TYPES 


interface KpiData {
  availableBalance: string;
  committedCapital: string;
  activeProjects: number;
  unreadChats: number;
}

interface PipelineProject {
  id: string;
  name: string;
  stage: 'assess' | 'match' | 'mobilize';
}

interface Activity {
  id: string;
  description: string;
  timestamp: string;
}

interface InvestorDashboardData {
  kpis: KpiData;
  pipeline: PipelineProject[];
  recentActivity: Activity[];
}


// API CONFIGURATION 


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const API_ENDPOINTS = {
  DASHBOARD: `${API_BASE_URL}/investor/dashboard`,
  SEARCH: `${API_BASE_URL}/investor/search`,

};

// API SERVICE

const investorApi = {

  getDashboardData: async (): Promise<InvestorDashboardData> => {
    try {
      const response = await axios.get(API_ENDPOINTS.DASHBOARD, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
         
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  },

  // Search functionality
  search: async (query: string) => {
    try {
      const response = await axios.get(API_ENDPOINTS.SEARCH, {
        params: { q: query },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  },
};


// MOCK DATA 


const MOCK_DATA: InvestorDashboardData = {
  kpis: {
    availableBalance: "$128,400",
    committedCapital: "$86,200",
    activeProjects: 9,
    unreadChats: 5,
  },
  pipeline: [
    { id: '1', name: "Local‑first notes app", stage: 'assess' },
    { id: '2', name: "DePIN sensor mesh", stage: 'assess' },
    { id: '3', name: "Neurotech IDE", stage: 'assess' },
    { id: '4', name: "Edge AI vision kit", stage: 'match' },
    { id: '5', name: "Climate hardware v1", stage: 'match' },
    { id: '6', name: "Creator infra sync", stage: 'mobilize' },
    { id: '7', name: "Robotics firmware co‑pilot", stage: 'mobilize' },
  ],
  recentActivity: [
    { id: '1', description: "Milestone #2 accepted • Edge AI vision kit", timestamp: "2h ago" },
    { id: '2', description: "New project suggested in Climate • Hardware founders", timestamp: "1d ago" },
    { id: '3', description: "Funds released • $4,000 to Engineering", timestamp: "3d ago" },
    { id: '4', description: "Signed mutual NDA • Neurotech IDE", timestamp: "5d ago" },
  ],
};

// MAIN COMPONENT


export default function InvestorOverviewPage() {
  const [dashboardData, setDashboardData] = useState<InvestorDashboardData>(MOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Backend dev - Switch USE_MOCK_DATA to false when API is ready
      const USE_MOCK_DATA = true;
      
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setDashboardData(MOCK_DATA);
      } else {
        const data = await investorApi.getDashboardData();
        setDashboardData(data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const pipelineByStage = {
    assess: dashboardData.pipeline.filter(p => p.stage === 'assess'),
    match: dashboardData.pipeline.filter(p => p.stage === 'match'),
    mobilize: dashboardData.pipeline.filter(p => p.stage === 'mobilize'),
  };

  if (loading && !dashboardData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="flex gap-6">
        {/* Main column */}
        <div className="min-w-0 flex-1 space-y-6">
          <PageHeader />

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
              {error}
            </div>
          )}

          {/* KPIs minimal */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi title="Available balance" value={dashboardData.kpis.availableBalance} />
            <Kpi title="Committed capital" value={dashboardData.kpis.committedCapital} />
            <Kpi title="Active projects" value={dashboardData.kpis.activeProjects.toString()} />
            <Kpi title="Unread chats" value={dashboardData.kpis.unreadChats.toString()} />
          </div>

          {/* Notion-like blocks */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="bg-[#101113] border-[#1a1b1e] lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Column 
                    title="Assess" 
                    items={pipelineByStage.assess.map(p => p.name)} 
                  />
                  <Column 
                    title="Match" 
                    items={pipelineByStage.match.map(p => p.name)} 
                  />
                  <Column 
                    title="Mobilize" 
                    items={pipelineByStage.mobilize.map(p => p.name)} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#101113] border-[#1a1b1e]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Discover</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <SearchInput />
                <div className="flex gap-2">
                  {["Climate", "Edge AI", "Local‑first"].map((t) => (
                    <span
                      key={t}
                      className="text-xs rounded-md border border-[#1a1b1e] bg-[#0f1012] px-2 py-1 text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity */}
          <Card className="bg-[#101113] border-[#1a1b1e]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {dashboardData.recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-start gap-3">
                    <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-white/50" />
                    <div>
                      <div>{activity.description}</div>
                      <div className="text-white/50 text-xs">{activity.timestamp}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Concierge rail */}
        <ConciergeRail />
      </div>
    </div>
  );
}


// SUBCOMPONENTS


function PageHeader() {
  return (
    <div className="rounded-lg border border-[#1a1b1e] bg-[#101113] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div>
          <div className="text-sm text-white/60">Welcome back</div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Investor overview</h1>
          <p className="text-white/70 text-sm mt-1">
            Clean, minimal, precise. Your capital and conversations at a glance.
          </p>
        </div>
        
        <div className="sm:ml-auto flex items-center gap-2">
          <Link href="/search" passHref>
            <button
              className="rounded-md bg-white text-[#0b0b0c] hover:bg-white/90 flex items-center px-3 py-2"
              type="button"
            >
              <Search className="mr-2 h-4 w-4" />
              Discover
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Kpi({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#1a1b1e] bg-[#101113] p-4">
      <div className="text-xs text-white/60">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-[#1a1b1e] bg-[#0f1012] p-3">
      <div className="text-xs uppercase tracking-[0.2em] text-white/50">{title}</div>
      <ul className="mt-2 space-y-2">
        {items.map((it) => (
          <li key={it} className="rounded-md border border-[#1a1b1e] bg-[#101113] px-3 py-2">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchInput() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // TODO: Backend dev - Switch USE_MOCK_DATA to false when API is ready
      const USE_MOCK_DATA = true;
      
      if (USE_MOCK_DATA) {
        console.log('Mock search for:', searchQuery);
      } else {
        const results = await investorApi.search(searchQuery);
        console.log('Search results:', results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-2 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          aria-label="Discover input"
          placeholder="Search domains, founders…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-full rounded-md bg-[#0f1012] border border-[#1a1b1e] pl-8 pr-2 text-sm outline-none placeholder:text-white/40"
        />
      </div>
    </form>
  );
}