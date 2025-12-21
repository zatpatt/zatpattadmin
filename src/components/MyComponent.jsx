// src/components/MyComponent.jsx
import { useEffect, useState } from "react";
import { getOrdersList, createOrder } from "../services/ordersApi";

export default function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdersList()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    await createOrder({
      item: "Milk",
      qty: 2,
    });

    // reload after submit
    const updated = await getOrdersList();
    setData(updated);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>

      {data.map((d) => (
        <p key={d.order_id}>
          {d.order_code} - {d.customer_name}
        </p>
      ))}
    </div>
  );
}
