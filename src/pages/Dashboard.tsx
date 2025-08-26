import React, { useEffect, useState } from "react";
import {
  UserGroupIcon,
  CurrencyDollarIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { api } from "../lib/api";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import Button from "../components/ui/Button";
import { AddOutletModal } from "../modals/outlets";
import { AddLeadModal } from "../modals/leads";
import { AddTaskModal } from "../modals/tasks";
import { AddActivityModal } from "../modals/activities";

interface DashboardStats {
  leads: number;
  tasks: number; // Updated to match response
  outlets: number; // Updated to match response
  activities: number;
  totalRevenue: number;
  closedRevenue: number;
}

interface PipelineData {
  stage: string;
  count: number;
  value: number;
}

interface RecentActivity {
  id: string;
  type: string;
  subject: string;
  due_date: string;
  status: string;
  related_to: string;
}

interface NewOutlet {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  annualRevenue?: number;
  notes?: string;
}

interface NewTask {
  name: string;
  customerId?: string;
  amount: number;
  stage: string;
  probability: number;
  expectedCloseDate?: string;
  leadSource?: string;
  description?: string;
  assignedTo?: { id?: string; name?: string };
}

interface Activity {
  id: string;
  type: string;
  subject: string;
  description?: string;
  status: "planned" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  leadId?: string;
  opportunityId?: string;
  customerId?: string;
  assignedTo?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  assignedFirstName?: string;
  assignedLastName?: string;
  relatedTo?: string;
  relatedType?: "lead" | "opportunity" | "customer";
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    leads: 0,
    tasks: 0,
    outlets: 0,
    activities: 0,
    totalRevenue: 0,
    closedRevenue: 0,
  });
  const [pipeline, setPipeline] = useState<PipelineData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<NewTask>>({
    name: "",
    customerId: "",
    amount: 0,
    stage: "prospecting",
    probability: 10,
    expectedCloseDate: "",
    leadSource: "",
    description: "",
    assignedTo: { id: "", name: "" },
  });
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    type: "call",
    subject: "",
    description: "",
    status: "planned",
    priority: "low",
    dueDate: "",
    leadId: "",
    opportunityId: "",
    customerId: "",
    assignedTo: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      const { stats, pipeline, recentActivities, monthlyData } =
        response.data.data;

      setStats(
        stats || {
          leads: 0,
          tasks: 0,
          outlets: 0,
          activities: 0,
          totalRevenue: 0,
          closedRevenue: 0,
        }
      );
      setPipeline(pipeline || []);
      setRecentActivities(recentActivities || []);
      setMonthlyData(monthlyData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values on error
      setStats({
        leads: 0,
        tasks: 0,
        outlets: 0,
        activities: 0,
        totalRevenue: 0,
        closedRevenue: 0,
      });
      setPipeline([]);
      setRecentActivities([]);
      setMonthlyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOutlet = async (customerData: Partial<NewOutlet>) => {
    try {
      await api.post("/customers", customerData);
      setShowOutletModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleAddLead = async (leadData: any) => {
    try {
      await api.post("/leads", leadData);
      setShowAddLeadModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error("Error adding lead:", error);
    }
  };

  const handleAddTask = async (taskData: Partial<NewTask>) => {
    try {
      const opportunityData = {
        ...taskData,
        amount: taskData.amount ? Number(taskData.amount) : 0,
        probability: taskData.probability ? Number(taskData.probability) : 10,
      };
      await api.post("/opportunities", opportunityData);
      setShowAddTaskModal(false);
      setNewTask({
        name: "",
        customerId: "",
        amount: 0,
        stage: "prospecting",
        probability: 10,
        expectedCloseDate: "",
        leadSource: "",
        description: "",
        assignedTo: { id: "", name: "" },
      });
      fetchDashboardData();
    } catch (error) {
      console.error("Error creating opportunity:", error);
    }
  };

  const handleAddActivity = async (activityData: any) => {
    try {
      await api.post("/activities", activityData);
      setShowAddActivityModal(false);
      fetchDashboardData();
    } catch (error) {
      console.error("Error creating activity:", error);
    }
  };

  const statCards = [
    {
      name: "Total Leads",
      value: stats.leads,
      icon: UserGroupIcon,
      color: "primary",
      change: stats.leads > 0 ? "+12%" : "0%",
      changeType:
        stats.leads > 0 ? ("increase" as const) : ("neutral" as const),
    },
    {
      name: "Active Tasks",
      value: stats.tasks,
      icon: CurrencyDollarIcon,
      color: "success",
      change: stats.tasks > 0 ? "+8%" : "0%",
      changeType:
        stats.tasks > 0 ? ("increase" as const) : ("neutral" as const),
    },
    {
      name: "Outlets",
      value: stats.outlets,
      icon: BuildingOffice2Icon,
      color: "error",
      change: stats.outlets > 0 ? "+5%" : "0%",
      changeType:
        stats.outlets > 0 ? ("increase" as const) : ("neutral" as const),
    },
    {
      name: "Pending Activities",
      value: stats.activities,
      icon: CalendarDaysIcon,
      color: "warning",
      change: stats.activities > 0 ? "+15%" : "0%",
      changeType:
        stats.activities > 0 ? ("increase" as const) : ("neutral" as const),
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const defaultMonthlyData = [
    { month: "Jan", revenue: 0, opportunities: 0 },
    { month: "Feb", revenue: 0, opportunities: 0 },
    { month: "Mar", revenue: 0, opportunities: 0 },
    { month: "Apr", revenue: 0, opportunities: 0 },
    { month: "May", revenue: 0, opportunities: 0 },
    { month: "Jun", revenue: 0, opportunities: 0 },
  ];

  const stageColors: Record<string, string> = {
    prospecting: "#3B82F6",
    qualification: "#10B981",
    proposal: "#F59E0B",
    negotiation: "#8B5CF6",
    closed_won: "#059669",
    closed_lost: "#EF4444",
    new: "#3B82F6",
    contacted: "#10B981",
    qualified: "#F59E0B",
    presentation: "#8B5CF6",
    decision: "#059669",
    closed: "#EF4444",
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
            Welcome back! Here's what's happening with your sales.
          </p>
        </div>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="w-full md:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Export Report
          </Button>
          <Button
            className="w-full md:w-auto"
            onClick={() => setShowAddLeadModal(true)}
          >
            New Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.name}
              className="p-4 md:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-soft hover:shadow-medium transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {card.name}
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
                    {card.value.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    {card.changeType === "increase" ? (
                      <ArrowUpIcon className="h-4 w-4 text-success-500 dark:text-success-400 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-error-500 dark:text-error-400 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        card.changeType === "increase"
                          ? "text-success-600 dark:text-success-400"
                          : "text-error-600 dark:text-error-400"
                      }`}
                    >
                      {card.change}
                    </span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg bg-${card.color}-100 dark:bg-${card.color}-900/30`}
                >
                  <Icon
                    className={`h-6 w-6 text-${card.color}-600 dark:text-${card.color}-400`}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <Card
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-soft"
          padding="sm"
        >
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyData.length > 0 ? monthlyData : defaultMonthlyData}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E5E5"
                  className="dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="month"
                  stroke="#737373"
                  className="dark:stroke-gray-400"
                />
                <YAxis stroke="#737373" className="dark:stroke-gray-400" />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Pipeline */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-soft">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Sales Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pipeline.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-neutral-500 dark:text-neutral-400">
                No pipeline data available. Add opportunities to see the sales
                pipeline.
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pipeline}
                      cx="50%"
                      cy="50%"
                      innerRadius="30%"
                      outerRadius="60%"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pipeline.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={stageColors[entry.stage] || "#737373"}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Value",
                      ]}
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {pipeline.map((stage) => (
                    <div key={stage.stage} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            stageColors[stage.stage] || "#737373",
                        }}
                      ></div>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 capitalize">
                        {stage.stage.replace("_", " ")}: {stage.count}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Activities */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white">
                Recent Activities
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="dark:text-gray-300 dark:hover:bg-gray-700"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="flex items-center justify-center h-[200px] text-neutral-500 dark:text-neutral-400">
                No recent activities. Schedule an activity to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="w-2 h-10 rounded-full bg-primary-500 dark:bg-primary-400"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {activity.subject}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {activity.type} • {activity.related_to}
                      </p>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {new Date(activity.due_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-soft">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 lg:grid-rows-2 grid-cols-1 gap-4">
              <Button
                className="h-auto lg:h-[200px] flex items-center lg:flex-col bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
                onClick={() => setShowAddLeadModal(true)}
              >
                <UserGroupIcon className="lg:h-10 lg:w-10 h-5 w-5 mr-3" />
                Add New Lead
              </Button>
              <Button
                variant="outline"
                className="h-auto lg:h-[200px] flex items-center lg:flex-col dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setShowAddTaskModal(true)}
              >
                <CurrencyDollarIcon className="lg:h-10 lg:w-10 h-5 w-5 mr-3" />
                Create Task
              </Button>
              <Button
                variant="outline"
                className="h-auto lg:h-[200px] flex items-center lg:flex-col dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setShowOutletModal(true)}
              >
                <BuildingOffice2Icon className="lg:h-10 lg:w-10 h-5 w-5 mr-3" />
                Add Outlet
              </Button>
              <Button
                variant="outline"
                className="h-auto lg:h-[200px] flex items-center lg:flex-col dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setShowAddActivityModal(true)}
              >
                <CalendarDaysIcon className="lg:h-10 lg:w-10 h-5 w-5 mr-3" />
                Schedule Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddOutletModal
        isOpen={showOutletModal}
        onClose={() => setShowOutletModal(false)}
        onSave={handleCreateOutlet}
      />

      <AddLeadModal
        showAddModal={showAddLeadModal}
        setShowAddModal={setShowAddLeadModal}
        onAddLead={handleAddLead}
      />

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          handleAddTask(newTask);
        }}
        newTask={newTask as any}
        setNewTask={setNewTask as any}
      />

      <AddActivityModal
        isOpen={showAddActivityModal}
        onClose={() => setShowAddActivityModal(false)}
        onAdd={handleAddActivity as any}
      />
    </div>
  );
};

export default Dashboard;
