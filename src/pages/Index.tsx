
import { useState } from "react";
import ApplicationForm from "@/components/ApplicationForm";
import Dashboard from "@/components/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshDashboard, setRefreshDashboard] = useState(0);
  
  const handleApplicationSubmit = () => {
    // Refresh dashboard data when a new application is submitted
    setRefreshDashboard(prev => prev + 1);
    // Switch to dashboard tab
    setActiveTab("dashboard");
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Loan Application System</h1>
        </div>
      </header>
      
      <main className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Apply</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" key={refreshDashboard}>
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="apply">
            <div className="max-w-xl mx-auto">
              <ApplicationForm onSubmitSuccess={handleApplicationSubmit} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-gray-100 p-4 mt-8 border-t">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Loan Application System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
