import React, { useState, useEffect, memo } from "react";
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import api from "../lib/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Task, TasksResponse } from "../types/tasks";
import { ViewTaskModal, AddTaskModal, EditTaskModal } from "../modals/tasks";
import { useAuth } from "../contexts/AuthContext";
import {
  TaskStage,
  TASK_STAGES,
  TaskStatus,
} from "../constants/TaskConstants";
import { formatDate } from "../utils/formatters";

const stageColors: Record<TaskStage, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  CONTACTED:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  DEMO: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  OFFER_SENT: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  NEGOTIATION: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  FINALIZING:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  WON: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  LOST: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const getTaskStageOptions = () => {
  return Object.entries(TASK_STAGES).map(([key, value]) => ({
    value: key as TaskStage,
    label: value,
  }));
};

const TaskCard = memo(
  ({
    task,
    setSelectedTask,
    setEditingTask,
    setNewTask,
    setShowViewModal,
    setShowEditModal,
    handleDeleteTask,
  }: {
    task: Task;
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
    setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
    setNewTask: React.Dispatch<React.SetStateAction<Partial<Task>>>;
    setShowViewModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteTask: (id: string) => void;
  }) => {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white truncate">
              {task.name}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
              Outlet: {task.outlet?.outletName || "N/A"}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
              Stage: {TASK_STAGES[task.stage] || task.stage}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
              Assigned To: {task.assignedTo?.name || "N/A"}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
              Expected Close:{" "}
              {task.expectedCloseDate
                ? formatDate(task.expectedCloseDate)
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setSelectedTask(task);
              setShowViewModal(true);
            }}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingTask(task);
              setNewTask({
                name: task.name,
                outletId: task.outletId || "",
                amount: task.amount,
                stage: task.stage,
                probability: task.probability,
                expectedCloseDate: task.expectedCloseDate || "",
                leadSource: task.leadSource || "",
                description: task.description || "",
                assignedTo: task.assignedTo || { id: "", name: "" },
              });
              setShowEditModal(true);
            }}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteTask(task.id)}
            className="flex-1 text-error-600 hover:text-error-900"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </Card>
    );
  }
);
TaskCard.displayName = "TaskCard";

