import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar     from "../../../components/common/Navbar/Navbar.tsx";
import { PageSpinner, showToast } from "../../../components/common/SharedUI/SharedUI.tsx";
import BookingCard   from "../../../components/booking/BookingCard/BookingCard.tsx";
import Modal         from "../../../components/common/Modal/Modal.tsx";
import { bookingsApi } from "../../../api/index.api.ts";
import "./MyBookingsPage.css";

type Filter = "ALL" | "SUCCESSFUL" | "IN_PROCESS" | "CANCELLED";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All",        value: "ALL"        },
  { label: "Confirmed",  value: "SUCCESSFUL" },
  { label: "Processing", value: "IN_PROCESS" },
  { label: "Cancelled",  value: "CANCELLED"  },
];

export default function MyBookingsPage() {
  const navigate = useNavigate();

  const [bookings,   setBookings]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<Filter>("ALL");
  const [cancelId,   setCancelId]   = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    bookingsApi.getMyBookings()
      .then(setBookings)
      .catch((e: any) => showToast(e.message ?? "Failed to load bookings", "error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async () => {
    if (!cancelId) return;
    setCancelling(true);
    try {
      await bookingsApi.cancel(cancelId, "Cancelled by user");
      showToast("Booking cancelled successfully");
      fetchBookings();
    } catch (e: any) {
      showToast(e.message ?? "Failed to cancel booking", "error");
    } finally {
      setCancelling(false);
      setCancelId(null);
    }
  };

  const filtered = filter === "ALL"
    ? bookings
    : bookings.filter(b => b.status === filter);

  // Stats
  const confirmed  = bookings.filter(b => b.status === "SUCCESSFUL").length;
  const totalSpent = bookings
    .filter(b => b.status === "SUCCESSFUL")
    .reduce((sum, b) => sum + (b.totalAmount ?? 0), 0);

  return (
    <div className="page-wrapper">
      <div className="grain" />
      <AppNavbar />

      <div className="mbp-container container">

        {/* Header */}
        <div className="mbp-header">
          <div>
            <p className="mbp-eyebrow">Your History</p>
            <h1 className="mbp-title">MY BOOKINGS</h1>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/movies")}>
            + Book New
          </button>
        </div>

        {/* Stats */}
        {!loading && bookings.length > 0 && (
          <div className="mbp-stats">
            <div className="mbp-stat">
              <p className="mbp-stat-val">{bookings.length}</p>
              <p className="mbp-stat-label">Total Bookings</p>
            </div>
            <div className="mbp-stat">
              <p className="mbp-stat-val">{confirmed}</p>
              <p className="mbp-stat-label">Confirmed</p>
            </div>
            <div className="mbp-stat">
              <p className="mbp-stat-val">₹{totalSpent.toLocaleString()}</p>
              <p className="mbp-stat-label">Total Spent</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mbp-filters">
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`mbp-filter-chip ${filter === f.value ? "active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              {f.value !== "ALL" && (
                <span className="mbp-filter-count">
                  {bookings.filter(b => b.status === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <PageSpinner />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎟</div>
            <p className="empty-state-title">
              {filter === "ALL" ? "No Bookings Yet" : `No ${filter.toLowerCase()} bookings`}
            </p>
            <p className="empty-state-sub">
              {filter === "ALL" ? "Book your first movie experience!" : "Try a different filter"}
            </p>
            {filter === "ALL" && (
              <button className="btn btn-primary" style={{ marginTop: 20 }}
                onClick={() => navigate("/movies")}>
                Browse Movies
              </button>
            )}
          </div>
        ) : (
          <div className="mbp-list">
            {filtered.map(b => (
              <BookingCard
                key={b._id}
                booking={b}
                onView={id => navigate(`/ticket/${id}`, { state: { booking: b } })}
                onCancel={id => setCancelId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {cancelId && (
        <Modal
          title="CANCEL BOOKING"
          onClose={() => setCancelId(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setCancelId(null)}>
                Keep Booking
              </button>
              <button
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling…" : "Yes, Cancel"}
              </button>
            </>
          }
        >
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Are you sure you want to cancel this booking?
            <br />
            <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Refunds may take 5-7 business days to reflect.
            </span>
          </p>
        </Modal>
      )}
    </div>
  );
}