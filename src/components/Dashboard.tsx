
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getDashboardStats } from "@/services/api";
import StatsCard from "./dashboard/StatsCard";
import ApplicationsChart from "./dashboard/ApplicationsChart";
import LoanPurposesChart from "./dashboard/LoanPurposesChart";
import { FileText, BarChart, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  totalApplications: number;
  totalApproved: number;
  totalRejected: number;
  totalPending: number;
  averageLoanAmount: number;
  approvalRate: number;
  loanPurposes: Record<string, number>;
  monthlyData: Array<{
    month: string;
    applications: number;
    approvals: number;
    amount: number;
  }>;
}

export default function Dashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard statistics. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadDashboardStats();
  }, []);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Loan Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          value={stats?.totalApplications || 0}
          icon={<FileText />}
        />
        <StatsCard
          title="Approved"
          value={stats?.totalApproved || 0}
          description={`${stats?.approvalRate.toFixed(1)}% approval rate`}
          icon={<CheckCircle />}
          className="border-l-4 border-secondary"
        />
        <StatsCard
          title="Rejected"
          value={stats?.totalRejected || 0}
          icon={<AlertTriangle />}
          className="border-l-4 border-destructive"
        />
        <StatsCard
          title="Pending Review"
          value={stats?.totalPending || 0}
          icon={<Clock />}
          className="border-l-4 border-amber-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Loan Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {stats ? formatCurrency(stats.averageLoanAmount) : "$0"}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-secondary mr-2"></div>
                  <span>Approved</span>
                  <span className="font-bold ml-2">{stats?.totalApproved || 0}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-destructive mr-2"></div>
                  <span>Rejected</span>
                  <span className="font-bold ml-2">{stats?.totalRejected || 0}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                  <span>Pending</span>
                  <span className="font-bold ml-2">{stats?.totalPending || 0}</span>
                </div>
              </div>
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{stats?.totalApplications || 0}</span>
                </div>
                <svg className="h-24 w-24" viewBox="0 0 36 36">
                  {/* Approved - green */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#36B37E"
                    strokeWidth="2"
                    strokeDasharray={`${stats ? (stats.totalApproved / stats.totalApplications) * 100 : 0}, 100`}
                    strokeDashoffset="0"
                  />
                  {/* Rejected - red */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#FF5630"
                    strokeWidth="2"
                    strokeDasharray={`${stats ? (stats.totalRejected / stats.totalApplications) * 100 : 0}, 100`}
                    strokeDashoffset={`${stats ? -((stats.totalApproved / stats.totalApplications) * 100) : 0}`}
                  />
                  {/* Pending - amber */}
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray={`${stats ? (stats.totalPending / stats.totalApplications) * 100 : 0}, 100`}
                    strokeDashoffset={`${stats ? -(((stats.totalApproved + stats.totalRejected) / stats.totalApplications) * 100) : 0}`}
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ApplicationsChart 
          data={stats?.monthlyData || []}
          className="lg:col-span-2"
        />
        <LoanPurposesChart 
          data={stats?.loanPurposes || {}}
          className="lg:col-span-1"
        />
      </div>
      
      <div className="mt-6">
        <ApplicationsChart 
          data={stats?.monthlyData || []}
          type="bar"
          title="Monthly Applications & Approvals"
        />
      </div>
    </div>
  );
}
