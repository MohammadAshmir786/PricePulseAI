import { useEffect, useState } from "react";
import { fetchRecommendations } from "../services/recommendationService.js";

export function useRecommendations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRecommendations(8)
      .then((recs) => setItems(recs))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading };
}
