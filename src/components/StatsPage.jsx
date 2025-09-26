import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import firebaseConfig from '../../firebase-config.js';

const StatsPage = () => {
  const [stats, setStats] = useState({
    totalRsvps: 0,
    attending: 0,
    notAttending: 0,
    rsvps: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      // Inicializar Firebase
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      
      console.log('Conectando a Firebase...');
      const rsvpsRef = collection(db, 'rsvps');
      const q = query(rsvpsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      console.log('Documentos encontrados:', querySnapshot.size);
      
      const rsvps = [];
      let attending = 0;
      let notAttending = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Documento:', doc.id, data);
        rsvps.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() || new Date()
        });
        
        if (data.isAttending) {
          attending++;
        } else {
          notAttending++;
        }
      });

      console.log('RSVPs procesados:', rsvps);
      console.log('Asistirán:', attending, 'No asistirán:', notAttending);

      setStats({
        totalRsvps: rsvps.length,
        attending,
        notAttending,
        rsvps
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      setError(`Error al cargar las estadísticas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-600">
              📊 Estadísticas del Baby Shower
            </h1>
            <a
              href="/"
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Volver al Inicio
            </a>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {stats.totalRsvps}
            </div>
            <div className="text-lg text-gray-600">Total Confirmaciones</div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {stats.attending}
            </div>
            <div className="text-lg text-gray-600">Asistirán</div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl p-6 text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {stats.notAttending}
            </div>
            <div className="text-lg text-gray-600">No Asistirán</div>
          </div>
        </div>

        {/* Gráfico de barras simple */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Distribución de Asistencia</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-24 text-sm font-medium text-green-600">Asistirán</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 mx-4">
                <div 
                  className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${stats.totalRsvps > 0 ? (stats.attending / stats.totalRsvps) * 100 : 0}%` }}
                >
                  <span className="text-white text-sm font-medium">
                    {stats.attending}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-24 text-sm font-medium text-red-600">No Asistirán</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 mx-4">
                <div 
                  className="bg-red-500 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${stats.totalRsvps > 0 ? (stats.notAttending / stats.totalRsvps) * 100 : 0}%` }}
                >
                  <span className="text-white text-sm font-medium">
                    {stats.notAttending}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de confirmaciones */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-purple-600">Lista de Confirmaciones</h2>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">Cargando...</div>
            </div>
          ) : stats.rsvps.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">No hay confirmaciones aún</div>
              <div className="text-sm text-gray-500 mt-2">
                Revisa la consola del navegador para más detalles
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Asistencia</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rsvps.map((rsvp) => (
                    <tr key={rsvp.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {rsvp.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rsvp.isAttending 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {rsvp.isAttending ? '✅ Asistirá' : '❌ No asistirá'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(rsvp.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
