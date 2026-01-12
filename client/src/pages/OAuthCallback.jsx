import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../redux/slices/authSlice.js";
import { useNavigate, useLocation } from "react-router-dom";
import PageMeta from "../components/PageMeta.jsx";

export default function OAuthCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const next = params.get("next") || "/";
    if (token) {
      localStorage.setItem("pp_token", token);
      dispatch(fetchProfile()).finally(() => {
        navigate(next, { replace: true });
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, [location.search]);

  return (
    <>
      <PageMeta
        title="Signing In - PricePulseAI"
        description="Signing you in to PricePulseAI. Please wait while we authenticate your account."
      />
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid var(--accent)",
              borderTop: "3px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p style={{ color: "var(--muted)" }}>Signing you in...</p>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </>
  );
}
