import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp, where, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebase-config.js';
import ImageCarousel from './components/ImageCarousel.jsx';
import MapLocation from './components/MapLocation.jsx';

// Componente principal de la aplicación
const App = () => {
  // Estado para la configuración de Firebase y el usuario
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState('');

  // Estado del formulario RSVP
  const [name, setName] = useState('');
  const [isAttending, setIsAttending] = useState(true);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para mostrar mensaje de confirmación
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  
  // Estado para mostrar modal de validación de nombre
  const [showNameValidationModal, setShowNameValidationModal] = useState(false);
  
  // Estado para mostrar modal de nombre duplicado
  const [showDuplicateNameModal, setShowDuplicateNameModal] = useState(false);
  
  // Variables globales de Firebase
  const appId = 'baby-shower-app';

  // 1. Inicialización de Firebase y Autenticación
  useEffect(() => {
    try {
      if (firebaseConfig && firebaseConfig.apiKey && !db) {
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const authService = getAuth(app);
        setDb(firestoreDb);
        setAuth(authService);

        // Autenticación de usuario
        onAuthStateChanged(authService, async (user) => {
          if (user) {
            setUserId(user.uid);
          } else {
            // Iniciar sesión de forma anónima
            try {
              await signInAnonymously(authService);
            } catch (error) {
              console.error("Error al autenticar:", error);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error al inicializar Firebase:", error);
    }
  }, [db]);

  // Ya no necesitamos escuchar cambios en tiempo real para mostrar la lista

  // Manejar el envío del formulario
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name.trim()) {
      setSubmissionMessage('Por favor, ingresa tu nombre.');
      setIsSubmitting(false);
      return;
    }

    // Validar que el nombre solo contenga letras y espacios
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    if (!nameRegex.test(name.trim())) {
      setShowNameValidationModal(true);
      setIsSubmitting(false);
      return;
    }

    // Validar que el nombre tenga al menos un espacio (nombre y apellido)
    const normalizedName = name.trim().replace(/\s+/g, ' ');
    if (!normalizedName.includes(' ')) {
      setShowNameValidationModal(true);
      setIsSubmitting(false);
      return;
    }

    if (!db) {
      setSubmissionMessage('Error: Base de datos no disponible.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Normalizar el nombre: convertir a minúsculas y normalizar espacios
      const normalizedName = name.trim().replace(/\s+/g, ' ').toLowerCase();
      
      // Verificar si el nombre ya existe en la base de datos
      const rsvpsPath = `rsvps`;
      const q = query(collection(db, rsvpsPath), where('nameNormalized', '==', normalizedName));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setShowDuplicateNameModal(true);
        setIsSubmitting(false);
        return;
      }

      // Si no existe, guardar el RSVP con ambos campos
      await addDoc(collection(db, rsvpsPath), {
        name: name.trim().replace(/\s+/g, ' '), // Nombre con espacios normalizados para mostrar
        nameNormalized: normalizedName, // Nombre normalizado para validación
        isAttending,
        timestamp: serverTimestamp(),
      });
      
      // Mostrar mensaje personalizado según la confirmación
      setShowConfirmationMessage(true);
      setName('');
    } catch (error) {
      console.error("Error al guardar la confirmación:", error);
      setSubmissionMessage('Ocurrió un error al enviar el formulario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen flex flex-col items-center justify-center p-4 text-gray-800 font-sans">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center transform transition-all hover:scale-105 duration-300">
        
        {/* Sección de la invitación */}
        <h1 className="text-4xl md:text-6xl font-pacifico text-pink-500 mb-4">
          ¡Un pequeño milagro está en camino!
        </h1>
        <p className="text-xl md:text-2xl font-light mb-6">
          Te invitamos a celebrar la llegada de mi bebé
        </p>
        
        {/* Carrusel de imágenes */}
        <ImageCarousel />

        <div className="space-y-4 text-left mb-10">
          <p className="text-lg md:text-xl font-semibold text-purple-600 flex items-center justify-center">
            <span className="mr-2">📅</span>
            Fecha: Sábado, 01 de Noviembre, 2025
          </p>
          <p className="text-lg md:text-xl font-semibold text-purple-600 flex items-center justify-center">
            <span className="mr-2">⏰</span>
            Hora: 3:00 PM
          </p>
          <p className="text-lg md:text-xl font-semibold text-purple-600 flex items-center justify-center">
            <span className="mr-2">📍</span>
            Lugar: Las Vegas de Libuy el manantial Parcela 12 
          </p>
          <p className="text-md md:text-lg font-light text-gray-600 text-center">
            ¡Ven a compartir con nosotros este día tan especial!
          </p>
        </div>

        {/* Componente de mapa interactivo */}
        <MapLocation />

        {/* Sección del formulario RSVP - Solo se muestra si no hay mensaje de confirmación */}
        {!showConfirmationMessage && (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-pink-500 mb-6 border-t-2 border-pink-200 pt-6">
              Confirma tu asistencia
            </h2>
            <form onSubmit={handleRsvpSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Nombre Completo</label>
                     <input
                       type="text"
                       id="name"
                       placeholder="Nombre completo"
                       value={name}
                       onChange={(e) => {
                         setName(e.target.value);
                         // Limpiar mensaje de error cuando el usuario empiece a escribir
                         if (submissionMessage) {
                           setSubmissionMessage('');
                         }
                       }}
                       className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-colors"
                     />
              </div>
              <div className="flex justify-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    value="true"
                    checked={isAttending === true}
                    onChange={() => setIsAttending(true)}
                    className="form-radio h-5 w-5 text-purple-600"
                  />
                  <span className="ml-2 text-lg">Asistiré</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="attendance"
                    value="false"
                    checked={isAttending === false}
                    onChange={() => setIsAttending(false)}
                    className="form-radio h-5 w-5 text-purple-600"
                  />
                  <span className="ml-2 text-lg">No asistiré</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 font-semibold text-lg rounded-xl bg-purple-500 text-white shadow-md hover:bg-purple-600 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar confirmación'}
              </button>
            </form>

            {submissionMessage && (
              <p className="mt-4 text-red-600 font-medium animate-pulse">
                {submissionMessage}
              </p>
            )}
          </>
        )}
      </div>

      {/* Modal de validación de nombre */}
      {showNameValidationModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4" 
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full mx-4 transform transition-all duration-300 scale-100"
            style={{
              position: 'relative',
              zIndex: 10000,
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-red-600 mb-6">
              ⚠️ Nombre no válido
            </h3>
            
            <div className="text-center space-y-4 mb-6">
              <p className="text-lg text-gray-700 font-semibold">
                Debe incluir nombre y apellido
              </p>
              
              <div className="bg-gray-100 rounded-xl p-4">
                <p className="text-lg font-semibold text-purple-600 mb-2">
                  Ejemplo correcto:
                </p>
                <p className="text-xl text-gray-800 font-bold">
                  Dara Rubilar
                </p>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Solo letras y espacios</p>
                <p>• Debe tener nombre y apellido</p>
                <p>• No se permiten números ni signos especiales</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowNameValidationModal(false)}
              className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors duration-300 font-semibold"
            >
              Entendido, corregiré mi nombre
            </button>
          </div>
        </div>
      )}

      {/* Modal de nombre duplicado */}
      {showDuplicateNameModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4" 
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full mx-4 transform transition-all duration-300 scale-100"
            style={{
              position: 'relative',
              zIndex: 10000,
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-6">
              ✅ Ya confirmaste tu asistencia
            </h3>
            
            <div className="text-center space-y-4 mb-6">
              <p className="text-lg text-gray-700 font-semibold">
                Este nombre ya está registrado en nuestro sistema
              </p>
              
              <div className="bg-green-100 rounded-xl p-4">
                <p className="text-lg font-semibold text-green-600 mb-2">
                  ¡Perfecto! Ya tienes tu lugar reservado
                </p>
                <div className="text-gray-700 space-y-2">
                  <p>• Tu confirmación está guardada</p>
                  <p>• Te esperamos en el evento</p>
                  <p>• No necesitas confirmar de nuevo</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Si necesitas hacer algún cambio, contacta a los organizadores
              </p>
            </div>
            
            <button
              onClick={() => setShowDuplicateNameModal(false)}
              className="mt-6 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-300 font-semibold"
            >
              Entendido, gracias
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmationMessage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4" 
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-lg w-full mx-4 transform transition-all duration-300 scale-100"
            style={{
              position: 'relative',
              zIndex: 10000,
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            {isAttending ? (
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
                  ¡Perfecto! 🎉
                </h3>
                <p className="text-lg md:text-xl text-gray-700 mb-4">
                  Tu confirmación se ha realizado exitosamente.
                </p>
                <p className="text-lg md:text-xl font-semibold text-purple-600">
                  Te estaremos esperando con mucha ilusión! 💕
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
                  ¡Qué pena! 😢
                </h3>
                <p className="text-lg md:text-xl text-gray-700 mb-4">
                  No vas porque eres cagado y no quieres dar regalos! 😂
                </p>
                <p className="text-lg md:text-xl font-semibold text-purple-600">
                  Te vamos a extrañar! 💔
                </p>
              </div>
            )}
            <button
              onClick={() => setShowConfirmationMessage(false)}
              className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors duration-300"
            >
              Confirmar otro invitado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
