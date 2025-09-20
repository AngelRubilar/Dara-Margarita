import React, { useState, useEffect } from 'react';

const ImageCarousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Imágenes del carrusel
  const carouselImages = [
    {
      src: "/images/10.jpeg",
      alt: "Imagen 1 del Baby Shower"
    },
    {
      src: "/images/11.jpeg", 
      alt: "Imagen 2 del Baby Shower"
    },
    {
      src: "/images/12.jpeg",
      alt: "Imagen 3 del Baby Shower"
    },
    {
      src: "/images/imagen1.jpeg",
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
    <div className="relative rounded-3xl shadow-lg w-full mb-8 overflow-hidden">
      <div className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden bg-gray-100">
        <img
          src={carouselImages[currentImageIndex].src}
          alt={carouselImages[currentImageIndex].alt}
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-in-out rounded-3xl"
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </div>
    </div>
  );
};

export default ImageCarousel;