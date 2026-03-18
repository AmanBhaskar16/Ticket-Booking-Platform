import { useState } from "react";
import "./TheatreGallery.css";

interface TheatreGalleryProps {
  images:      string[];
  theatreName: string;
}

export default function TheatreGallery({ images, theatreName }: TheatreGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) return null;

  return (
    <section className="tg-section">
      <div className="container">
        <p className="tg-label">Gallery</p>

        <div className="tg-main">
          <img
            src={images[active]}
            alt={`${theatreName} ${active + 1}`}
            className="tg-main-img"
            onError={e => ((e.target as HTMLImageElement).style.display = "none")}
          />
        </div>

        {images.length > 1 && (
          <div className="tg-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={`tg-thumb ${active === i ? "active" : ""}`}
                onClick={() => setActive(i)}
              >
                <img
                  src={img}
                  alt={`thumb ${i + 1}`}
                  onError={e => ((e.target as HTMLImageElement).style.display = "none")}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}