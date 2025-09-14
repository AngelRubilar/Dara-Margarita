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

  // Estado para la lista de invitados confirmados
  const [confirmedGuests, setConfirmedGuests] = useState([]);

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

  // 2. Escuchar cambios en la base de datos en tiempo real
  useEffect(() => {
    if (!db) return;

    // Ruta simplificada para los RSVP - todos en una sola colección
    const rsvpsPath = `rsvps`;
    const q = query(collection(db, rsvpsPath));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const guests = [];
      querySnapshot.forEach((doc) => {
        guests.push({ id: doc.id, ...doc.data() });
      });
      setConfirmedGuests(guests);
    }, (error) => {
      console.error("Error al escuchar los datos:", error);
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, [db]);

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
      setSubmissionMessage('¡Gracias por confirmar tu asistencia!');
      setName('');
      setTimeout(() => setSubmissionMessage(''), 5000); // Limpiar mensaje después de 5 segundos
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

        {/* Sección del formulario RSVP */}
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
          <p className="mt-4 text-green-600 font-medium animate-pulse">
            {submissionMessage}
          </p>
        )}
      </div>

      {/* Sección de lista de invitados */}
      {confirmedGuests.length > 0 && (
        <div className="mt-8 w-full max-w-xl bg-white rounded-3xl shadow-xl p-6 transform transition-all hover:scale-105 duration-300">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Invitados confirmados ({confirmedGuests.length})
          </h3>
          <ul className="space-y-2 text-left">
            {confirmedGuests
              .sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis())
              .map((guest) => (
                <li key={guest.id} className="text-lg md:text-xl p-2 rounded-lg transition-colors duration-200 bg-gray-50 hover:bg-gray-100 flex items-center">
                  <span className="mr-2">{guest.isAttending ? '✅' : '❌'}</span>
                  <span>{guest.name}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Información para el usuario */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>La información se guarda de forma segura en Firestore.</p>
        <p>Total de confirmaciones: {confirmedGuests.length}</p>
      </div>
    </div>
  );
};

export default App;
