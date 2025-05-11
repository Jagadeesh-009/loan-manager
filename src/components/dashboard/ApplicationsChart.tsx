
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface ChartData {
  month: string;
  applications: number;
  approvals: number;
  amount: number;
}

interface ApplicationsChartProps {
  data: ChartData[];
  type?: 'line' | 'bar';
  title?: string;
  className?: string;
}

export default function ApplicationsChart({ 
  data, 
  type = 'line', 
  title = "Monthly Applications", 
  className = "" 
}: ApplicationsChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    }
  }, [data]);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#0052CC"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="approvals" stroke="#36B37E" />
              </LineChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="applications" fill="#0052CC" />
                <Bar dataKey="approvals" fill="#36B37E" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
