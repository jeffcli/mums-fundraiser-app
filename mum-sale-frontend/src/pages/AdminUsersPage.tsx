import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import api from "../services/api";
import type { CreateUserRequest, UserResponse } from "../types/auth";

const initialFormData: CreateUserRequest = {
  name: "",
  username: "",
  password: "",
  role: "SELLER",
};

export default function AdminUsersPage() {
  const [formData, setFormData] = useState<CreateUserRequest>(initialFormData);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const currentUsername = localStorage.getItem("username");

  async function fetchUsers() {
    try {
      const response = await api.get<UserResponse[]>("/admin/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await api.post<UserResponse>("/admin/users", formData);
      setUsers((prev) => [...prev, response.data]);
      setMessage(
        `Created ${response.data.role.toLowerCase()} account for ${response.data.name}.`,
      );
      setFormData(initialFormData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Create user error:", err);
      const responseData = err?.response?.data;

      if (responseData?.errors) {
        setFieldErrors(responseData.errors);
      }

      setError(responseData?.message || "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function toggleActive(user: UserResponse) {
    try {
      setMessage("");
      setError("");
      setUpdatingUserId(user.id);

      const response = await api.patch<UserResponse>(
        `/admin/users/${user.id}/active`,
        {
          active: !user.active,
        },
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? response.data : u)),
      );

      setMessage(
        `${response.data.name} has been ${
          response.data.active ? "reactivated" : "deactivated"
        }.`,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Toggle active error:", err);
      setError(err?.response?.data?.message || "Failed to update user status.");
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create accounts and manage who can access the system.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  placeholder="Maya Patel"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Username
                </label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  placeholder="maya"
                />
                {fieldErrors.username && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  placeholder="At least 6 characters"
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                >
                  <option value="SELLER">Seller</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {message && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {message}
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Existing Users
              </h2>
            </div>

            {loadingUsers ? (
              <div className="p-6 text-sm text-slate-600">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-6 text-sm text-slate-600">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Username
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((user) => {
                      const isCurrentUser = user.username === currentUsername;

                      return (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4 text-sm font-medium text-slate-900">
                            {user.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-700">
                            {user.username}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                user.role === "ADMIN"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                user.active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.active ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {isCurrentUser ? (
                              <span className="text-xs text-slate-500">
                                Current user
                              </span>
                            ) : (
                              <button
                                onClick={() => toggleActive(user)}
                                disabled={updatingUserId === user.id}
                                className={`rounded-lg px-3 py-2 text-xs font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                  user.active
                                    ? "bg-red-600 hover:bg-red-500"
                                    : "bg-green-600 hover:bg-green-500"
                                }`}
                              >
                                {updatingUserId === user.id
                                  ? "Updating..."
                                  : user.active
                                    ? "Deactivate"
                                    : "Reactivate"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
