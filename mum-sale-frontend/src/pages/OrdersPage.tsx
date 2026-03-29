import { useEffect, useState } from "react";
import api from "../services/api";
import type { Order } from "../types/order";

const statusOptions = ["", "New", "Delivered"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const role = localStorage.getItem("role");

  async function fetchOrders(status?: string) {
    try {
      setLoading(true);

      const response = await api.get<Order[]>("/orders", {
        params: status ? { status } : {},
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders(statusFilter);
  }, [statusFilter]);

  async function markDelivered(orderId: number) {
    try {
      setUpdatingOrderId(orderId);

      const response = await api.patch<Order>(`/orders/${orderId}/status`, {
        status: "DELIVERED",
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? response.data : order,
        ),
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  function getStatusClasses(status?: string) {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "New":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {role === "ADMIN" ? "All Orders" : "My Orders"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              View submitted mum sale orders and update delivery status.
            </p>
          </div>

          <div className="w-full sm:w-56">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
            >
              {statusOptions.map((status) => (
                <option key={status || "ALL"} value={status}>
                  {status || "All statuses"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-sm text-slate-600">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Seller
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Color
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm text-slate-900">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-slate-500">{order.phone}</div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        <div className="font-medium">
                          {order.user?.name ?? "Unknown"}
                        </div>
                        <div className="text-slate-500">
                          {order.user?.username ?? ""}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {order.mumColor}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {order.quantity}
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        ${order.totalPrice}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-700">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        {order.status === "DELIVERED" ? (
                          <span className="text-xs font-medium text-slate-500">
                            Completed
                          </span>
                        ) : (
                          <button
                            onClick={() => markDelivered(order.id!)}
                            disabled={updatingOrderId === order.id}
                            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingOrderId === order.id
                              ? "Updating..."
                              : "Mark Delivered"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
