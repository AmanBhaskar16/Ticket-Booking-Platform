import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar     from "../../../components/common/Navbar/Navbar.tsx";
import { SearchBar, PageSpinner } from "../../../components/common/SharedUI/SharedUI.tsx";
import { showToast } from "../../../components/common/Toast/toast.ts";
import Modal         from "../../../components/common/Modal/Modal.tsx";
import TheatreCard   from "../../../components/theatre/TheatreCard/TheatreCard.tsx";
import { theatresApi } from "../../../api/index.api.ts";
import { useAuth }   from "../../../context/AuthContext.tsx";
import type { Theatre } from "../../../types/movie.types.ts";
import "./TheatresPage.css";

export default function TheatresPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.userRole === "ADMIN" || user?.userRole === "CLIENT";

  const load = () => {
    setLoading(true);
    theatresApi.getAll()
      .then(setTheatres)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await theatresApi.delete(deleteId);
      showToast("Theatre removed.");
      load();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Something went wrong", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = theatres.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.city.toLowerCase().includes(search.toLowerCase()) ||
    t.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <div className="grain" />
      <AppNavbar />

      <div className="container">
        <div className="tp-header">
          <div>
            <p className="tp-eyebrow">Cinemas Near You</p>
            <h1 className="tp-title">ALL THEATRES</h1>
          </div>
          {isAdmin && (
            <button className="btn btn-primary"
              onClick={() => navigate("/dashboard?tab=theatres")}>
              + Add Theatre
            </button>
          )}
        </div>

        <div className="tp-search">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, city…"
          />
        </div>

        {loading ? (
          <PageSpinner />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏛</div>
            <p className="empty-state-title">No Theatres Found</p>
            <p className="empty-state-sub">Try a different search</p>
          </div>
        ) : (
          <div className="tp-grid">
            {filtered.map(t => (
              <TheatreCard
                key={t._id}
                theatre={t}
                isAdmin={isAdmin}
                onClick={() => navigate(`/theatres/${t._id}`)}
                onEdit={() => navigate(`/dashboard?tab=theatres&edit=${t._id}`)}
                onDelete={() => setDeleteId(t._id)}
              />
            ))}
          </div>
        )}
      </div>

      {deleteId && (
        <Modal
          title="DELETE THEATRE"
          onClose={() => setDeleteId(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </>
          }
        >
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            This action is permanent. All shows in this theatre will also be removed.
          </p>
        </Modal>
      )}
    </div>
  );
}