const TaskTable = memo(
  ({
    tasks,
    setSelectedTask,
    setEditingTask,
    setNewTask,
    setShowViewModal,
    setShowEditModal,
    handleDeleteTask,
  }: {
    tasks: Task[];
    setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
    setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
    setNewTask: React.Dispatch<React.SetStateAction<Partial<Task>>>;
    setShowViewModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteTask: (id: string) => void;
  }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Outlet Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Expected Close Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                  {task.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                  {task.outlet?.outletName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      stageColors[task.stage] ||
                      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {TASK_STAGES[task.stage] || task.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                  {task.assignedTo?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                  {task.expectedCloseDate
                    ? formatDate(task.expectedCloseDate)
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowViewModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setNewTask({
                          name: task.name,
                          outletId: task.outletId || "",
                          amount: task.amount,
                          stage: task.stage,
                          probability: task.probability,
                          expectedCloseDate: task.expectedCloseDate || "",
                          leadSource: task.leadSource || "",
                          description: task.description || "",
                          assignedTo: task.assignedTo || { id: "", name: "" },
                        });
                        setShowEditModal(true);
                      }}
                      className="text-warning-600 hover:text-warning-900 dark:text-warning-400 dark:hover:text-warning-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-error-600 hover:text-error-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);
TaskTable.displayName = "TaskTable";

const Tasks: React.FC = memo(() => {
  const { user, isLoading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<TaskStage | "">("");
  const [minAmountFilter, setMinAmountFilter] = useState("");
  const [maxAmountFilter, setMaxAmountFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    name: "",
    outletId: "",
    amount: 0,
    stage: "NEW" as TaskStage,
    status: "PENDING" as TaskStatus,
    probability: 10,
    expectedCloseDate: "",
    leadSource: "",
    description: "",
    assignedTo: { id: "", name: "" },
  });

  useEffect(() => {
    if (!authLoading && user) {
      fetchTasks();
    }
  }, [
    pagination.page,
    searchTerm,
    stageFilter,
    minAmountFilter,
    maxAmountFilter,
    authLoading,
    user,
  ]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(stageFilter && { stage: stageFilter }),
        ...(minAmountFilter && { minAmount: minAmountFilter }),
        ...(maxAmountFilter && { maxAmount: maxAmountFilter }),
      });

      const response = await api.get<TasksResponse>(`/tasks?${params}`);
      const { tasks: rawTasks, pagination: pag } = response.data.data;
      const parsedTasks = rawTasks.map((t: any) => ({
        ...t,
        id: t.id.toString(),
        amount: parseFloat(t.amount),
        outletId: t.outletId?.toString(),
        stage: t.stage as TaskStage,
        assignedTo: t.assignedTo
          ? { id: t.assignedTo.id.toString(), name: t.assignedTo.name }
          : undefined,
        createdBy: t.createdBy
          ? { id: t.createdBy.id.toString(), name: t.createdBy.name }
          : undefined,
        outlet: t.outlet
          ? {
              ...t.outlet,
              id: t.outlet.id.toString(),
            }
          : undefined,
      }));
      setTasks(parsedTasks);
      setPagination(pag);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        outletId: Number(newTask.outletId),
        amount: newTask.amount ? Number(newTask.amount) : 0,
        probability: newTask.probability ? Number(newTask.probability) : 10,
        assignedTo: Number(newTask.assignedTo?.id),
      };
      await api.post("/tasks", taskData);
      setShowAddModal(false);
      setNewTask({
        name: "",
        outletId: "",
        amount: 0,
        stage: "NEW" as TaskStage,
        probability: 10,
        expectedCloseDate: "",
        leadSource: "",
        description: "",
        assignedTo: { id: "", name: "" },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleEditTask = async (e: React.FormEvent, taskId: string) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        outletId: Number(newTask.outletId),
        amount: newTask.amount ? Number(newTask.amount) : 0,
        probability: newTask.probability ? Number(newTask.probability) : 10,
        assignedTo: Number(newTask.assignedTo?.id),
      };
      await api.put(`/tasks/${taskId}`, taskData);
      setShowEditModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <div>Please log in to view tasks.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Tasks
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage and monitor all sales tasks
          </p>
        </div>
        <Button
          onClick={() => {
            setNewTask({
              name: "New Task",
              outletId: "",
              amount: 0,
              stage: "NEW" as TaskStage,
              status: "PENDING" as TaskStatus,
              probability: 10,
              expectedCloseDate: "",
              leadSource: "",
              description: "",
              assignedTo: { id: "", name: "" },
            });
            setShowAddModal(true);
          }}
        >
          Add New Task
        </Button>
      </div>

      <Card padding="sm">
        <div className="p-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPagination({ ...pagination, page: 1 });
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <select
                value={stageFilter}
                onChange={(e) => {
                  setStageFilter(e.target.value as TaskStage | "");
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white w-full md:w-auto"
              >
                <option value="">All Stages</option>
                {getTaskStageOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min Amount"
                value={minAmountFilter}
                onChange={(e) => {
                  setMinAmountFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-24"
                min={0}
              />
              <Input
                type="number"
                placeholder="Max Amount"
                value={maxAmountFilter}
                onChange={(e) => {
                  setMaxAmountFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-24"
                min={0}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStageFilter("");
                setMinAmountFilter("");
                setMaxAmountFilter("");
                setPagination({ ...pagination, page: 1 });
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      <Card padding="sm">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <TaskTable
                  tasks={tasks}
                  setSelectedTask={setSelectedTask}
                  setEditingTask={setEditingTask}
                  setNewTask={setNewTask}
                  setShowViewModal={setShowViewModal}
                  setShowEditModal={setShowEditModal}
                  handleDeleteTask={handleDeleteTask}
                />
              </div>

              <div className="md:hidden space-y-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    setSelectedTask={setSelectedTask}
                    setEditingTask={setEditingTask}
                    setNewTask={setNewTask}
                    setShowViewModal={setShowViewModal}
                    setShowEditModal={setShowEditModal}
                    handleDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>

              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    No tasks found
                  </p>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <ViewTaskModal
        task={selectedTask}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
      />

      <AddTaskModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
        newTask={newTask}
        setNewTask={setNewTask}
      />

      <EditTaskModal
        task={editingTask}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        onSubmit={handleEditTask}
        formData={newTask}
        setFormData={setNewTask}
      />
    </div>
  );
});

Tasks.displayName = "Tasks";

export default Tasks;
