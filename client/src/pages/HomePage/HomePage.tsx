// // import { AnimatePresence } from "framer-motion";
// import Navbar            from "../../components/common/Navbar/Navbar.tsx";
// import { TickerBar } from "../../components/common/index.tsx";
// import HeroSection       from "../../components/home/HeroSection/HeroSection.tsx";
// import StatsStrip        from "../../components/home/StatsStrip/StatsStrip.tsx";
// import ShowtimePicker    from "../../components/home/ShowTimePicker/ShowTimePicker.tsx";
// import NowShowing        from "../../components/home/NowShowing/NowShowing.tsx";
// import ComingSoon        from "../../components/home/ComingSoon/ComingSoon.tsx";
// import CinemasNearby     from "../../components/home/CinemaNearby/CinemaNearby.tsx";
// import AudienceReviews   from "../../components/home/AudienceReview/AudienceReview.tsx";
// import PrimePass         from "../../components/home/PrimePass/PrimePass.tsx";
// import AppDownload       from "../../components/home/AppDownload/AppDownload.tsx";
// import Footer            from "../../components/home/Footer/Footer.tsx";

// import {
//   MOCK_MOVIES, UPCOMING_MOVIES, CINEMAS, REVIEWS, TICKER_ITEMS,
// } from "../../constants/movies.data.ts";

// export default function HomePage() {
//   // HeroSection manages its own active index internally,
//   // but ShowtimePicker needs to know the active movie.
//   // We lift just enough state to pass down.
//   // For a real app this would come from a context/store.
//   const firstMovie = MOCK_MOVIES[0];

//   return (
//     <div className="page">
//       <div className="grain" />
//       <div className="scanlines" />

//       <TickerBar items={TICKER_ITEMS} />
//       <Navbar />

//       <HeroSection movies={MOCK_MOVIES} />
//       <StatsStrip />
//       <ShowtimePicker activeMovie={firstMovie} />
//       <NowShowing movies={MOCK_MOVIES} />
//       <ComingSoon movies={UPCOMING_MOVIES} />
//       <CinemasNearby cinemas={CINEMAS} />
//       <AudienceReviews reviews={REVIEWS} />
//       <PrimePass />
//       <AppDownload />
//       <Footer />
//     </div>
//   );
// }

import { useState, useEffect }     from "react";
// import { AnimatePresence }          from "framer-motion";
import Navbar                       from "../../components/common/Navbar/Navbar.tsx";
import { TickerBar }         from "../../components/common/index.tsx";
import HeroSection                  from "../../components/home/HeroSection/HeroSection.tsx";
import StatsStrip                   from "../../components/home/StatsStrip/StatsStrip.tsx";
import ShowtimePicker               from "../../components/home/ShowTimePicker/ShowTimePicker.tsx";
import NowShowing                   from "../../components/home/NowShowing/NowShowing.tsx";
import ComingSoon                   from "../../components/home/ComingSoon/ComingSoon.tsx";
import CinemasNearby                from "../../components/home/CinemaNearby/CinemaNearby.tsx";
import AudienceReviews              from "../../components/home/AudienceReview/AudienceReview.tsx";
import PrimePass                    from "../../components/home/PrimePass/PrimePass.tsx";
import AppDownload                  from "../../components/home/AppDownload/AppDownload.tsx";
import Footer                       from "../../components/home/Footer/Footer.tsx";
import { moviesApi, theatresApi, reviewsApi } from "../../api/index.api.ts";
import { TICKER_ITEMS }             from "../../constants/movies.data.ts";
import type { Movie, Theatre, Review } from "../../types/movie.types.ts";

export default function HomePage() {
  const [releasedMovies, setReleasedMovies] = useState<Movie[]>([]);
  const [comingSoon,     setComingSoon]     = useState<Movie[]>([]);
  const [theatres,       setTheatres]       = useState<Theatre[]>([]);
  const [topReviews,     setTopReviews]     = useState<Review[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([
      moviesApi.getAll({ releaseStatus: "RELEASED",    isActive: "true", limit: "8" }),
      moviesApi.getAll({ releaseStatus: "COMING_SOON", isActive: "true", limit: "8" }),
      theatresApi.getAll({ isActive: "true", limit: "6" }),
    ]).then(([released, soon, th]) => {
      if (cancelled) return;
      if (released.status === "fulfilled") setReleasedMovies(released.value);
      if (soon.status     === "fulfilled") setComingSoon(soon.value);
      if (th.status       === "fulfilled") setTheatres(th.value);
    }).finally(() => { if (!cancelled) setLoading(false); });

    reviewsApi.getTop(6)
      .then(data => { if (!cancelled) setTopReviews(data); })
      .catch(() => { /* silent — reviews section simply won't show */ })
      .finally(() => { if (!cancelled) setReviewsLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const firstMovie = releasedMovies[0] ?? null;

  return (
    <div className="page">
      <div className="grain" />
      <div className="scanlines" />

      <TickerBar items={TICKER_ITEMS} />
      <Navbar />

      <HeroSection    movies={releasedMovies} loading={loading} />
      <StatsStrip />
      <ShowtimePicker activeMovie={firstMovie} />
      <NowShowing     movies={releasedMovies} loading={loading} />
      <ComingSoon     movies={comingSoon}      loading={loading} />
      <CinemasNearby  cinemas={theatres}       loading={loading} />
      <AudienceReviews reviews={topReviews}   loading={reviewsLoading} />
      <PrimePass />
      <AppDownload />
      <Footer />
    </div>
  );
}