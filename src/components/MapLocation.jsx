import React from 'react';

const MapLocation = () => {
  // Dirección del baby shower
  const address = "Ubicación del Baby Shower";
  
  // Función para abrir Google Maps con las coordenadas exactas
  const openInGoogleMaps = () => {
    // Usar las coordenadas exactas en lugar de la dirección genérica
    const latitude = -36.7602;
    const longitude = -72.3999;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  // Función para copiar la dirección al portapapeles
  const copyAddress = () => {
    navigator.clipboard.writeText(address).then(() => {
      alert('¡Dirección copiada al portapapeles!');
    }).catch(() => {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('¡Dirección copiada al portapapeles!');
    });
  };

  return (
    <div className="w-full mb-8">
      {/* Título de la sección */}
      <h3 className="text-2xl md:text-3xl font-bold text-purple-600 mb-6 text-center">
        Ubicación del Evento
      </h3>
      
      {/* Contenedor general */}
      <div className="relative shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-3xl overflow-hidden">
        {/* Div del mapa con esquinas redondeadas superiores */}
        <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] rounded-t-3xl overflow-hidden bg-white">
          <div className="w-full h-full rounded-t-3xl overflow-hidden" style={{ borderRadius: '24px 24px 0 0' }}>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-72.5,-36.9,-72.3,-36.6&layer=mapnik&marker=-36.7602,-72.3999"
              width="100%"
              height="100%"
              style={{ 
                border: 0,
                borderRadius: '24px 24px 0 0'
              }}
              allowFullScreen=""
              loading="lazy"
              title="Ubicación del Baby Shower"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
        
        {/* Div del botón con esquinas redondeadas inferiores */}
        <div className="p-6 bg-white rounded-b-3xl" style={{ borderRadius: '0 0 24px 24px' }}>
          <button
            onClick={openInGoogleMaps}
            className="w-full px-6 py-3 font-semibold text-lg rounded-2xl bg-purple-500 text-white shadow-md hover:bg-purple-600 transition-colors duration-300 border border-purple-500"
          >
            Ver en Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapLocation;
