import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { photos, photoUrl, portfolio } from './portfolio.js';
import './style.css';

function Gallery() {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);

  function openPhoto(photo, event) {
    trigger.current = event.currentTarget;
    setSelected(photo);
    dialog.current.showModal();
  }

  function movePhoto(offset) {
    setSelected((current) => {
      const index = photos.indexOf(current);
      return photos[(index + offset + photos.length) % photos.length];
    });
  }

  function handleKeys(event) {
    if (photos.length < 2) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      movePhoto(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  return (
    <section className="gallery wrap" id="gallery" aria-labelledby="gallery-title">
      <h2 id="gallery-title">Gallery</h2>
      {photos.length === 0 ? (
        <p className="empty">No photographs added yet.</p>
      ) : (
        <div className="masonry">
          {photos.map((photo) => (
            <button className="photo" key={photo.file} type="button"
              aria-label={`View ${photo.title}`} onClick={(event) => openPhoto(photo, event)}>
              <img src={photoUrl(photo.file, photo.thumbnail)} alt={photo.alt}
                width={photo.width} height={photo.height} loading="lazy" decoding="async" />
              <span className="caption">
                <strong>{photo.title}</strong>
                {photo.location && <span>{photo.location}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
      <dialog ref={dialog} aria-label="Photo viewer" onKeyDown={handleKeys}
        onClose={() => { setSelected(null); trigger.current?.focus(); }}>
        <div className="viewer-bar">
          <button type="button" autoFocus onClick={() => dialog.current.close()}>Close</button>
        </div>
        {selected && (
          <figure>
            <img src={photoUrl(selected.file)} alt={selected.alt} />
            <figcaption aria-live="polite">
              <strong>{selected.title}</strong>
              {selected.location && <span>{selected.location}</span>}
            </figcaption>
          </figure>
        )}
        {photos.length > 1 && (
          <div className="viewer-controls">
            <button type="button" onClick={() => movePhoto(-1)}>Previous</button>
            <button type="button" onClick={() => movePhoto(1)}>Next</button>
          </div>
        )}
      </dialog>
    </section>
  );
}

function App() {
  const featured = photos.find((photo) => photo.file === portfolio.banner) ?? photos[0];
  return (
    <>
      <header className="site-header wrap">
        <div className="brand-block">
          <a className="brand" href="#top">{portfolio.name}</a>
          <p className="brand-subtitle">{portfolio.subtitle}</p>
        </div>
        <nav aria-label="Main navigation">
          <a href="#gallery">Gallery</a>
          {portfolio.email && <a href={`mailto:${portfolio.email}`}>Contact</a>}
        </nav>
      </header>
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          {featured && <img className="hero-image" src={photoUrl(featured.file)}
            alt={featured.alt} fetchPriority="high" />}
          <div className="hero-copy wrap">
            <h1 id="hero-title">{portfolio.heading}</h1>
            <a className="hero-link" href="#gallery">Explore the gallery <span aria-hidden="true">↓</span></a>
          </div>
        </section>
        <Gallery />
      </main>
      <footer className="site-footer wrap">
        <span>{portfolio.photographer || portfolio.name}</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
