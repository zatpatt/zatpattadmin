import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserX, Users, CheckCircle } from "lucide-react";
import { getCustomerList } from "../../../services/customersApi";

export default function CustomerListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const list = await getCustomerList();
        setCustomers(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    c.full_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div>Loading customers...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-3">
        <Users size={26} className="text-orange-500" />
        <h2 className="text-xl font-semibold">Customers</h2>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white p-3 rounded-xl shadow">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-2 w-full outline-none"
        />
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow divide-y">
        {filtered.map((c) => (
          <div
            key={c.customer_id}
            className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            onClick={() =>
              navigate(`/admin/customers/${c.customer_id}`)
            }
          >
            <div>
              <div className="font-semibold">{c.full_name}</div>
              <div className="text-sm text-gray-500">
                {c.phone}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-sm">
                Orders: <strong>{c.total_orders}</strong>
              </div>

              <div className="text-sm flex items-center gap-1">
                Status:
                <span
                  className={`font-semibold ${
                    c.is_active
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {c.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {c.is_active ? (
                <div className="text-green-500 flex items-center text-sm">
                  <CheckCircle size={14} className="mr-1" />
                  Active
                </div>
              ) : (
                <div className="text-red-500 flex items-center text-sm">
                  <UserX size={14} className="mr-1" />
                  Blocked
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
