import axios from "axios";

const API_URL = "http://localhost:5000/api/subscription";

export const fetchMySubscription = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.subscription;
};
