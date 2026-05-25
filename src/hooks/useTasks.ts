import { useState, useEffect, useCallback } from 'react';
import { API_URL, MESSAGES } from '../utils/constants';
import type { Task, TaskFormData, UseTasksReturn } from '../types';

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return await response.json();
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const validateTaskData = useCallback((taskData: TaskFormData): boolean => {
    if (!taskData.title.trim()) {
      setError(MESSAGES.ERROR_EMPTY_TITLE);
      return false;
    }
    return true;
  }, []);

  const fetchTasks = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<Task[]>(API_URL);
      setTasks(data);
    } catch (err) {
      setError(MESSAGES.ERROR_LOAD);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: TaskFormData): Promise<boolean> => {
    if (!validateTaskData(taskData)) return false;

    setSubmitting(true);
    setError(null);

    const tempId = -Date.now(); 
    const tempTask = { ...taskData, id: tempId, completed: false } as Task;

    setTasks((prev: Task[]) => [...prev, tempTask]);

    try {
      const savedTask = await apiRequest<Task>(API_URL, {
        method: "POST",
        body: JSON.stringify({ ...taskData, completed: false }),
      });

      setTasks((prev: Task[]) => prev.map((t: Task) => (t.id === tempId ? savedTask : t)));
      return true;
    } catch (err: any) {
      setTasks((prev: Task[]) => prev.filter((t: Task) => t.id !== tempId));
      setError(err.message || MESSAGES.ERROR_CREATE);
      console.error('Erro:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [validateTaskData]);

  const updateTask = useCallback(async (id: number, taskData: TaskFormData): Promise<boolean> => {
    if (!validateTaskData(taskData)) return false;

    setSubmitting(true);
    setError(null);

    let previousTasks: Task[] = [];
    setTasks((prev: Task[]) => {
      previousTasks = prev;
      return prev.map((t: Task) => (t.id === id ? { ...t, ...taskData } : t));
    });

    try {
      await apiRequest(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(taskData),
      });
      return true;
    } catch (err: any) {
      setTasks(previousTasks);
      setError(err.message || MESSAGES.ERROR_UPDATE);
      console.error('Erro:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [validateTaskData]);

  const toggleTask = useCallback(async (id: number): Promise<void> => {
    setError(null);
    let previousTasks: Task[] = [];

    setTasks((prev: Task[]) => {
      previousTasks = prev;
      return prev.map((t: Task) => (t.id === id ? { ...t, completed: !t.completed } : t));
    });

    try {
      await apiRequest(`${API_URL}/${id}/toggle`, { method: "PATCH" });
    } catch (err) {
      setTasks(previousTasks);
      setError(MESSAGES.ERROR_UPDATE);
      console.error('Erro:', err);
    }
  }, []);

  const deleteTask = useCallback(async (id: number): Promise<void> => {
    setError(null);
    let previousTasks: Task[] = [];

    setTasks((prev: Task[]) => {
      previousTasks = prev;
      return prev.filter((t: Task) => t.id !== id);
    });

    try {
      await apiRequest(`${API_URL}/${id}`, { method: "DELETE" });
    } catch (err) {
      setTasks(previousTasks);
      setError(MESSAGES.ERROR_DELETE);
      console.error('Erro:', err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    submitting,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    fetchTasks
  };
}