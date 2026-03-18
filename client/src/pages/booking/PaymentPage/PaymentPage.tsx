import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AppNavbar     from "../../../components/common/Navbar/Navbar.tsx";
import { showToast } from "../../../components/common/SharedUI/SharedUI.tsx";
import PaymentForm   from "../../../components/booking/PaymentForm/PaymentForm.tsx";
import BookingSummary from "../../../components/booking/BookingSummary/BookingSummary.tsx";
import { bookingsApi } from "../../../api/index.api.ts";
import "./PaymentPage.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking  = location.state?.booking;

  // Guard — if no booking state, redirect back
  if (!booking) {
    navigate("/movies");
    return null;
  }

  const handleSuccess = async (paymentIntentId: string) => {
    try {
      const confirmed = await bookingsApi.confirm(booking.bookingId, paymentIntentId);
      showToast("🎉 Booking confirmed!");
      navigate(`/ticket/${confirmed._id}`, { state: { booking: confirmed } });
    } catch (e: any) {
      showToast(e.message ?? "Failed to confirm booking", "error");
    }
  };

  const handleError = (message: string) => {
    showToast(message, "error");
  };

  const stripeOptions = {
    clientSecret: booking.clientSecret,
    appearance: {
      theme: "night" as const,
      variables: {
        colorPrimary:    "#f97316",
        colorBackground: "#1c1c1e",
        colorText:       "#ffffff",
        borderRadius:    "8px",
      },
    },
  };

  const showInfo = {
    movieName: booking.show.name,
    poster:    booking.show.poster,
    theatre:   booking.show.theatre,
    showTime:  booking.show.showTime,
    format:    booking.show.format,
    language:  booking.show.language,
    screen:    booking.show.screen,
    price:     booking.show.price,
  };

  return (
    <div className="page-wrapper">
      <div className="grain" />
      <AppNavbar />

      <div className="pp-container container">
        <div className="pp-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <h1 className="pp-title">COMPLETE PAYMENT</h1>
            <p className="pp-sub">Secure payment powered by Stripe</p>
          </div>
        </div>

        <div className="pp-layout">
          {/* Payment form */}
          <div className="pp-form-wrap">
            <Elements stripe={stripePromise} options={stripeOptions}>
              <PaymentForm
                totalAmount={booking.totalAmount}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </Elements>
          </div>

          {/* Summary */}
          <div className="pp-summary-wrap">
            <BookingSummary
              show={showInfo}
              selectedSeats={booking.seats}
              onConfirm={() => {}}
              confirming={false}
              disabled={true}
              ctaLabel="Pay"
            />
          </div>
        </div>
      </div>
    </div>
  );
}