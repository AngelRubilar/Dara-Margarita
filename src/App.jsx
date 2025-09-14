import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-config.js';

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

    if (!db) {
      setSubmissionMessage('Error: Base de datos no disponible.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Ruta simplificada - todos los RSVPs en una sola colección
      const rsvpsPath = `rsvps`;
      await addDoc(collection(db, rsvpsPath), {
        name: name.trim(),
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
        
        <img
          src="https://placehold.co/600x400/ffe4e1/6b46c1?text=Baby+Shower"
          alt="Imagen de bienvenida al Baby Shower"
          className="rounded-3xl shadow-lg w-full mb-8"
        />

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
                  onChange={(e) => setName(e.target.value)}
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
