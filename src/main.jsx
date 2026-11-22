import { useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { photos, photoUrl, portfolio } from './portfolio.js';
import heroRidge from './assets/hero-ridge.webp';
import './style.css';

// Place each photo in the shortest column so the gallery gets darker as you scroll.
function arrangePhotos(width, columnCount, gap) {
  const bottoms = Array(columnCount).fill(0);
  const tileWidth = (width - gap * (columnCount - 1)) / columnCount;
  const tiles = photos.map((photo) => {
    const top = Math.min(...bottoms);
    const column = bottoms.indexOf(top);
    bottoms[column] += tileWidth * photo.height / photo.width + gap;
    return { top, left: column * (tileWidth + gap), width: tileWidth };
  });
  return { tiles, height: Math.max(0, Math.max(...bottoms) - gap) };
}

function Gallery() {
  const masonry = useRef(null);
  const [layout, setLayout] = useState(null);

  useLayoutEffect(() => {
    const gallery = masonry.current;

    let lastWidth;
    let lastColumnCount;

    function updateLayout() {
      const styles = getComputedStyle(gallery);
      const width = gallery.getBoundingClientRect().width;
      const columnCount = Number(styles.getPropertyValue('--gallery-columns'));
      if (width === lastWidth && columnCount === lastColumnCount) return;
      lastWidth = width;
      lastColumnCount = columnCount;
      setLayout(arrangePhotos(width, columnCount, parseFloat(styles.columnGap)));
    }

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(gallery.parentElement, { box: 'border-box' });
    return () => observer.disconnect();
  }, []);

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
      <div className="masonry" ref={masonry} style={{ height: layout?.height }}>
        {photos.map((photo, index) => (
          <button className="photo" key={photo.file} type="button" style={layout?.tiles[index]}
            aria-label={`View photo: ${photo.alt}`} onClick={(event) => openPhoto(photo, event)}>
            <img src={photoUrl(photo.file, photo.thumbnail)} alt=""
              width={photo.width} height={photo.height} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      <dialog className="viewer" ref={dialog} aria-label="Photo viewer" onKeyDown={handleKeys}
        onClose={() => { setSelected(null); trigger.current?.focus(); }}>
        {selected && (
          <img className="viewer-background" src={photoUrl(selected.file, selected.thumbnail)}
            alt="" aria-hidden="true" />
        )}
        <div className="viewer-bar">
          <button className="viewer-close" type="button" aria-label="Close viewer" autoFocus
            onClick={() => dialog.current.close()} />
        </div>
        <div className="viewer-stage">
          {selected && <img src={photoUrl(selected.file)} alt={selected.alt} />}
        </div>
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
  return (
    <>
      <header className="site-header wrap">
        <a className="brand" href="#top">{portfolio.name}</a>
        <nav aria-label="Main navigation">
          <a href="#gallery">Gallery</a>
          {portfolio.email && <a href={`mailto:${portfolio.email}`}>Contact</a>}
        </nav>
      </header>
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero-image" src={heroRidge}
            alt="Clouds above a glacier framed by snow-covered mountains" fetchPriority="high" />
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
