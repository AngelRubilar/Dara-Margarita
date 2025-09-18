import React, { useState, useEffect } from 'react';

const ImageCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Imágenes del carrusel
  const carouselImages = [
    {
      src: "https://placehold.co/600x400/ffe4e1/6b46c1?text=Baby+Shower+1",
      alt: "Imagen 1 del Baby Shower"
    },
    {
      src: "https://placehold.co/600x400/f0e6ff/8b5cf6?text=Baby+Shower+2", 
      alt: "Imagen 2 del Baby Shower"
    },
    {
      src: "https://placehold.co/600x400/fef3c7/f59e0b?text=Baby+Shower+3",
      alt: "Imagen 3 del Baby Shower"
    },
    {
      src: "https://placehold.co/600x400/ecfdf5/10b981?text=Baby+Shower+4",
      alt: "Imagen 4 del Baby Shower"
    }
  ];


  // Auto-play del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="relative rounded-2xl shadow-lg w-full mb-8 overflow-hidden">
      <img
        src={carouselImages[currentImageIndex].src}
        alt={carouselImages[currentImageIndex].alt}
        className="w-full h-auto transition-opacity duration-500 rounded-2xl"
      />
    </div>
  );
};

export default ImageCarousel;
