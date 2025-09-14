# 🍼 Baby Shower App

Una aplicación React para gestionar invitaciones y confirmaciones de asistencia para un Baby Shower.

## 🚀 Características

- ✨ Diseño hermoso y responsivo con Tailwind CSS
- 🔥 Integración con Firebase para almacenamiento en tiempo real
- 📱 Funciona perfectamente en móviles y escritorio
- 👥 Lista de invitados confirmados en tiempo real
- 🎨 Interfaz moderna con gradientes y animaciones

## 📋 Requisitos previos

- Node.js (versión 16 o superior)
- npm o yarn
- Una cuenta de Firebase

## 🛠️ Instalación

1. **Clona o descarga el proyecto**
2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura Firebase:**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto
   - Habilita Authentication (método Anonymous)
   - Habilita Firestore Database
   - Copia la configuración en `firebase-config.js`

4. **Ejecuta la aplicación:**
   ```bash
   npm run dev
   ```

## 🔧 Configuración de Firebase

1. **Crear proyecto en Firebase:**
   - Ve a https://console.firebase.google.com/
   - Haz clic en "Crear proyecto"
   - Sigue las instrucciones

2. **Configurar Authentication:**
   - En el panel lateral, ve a "Authentication"
   - Haz clic en "Comenzar"
   - Ve a "Sign-in method"
   - Habilita "Anonymous"

3. **Configurar Firestore:**
   - En el panel lateral, ve a "Firestore Database"
   - Haz clic en "Crear base de datos"
   - Selecciona "Modo de prueba" (para desarrollo)

4. **Obtener configuración:**
   - Ve a "Configuración del proyecto"
   - En "Tus aplicaciones", haz clic en "Agregar aplicación"
   - Selecciona "Web"
   - Copia la configuración y reemplaza los valores en `firebase-config.js`

## 📱 Uso

1. **Ejecuta la aplicación:**
   ```bash
   npm run dev
   ```

2. **Abre tu navegador** en la URL que aparece (generalmente http://localhost:5173)

3. **Personaliza la información:**
   - Cambia la fecha, hora y lugar en `src/App.jsx`
   - Modifica los textos según tus necesidades
   - Reemplaza la imagen placeholder con una imagen real

## 🎨 Personalización

### Cambiar información del evento:
Edita las siguientes líneas en `src/App.jsx`:
```jsx
<p className="text-lg md:text-xl font-semibold text-purple-600 flex items-center justify-center">
  <span className="mr-2">📅</span>
  Fecha: Sábado, 25 de Octubre, 2025  // Cambia aquí
</p>
```

### Cambiar colores:
Los colores principales están definidos con clases de Tailwind:
- Rosa: `text-pink-500`, `bg-pink-50`
- Púrpura: `text-purple-600`, `bg-purple-500`

### Cambiar imagen:
Reemplaza la URL en esta línea:
```jsx
<img
  src="https://placehold.co/600x400/ffe4e1/6b46c1?text=Baby+Shower"
  alt="Imagen de bienvenida al Baby Shower"
  className="rounded-3xl shadow-lg w-full mb-8"
/>
```

## 🚀 Despliegue

Para desplegar en producción:

1. **Construye la aplicación:**
   ```bash
   npm run build
   ```

2. **Despliega en tu plataforma preferida:**
   - Vercel: `npx vercel`
   - Netlify: Arrastra la carpeta `dist` a Netlify
   - Firebase Hosting: `firebase deploy`

## 📝 Estructura del proyecto

```
baby-shower-app/
├── src/
│   ├── App.jsx          # Componente principal
│   ├── App.css          # Estilos CSS
│   └── main.jsx         # Punto de entrada
├── firebase-config.js   # Configuración de Firebase
├── package.json         # Dependencias
└── README.md           # Este archivo
```

## 🤝 Contribuir

Si quieres mejorar esta aplicación, puedes:
1. Hacer fork del proyecto
2. Crear una rama para tu feature
3. Hacer commit de tus cambios
4. Hacer push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Si tienes problemas:
1. Revisa que Firebase esté configurado correctamente
2. Verifica que todas las dependencias estén instaladas
3. Revisa la consola del navegador para errores
4. Asegúrate de que el proyecto de Firebase tenga Authentication y Firestore habilitados

¡Disfruta organizando tu Baby Shower! 🎉