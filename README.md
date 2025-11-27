# 🍳 Tu Cocina Digital - Recipe App

Una aplicación web moderna y minimalista para gestionar, crear y descubrir recetas de cocina. Diseñada con un enfoque "Mobile-First" y una experiencia de usuario fluida.

## ✨ Características

- **Exploración de Recetas**:

  - Buscador avanzado por título o ingrediente.
  - Filtrado por categorías (Pasta, Carnes, Vegano, etc.).
  - Secciones de "Recientes" y "Recomendadas".

  - **Gestión de Recetas**:
  - **Crear y Editar**: Editor completo para añadir nuevas recetas o modificar las existentes.
  - **Validación**: Asegura que tus recetas tengan al menos un ingrediente y un paso.
  - **Gestión de Imágenes**: Sube fotos comprimidas automáticamente para el plato principal y cada paso.
  - **Eliminar**: Opción para borrar recetas que ya no necesites.
  - **Persistencia**: Las recetas se guardan localmente en el dispositivo (LocalStorage).
  - **Favoritos**: Guarda tus recetas preferidas para acceso rápido.

- **Experiencia de Cocina**:

  - **Modo Cocina**: Vista inmersiva paso a paso sin distracciones.
  - **Detalles Claros**: Tiempos, dificultad, raciones e ingredientes interactivos.

- **Diseño**:
  - Interfaz limpia y moderna (estilo "Glassmorphism" sutil).
  - Totalmente responsiva (móvil, tablet, desktop).
  - Soporte para **Modo Oscuro** automático.

## 🛠️ Tecnologías

Este proyecto está construido con tecnologías web estándar, sin dependencias de frameworks pesados, asegurando un alto rendimiento y facilidad de mantenimiento.

- **HTML5**: Estructura semántica.
- **CSS3**: Variables CSS, Flexbox, Grid y animaciones.
- **JavaScript (Vanilla)**:
  - **SPA Router**: Enrutamiento personalizado sin recargas de página.
  - **State Management**: Store centralizado con persistencia en LocalStorage.
  - **Canvas API**: Compresión de imágenes en el cliente antes del guardado.

## 🚀 Cómo Ejecutar

No se requiere instalación de dependencias (npm, etc.) ya que utiliza JavaScript nativo.

1. **Clonar o Descargar** este repositorio.
2. **Abrir** el archivo `index.html` en tu navegador web preferido.
   - _Recomendado_: Usar una extensión como "Live Server" en VS Code para una mejor experiencia de desarrollo.

## 📱 Uso

1. **Inicio**: Explora las recetas predefinidas o busca algo específico.
2. **Crear**: Ve a la pestaña "+" en la barra inferior para añadir tu propia receta. ¡No olvides subir una foto apetitosa!
3. **Cocinar**: Abre una receta y pulsa "Modo Cocina" para empezar a preparar tu plato.
4. **Perfil**: Consulta tus recetas guardadas y favoritos en la pestaña de perfil.

---

Desarrollado con ❤️ para los amantes de la cocina.
