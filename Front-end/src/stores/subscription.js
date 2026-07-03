import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subscription';

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const useSubscriptionStore = defineStore('subscription', () => {
  const subscription = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetch = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get(`${API_URL}/me`, getHeaders());
      subscription.value = data.subscription;
    } catch (err) {
      error.value = err;
      console.error("Failed to load subscription:", err);
    } finally {
      loading.value = false;
    }
  };

  const refresh = () => {
    subscription.value = null;
    error.value = null;
    return fetch();
  };

  return { subscription, loading, error, fetch, refresh };
});
