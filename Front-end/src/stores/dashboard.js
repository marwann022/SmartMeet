import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const useDashboardStore = defineStore('dashboard', () => {
  const stats = ref({ meetingsThisWeek: 0, tasksCompletedThisWeek: 0, productivityChange: 0 });
  const chartData = ref([]);
  const chartPeriod = ref('week');
  const insights = ref([]);
  const teamAnalytics = ref(null);
  
  const loading = ref({
    stats: false,
    chart: false,
    insights: false,
    teamAnalytics: false
  });
  
  const errors = ref({
    stats: null,
    chart: null,
    insights: null,
    teamAnalytics: null
  });

  const fetchStats = async () => {
    loading.value.stats = true;
    errors.value.stats = null;
    try {
      const { data } = await axios.get(`${API}/dashboard/stats`, getHeaders());
      if (data.success) {
        stats.value = data.stats;
      }
    } catch (err) {
      errors.value.stats = 'Failed to load dashboard statistics.';
      console.error(err);
    } finally {
      loading.value.stats = false;
    }
  };

  const fetchChartData = async (period = 'week') => {
    loading.value.chart = true;
    errors.value.chart = null;
    chartPeriod.value = period;
    try {
      const { data } = await axios.get(`${API}/dashboard/chart?period=${period}`, getHeaders());
      if (data.success) {
        chartData.value = data.chartData;
      }
    } catch (err) {
      errors.value.chart = 'Failed to load activity chart.';
      console.error(err);
    } finally {
      loading.value.chart = false;
    }
  };

  const fetchInsights = async () => {
    loading.value.insights = true;
    errors.value.insights = null;
    try {
      const { data } = await axios.get(`${API}/dashboard/insights`, getHeaders());
      if (data.success) {
        insights.value = data.insights;
      }
    } catch (err) {
      errors.value.insights = 'Failed to load AI insights.';
      console.error(err);
    } finally {
      loading.value.insights = false;
    }
  };

  const fetchTeamAnalytics = async () => {
    loading.value.teamAnalytics = true;
    errors.value.teamAnalytics = null;
    try {
      const { data } = await axios.get(`${API}/dashboard/team-analytics`, getHeaders());
      if (data.success) {
        teamAnalytics.value = data.analytics;
      }
    } catch (err) {
      errors.value.teamAnalytics = 'Failed to load team analytics.';
      console.error(err);
    } finally {
      loading.value.teamAnalytics = false;
    }
  };

  return {
    stats,
    chartData,
    chartPeriod,
    insights,
    teamAnalytics,
    loading,
    errors,
    fetchStats,
    fetchChartData,
    fetchInsights,
    fetchTeamAnalytics
  };
});
