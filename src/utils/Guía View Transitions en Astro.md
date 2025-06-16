# 📚 Guía Completa: View Transitions en Astro

## 🎯 ¿Qué son las View Transitions?

Las View Transitions en Astro permiten crear navegación fluida tipo SPA (Single Page Application) sin recargas completas de página, manteniendo un rendimiento óptimo.

## 🔄 ¿Cuándo se destruyen y recrean los elementos?

### CON View Transitions activadas (`<ClientRouter />` presente):

**🔴 Elementos SIN `transition:persist`:**
- Se **DESTRUYEN completamente** en cada navegación
- Se **recrean desde cero** con el nuevo contenido
- **Se pierden**: estado interno, event listeners, posición de scroll, animaciones en curso
- Los scripts de inicialización se ejecutan nuevamente

**✅ Elementos CON `transition:persist`:**
- Se **mantienen exactamente iguales**
- **Conservan todo**: estado, listeners, posición, animaciones
- Es como si fueran "inmunes" a los cambios de página

### ❌ SIN View Transitions (navegación tradicional):
- **TODA la página se recarga** completamente
- **TODOS los elementos** se destruyen y recrean
- Es como abrir una nueva pestaña cada vez
- No hay diferencia entre elementos, todos se pierden

## 📊 Ejemplo práctico

```astro
<!-- ❌ Este video se REINICIA en cada página -->
<video controls>
  <source src="musica.mp3">
</video>

<!-- ✅ Este video CONTINÚA reproduciéndose -->
<video controls transition:persist>
  <source src="musica.mp3">
</video>

<!-- ❌ Este formulario PIERDE los datos -->
<form>
  <input type="text" placeholder="Tu nombre">
</form>

<!-- ✅ Este formulario MANTIENE los datos -->
<form transition:persist>
  <input type="text" placeholder="Tu nombre">
</form>
```

## 🎯 Casos de uso comunes

### ✅ USA `transition:persist` PARA:

- **Header/Navigation** → mantener estado de menús desplegables
- **Reproductores de audio/video** → no interrumpir reproducción
- **Formularios** → no perder datos ingresados
- **Modales/Overlays** → mantener estado abierto/cerrado
- **Sidebars** → conservar estado expandido/colapsado
- **Carritos de compra** → mantener productos seleccionados
- **Chats en vivo** → conservar conversaciones

### ❌ NO USES `transition:persist` PARA:

- **Contenido principal** → debe cambiar entre páginas
- **Breadcrumbs** → deben reflejar la página actual
- **Títulos de página** → deben actualizarse
- **Elementos que cambian según la ruta** → contenido dinámico
- **Componentes que necesitan reinicializarse** → datos específicos de página

## 🛠️ Implementación básica

### 1. Activar View Transitions

```astro
---
// BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
---

<html>
  <head>
    <ClientRouter />
  </head>
  <body>
    <!-- Tu contenido aquí -->
  </body>
</html>
```

### 2. Elementos persistentes

```astro
<!-- Header que mantiene estado -->
<header transition:persist="header">
  <Navigation />
</header>

<!-- Contenido que cambia -->
<main transition:name="main-content">
  <slot />
</main>

<!-- Footer persistente -->
<footer transition:persist="footer">
  <Footer />
</footer>
```

### 3. Scripts que persisten

```astro
<script>
  // ✅ Este script se ejecuta una vez y persiste
  function initializeApp() {
    console.log("App inicializada");
  }
  
  // Ejecutar en carga inicial
  initializeApp();
  
  // Ejecutar después de cada transición
  document.addEventListener('astro:after-swap', () => {
    console.log("Página cambiada");
    // Reinicializar solo lo necesario
  });
</script>
```

## 🎨 Personalizar transiciones

### Transición fade suave

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
  animation-timing-function: ease-in-out;
}

::view-transition-old(root) {
  animation-name: fade-out;
}

::view-transition-new(root) {
  animation-name: fade-in;
}

@keyframes fade-out {
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
}
```

### Transición slide horizontal

```css
::view-transition-old(root) {
  animation: slide-out-left 0.3s ease-in-out;
}

::view-transition-new(root) {
  animation: slide-in-right 0.3s ease-in-out;
}

@keyframes slide-out-left {
  to { transform: translateX(-100%); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
}
```

## 🔧 Eventos útiles

```javascript
// Antes de preparar la nueva página
document.addEventListener('astro:before-preparation', (event) => {
  console.log('Preparando nueva página...');
  // Mostrar loader, limpiar estados
});

// Después de preparar, antes de intercambiar
document.addEventListener('astro:after-preparation', () => {
  console.log('Nueva página preparada');
});

// Antes del intercambio visual
document.addEventListener('astro:before-swap', () => {
  console.log('Iniciando transición visual...');
});

// Después de completar la transición
document.addEventListener('astro:after-swap', () => {
  console.log('Transición completada');
  // Reinicializar scripts específicos de página
});
```

## 🚫 Deshabilitar transiciones condicionalmente

```javascript
document.addEventListener('astro:before-preparation', (event) => {
  // Deshabilitar para rutas específicas
  if (event.to.pathname.startsWith('/admin')) {
    event.preventDefault();
  }
  
  // Deshabilitar para enlaces externos
  if (event.to.origin !== window.location.origin) {
    event.preventDefault();
  }
});
```

## 📝 Mejores prácticas

### ✅ Hacer:
- Usar `transition:persist` para elementos que deben mantener estado
- Probar las transiciones en diferentes dispositivos
- Considerar la accesibilidad (usuarios con `prefers-reduced-motion`)
- Mantener las animaciones sutiles y rápidas
- Usar nombres descriptivos para `transition:name`

### ❌ Evitar:
- Abusar de `transition:persist` (solo usar cuando sea necesario)
- Transiciones muy largas o complejas
- Olvidar reinicializar scripts después de `astro:after-swap`
- Usar transiciones en elementos que cambian frecuentemente

## 🔍 Debugging

```javascript
// Solo en desarrollo
if (import.meta.env.DEV) {
  let transitionCount = 0;
  
  document.addEventListener('astro:after-swap', () => {
    transitionCount++;
    console.log(`🔄 Transición #${transitionCount} completada`);
    console.log('Nueva URL:', window.location.pathname);
  });
  
  document.addEventListener('astro:before-preparation', (event) => {
    console.log('🚀 Navegando de:', event.from.pathname);
    console.log('🎯 Navegando a:', event.to.pathname);
  });
}
```

## 📚 Recursos adicionales

- [Documentación oficial de Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- [Especificación Web API View Transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [Ejemplos de transiciones CSS](./src/styles/transition-examples.css)

---

**💡 Tip**: Siempre prueba tus transiciones en el archivo `BaseLayoutExample.astro` antes de aplicarlas a tu layout principal.