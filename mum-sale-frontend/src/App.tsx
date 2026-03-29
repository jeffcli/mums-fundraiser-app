import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NewOrderPage from "./pages/NewOrderPage";
import OrdersPage from "./pages/OrdersPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AdminLeaderboardPage from "./pages/AdminLeaderboardPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const linkClasses = (path: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? "bg-slate-900 text-white"
        : "text-slate-700 hover:bg-slate-200"
    }`;

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Mum Sale Fundraiser
            </h1>
            <p className="text-xs text-slate-500">
              Signed in as {name} ({role})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {role === "SELLER" && (
              <Link to="/" className={linkClasses("/")}>
                New Order
              </Link>
            )}

            <Link to="/orders" className={linkClasses("/orders")}>
              Orders
            </Link>

            <Link
              to="/account/password"
              className={linkClasses("/account/password")}
            >
              Password
            </Link>

            {role === "ADMIN" && (
              <>
                <Link to="/admin/users" className={linkClasses("/admin/users")}>
                  Users
                </Link>
                <Link
                  to="/admin/leaderboard"
                  className={linkClasses("/admin/leaderboard")}
                >
                  Leaderboard
                </Link>
              </>
            )}

            <button
              onClick={logout}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            role === "SELLER" ? (
              <NewOrderPage />
            ) : (
              <Navigate to="/orders" replace />
            )
          }
        />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/account/password" element={<ChangePasswordPage />} />
        <Route
          path="/admin/users"
          element={
            role === "ADMIN" ? (
              <AdminUsersPage />
            ) : (
              <Navigate to="/orders" replace />
            )
          }
        />
        <Route
          path="/admin/leaderboard"
          element={
            role === "ADMIN" ? (
              <AdminLeaderboardPage />
            ) : (
              <Navigate to="/orders" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
