
// Mock database interface - in a real app you would use an actual database
interface Application {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  loanAmount: number;
  loanPurpose: string;
  employmentStatus: string;
  annualIncome: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// In-memory database
let applications: Application[] = [
  {
    id: '1',
    fullName: 'John Smith',
    email: 'john@example.com',
    phoneNumber: '(555) 123-4567',
    loanAmount: 25000,
    loanPurpose: 'Home Improvement',
    employmentStatus: 'Full-Time',
    annualIncome: 75000,
    status: 'approved',
    createdAt: '2024-05-01T10:30:00Z'
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    email: 'sarah@example.com',
    phoneNumber: '(555) 987-6543',
    loanAmount: 15000,
    loanPurpose: 'Debt Consolidation',
    employmentStatus: 'Part-Time',
    annualIncome: 45000,
    status: 'pending',
    createdAt: '2024-05-05T14:20:00Z'
  },
  {
    id: '3',
    fullName: 'Michael Brown',
    email: 'michael@example.com',
    phoneNumber: '(555) 456-7890',
    loanAmount: 50000,
    loanPurpose: 'Business Loan',
    employmentStatus: 'Self-Employed',
    annualIncome: 120000,
    status: 'approved',
    createdAt: '2024-05-08T09:15:00Z'
  },
  {
    id: '4',
    fullName: 'Jessica Williams',
    email: 'jessica@example.com',
    phoneNumber: '(555) 789-0123',
    loanAmount: 10000,
    loanPurpose: 'Education',
    employmentStatus: 'Student',
    annualIncome: 20000,
    status: 'rejected',
    createdAt: '2024-05-10T16:45:00Z'
  }
];

// Submit new application
export const submitApplication = async (application: Omit<Application, "id" | "status" | "createdAt">): Promise<Application> => {
  // In a real application, we would make an API call here
  const newApplication: Application = {
    ...application,
    id: Math.random().toString(36).substring(2, 9),
    status: Math.random() > 0.3 ? 'pending' : (Math.random() > 0.5 ? 'approved' : 'rejected'),
    createdAt: new Date().toISOString()
  };
  
  applications.push(newApplication);
  return newApplication;
};

// Get all applications
export const getApplications = async (): Promise<Application[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return applications;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  const allApplications = await getApplications();
  
  const totalApplications = allApplications.length;
  const totalApproved = allApplications.filter(app => app.status === 'approved').length;
  const totalRejected = allApplications.filter(app => app.status === 'rejected').length;
  const totalPending = allApplications.filter(app => app.status === 'pending').length;
  
  const averageLoanAmount = allApplications.reduce((sum, app) => sum + app.loanAmount, 0) / totalApplications;
  
  const approvalRate = totalApproved / totalApplications * 100;
  
  const loanPurposes = allApplications.reduce((acc, app) => {
    acc[app.loanPurpose] = (acc[app.loanPurpose] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    const monthStr = month.toLocaleString('default', { month: 'short' });
    
    // Filter applications for this month
    const monthApplications = allApplications.filter(app => {
      const appDate = new Date(app.createdAt);
      return appDate.getMonth() === month.getMonth() && 
             appDate.getFullYear() === month.getFullYear();
    });
    
    return {
      month: monthStr,
      applications: monthApplications.length,
      approvals: monthApplications.filter(app => app.status === 'approved').length,
      amount: monthApplications.reduce((sum, app) => sum + app.loanAmount, 0)
    };
  }).reverse();
  
  return {
    totalApplications,
    totalApproved,
    totalRejected,
    totalPending,
    averageLoanAmount,
    approvalRate,
    loanPurposes,
    monthlyData
  };
};
