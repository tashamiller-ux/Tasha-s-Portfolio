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
    <section className="gallery wrap" id="gallery" aria-label="Photo gallery">
      <div className="masonry">
        {photos.map((photo) => (
          <button className="photo" key={photo.file} type="button"
            aria-label={`View photo: ${photo.alt}`} onClick={(event) => openPhoto(photo, event)}>
            <img src={photoUrl(photo.file, photo.thumbnail)} alt=""
              width={photo.width} height={photo.height} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <dialog ref={dialog} aria-label="Photo viewer" onKeyDown={handleKeys}
        onClose={() => { setSelected(null); trigger.current?.focus(); }}>
        <div className="viewer-bar">
          <button type="button" aria-label="Close viewer" autoFocus
            onClick={() => dialog.current.close()}><span aria-hidden="true">×</span></button>
        </div>
        {selected && (
          <img src={photoUrl(selected.file)} alt={selected.alt} />
        )}
        {photos.length > 1 && (
          <div className="viewer-controls">
            <button type="button" aria-label="Previous photo" onClick={() => movePhoto(-1)}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" aria-label="Next photo" onClick={() => movePhoto(1)}>
              <span aria-hidden="true">→</span>
            </button>
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
