import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    console.log(token);
    try {
      const response = await fetch(url, { headers });
      const result = await response.text();

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Project not found or no tasks associated with it.");
        }
        throw new Error(result.message || "Failed to fetch data");
      }

      const parsedResult = result ? JSON.parse(result) : [];
      setData(parsedResult);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};
export default useFetch;
