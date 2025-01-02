import React, { useState } from 'react';
import './Gallery.css';

// Import sample images (replace with actual images)
import beforeImage1 from '../../assets/images/before1.jpg';
import afterImage1 from '../../assets/images/after1.jpg';
import beforeImage2 from '../../assets/images/before2.jpg';
import afterImage2 from '../../assets/images/after2.jpg';
import beforeImage3 from '../../assets/images/before3.jpg';
import afterImage3 from '../../assets/images/after3.jpg';

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const galleryImages = [
        { before: beforeImage1, after: afterImage1, description: 'Sedan Exterior Detail' },
        { before: beforeImage2, after: afterImage2, description: 'SUV Interior Cleaning' },
        { before: beforeImage3, after: afterImage3, description: 'Luxury Car Restoration' }
    ];

    const openLightbox = (image) => {
        setSelectedImage(image);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    return (
        <section className="gallery">
            <div className="gallery-heading">
                <h2>Our Detailing Transformations</h2>
                <p>See the incredible difference our professional detailing makes</p>
            </div>
            <div className="gallery-grid">
                {galleryImages.map((imageSet, index) => (
                    <div key={index} className="gallery-item" onClick={() => openLightbox(imageSet)}>
                        <div className="gallery-image-container">
                            <img src={imageSet.before} alt={`Before ${imageSet.description}`} className="before-image" />
                            <img src={imageSet.after} alt={`After ${imageSet.description}`} className="after-image" />
                        </div>
                        <p>{imageSet.description}</p>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    <div className="lightbox-content">
                        <img src={selectedImage.before} alt={`Before ${selectedImage.description}`} />
                        <img src={selectedImage.after} alt={`After ${selectedImage.description}`} />
                        <p>{selectedImage.description}</p>
                        <button onClick={closeLightbox}>Close</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Gallery;
