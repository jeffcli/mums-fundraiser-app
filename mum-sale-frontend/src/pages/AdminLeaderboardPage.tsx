import { useEffect, useState } from "react";
import api from "../services/api";
import type { SellerLeaderboardEntry } from "../types/dashboard";

export default function AdminLeaderboardPage() {
  const [entries, setEntries] = useState<SellerLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await api.get<SellerLeaderboardEntry[]>(
          "/admin/dashboard/leaderboard",
        );
        setEntries(response.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Seller Leaderboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Ranked by total mums sold, then total amount fundraised.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-sm text-slate-600">
              Loading leaderboard...
            </div>
          ) : entries.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">
              No leaderboard data available yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Rank
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Seller
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Orders
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Total Sold
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                      Amount Fundraised
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {entries.map((entry, index) => (
                    <tr key={entry.userId} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                        #{index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-slate-500">{entry.username}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {entry.totalOrders}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {entry.totalQuantity}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900">
                        ${entry.totalRevenue}
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
