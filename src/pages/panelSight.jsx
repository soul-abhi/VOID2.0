import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import "./panelSight.css";

const TOKEN_KEY = "void_admin_token";

// Ordered preferred domains as numbered chips (1 = top pick).
const renderDomains = (r) => {
  const domains = [r.domain, r.domain2, r.domain3].filter(Boolean);
  if (domains.length === 0) return "—";
  return domains.map((d, i) => (
    <span key={d} className="panel-sight-chip">
      <span className="panel-sight-chip-order">{i + 1}</span>
      {d}
    </span>
  ));
};

export default function PanelSight() {
  const [status, setStatus] = useState("checking"); // checking | login | ready
  const [registrations, setRegistrations] = useState([]);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setStatus("login");
      return;
    }
    (async () => {
      try {
        const verify = await fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!verify.ok) throw new Error("unauthorized");

        const list = await fetch("/api/registrations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!list.ok) throw new Error("unauthorized");

        setRegistrations(await list.json());
        setStatus("ready");
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
        setStatus("login");
      }
    })();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 429) {
        setAuthError("Too many attempts. Try again later.");
        return;
      }
      if (!res.ok) {
        setAuthError("Access denied.");
        return;
      }
      const body = await res.json();
      sessionStorage.setItem(TOKEN_KEY, body.token);

      const list = await fetch("/api/registrations", {
        headers: { Authorization: `Bearer ${body.token}` },
      });
      if (!list.ok) throw new Error("unauthorized");

      setRegistrations(await list.json());
      setPassword("");
      setStatus("ready");
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setRegistrations([]);
    setPassword("");
    setAuthError("");
    setStatus("login");
  };

  if (status === "checking") {
    return <div className="panel-sight panel-sight-loading" />;
  }

  if (status === "login") {
    return (
      <div className="panel-sight">
        <Navbar />
        <div className="panel-sight-login-wrap">
          <div className="panel-sight-login">
            <p className="panel-sight-login-kicker">// RESTRICTED ACCESS</p>
            <h1 className="panel-sight-title">VOID · PANEL SIGHT</h1>
            <form onSubmit={handleLogin}>
              <input
                className="panel-sight-login-input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {authError && <p className="panel-sight-login-error">{authError}</p>}
              <button type="submit" className="panel-sight-login-submit" disabled={loggingIn}>
                {loggingIn ? "Verifying…" : "Access Panel"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-sight">
      <Navbar />
      <div className="panel-sight-header">
        <div>
          <h1 className="panel-sight-title">VOID · PANEL SIGHT</h1>
          <p className="panel-sight-sub">{registrations.length} registration(s)</p>
        </div>
        <button type="button" className="panel-sight-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="panel-sight-table-wrap">
        <table className="panel-sight-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Year</th>
              <th>Email</th>
              <th>WhatsApp</th>
              <th>Accommodation</th>
              <th>Preferred Domains</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.name}</td>
                <td>{r.branch}</td>
                <td>{r.year || "—"}</td>
                <td>{r.email}</td>
                <td>{r.whatsapp}</td>
                <td>{r.accommodation}</td>
                <td>{renderDomains(r)}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {registrations.length === 0 && (
          <p className="panel-sight-empty">No registrations yet.</p>
        )}
      </div>
    </div>
  );
}
