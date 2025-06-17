# Guía: CSS Grid y Funciones Adaptativas en Astro

## Introducción

Esta guía documenta la implementación de un sistema híbrido que combina CSS Grid responsive con funciones JavaScript adaptativas para crear layouts consistentes y optimizados en Astro. El caso de uso principal es mantener la consistencia visual en tarjetas de contenido con texto de longitud variable.

## Problema Resuelto

### Situación Inicial
- Tarjetas de blog con alturas inconsistentes debido a descripciones de diferente longitud
- Botones "Ver más" en posiciones variables
- Falta de consistencia visual en el layout

### Solución Implementada
- **CSS Grid responsive** para estructura consistente
- **Función JavaScript adaptativa** para contenido optimizado
- **Line-clamp responsive** para control de texto
- **Media queries optimizadas** para todos los dispositivos

## Implementación

### 1. Función JavaScript Adaptativa

```javascript
// Función que ajusta la longitud del excerpt según las líneas de descripción
function getResponsiveExcerpt(content, description, maxLength = 320) {
  // Limpiar el contenido markdown
  let cleanContent = content
    .replace(/^---[\s\S]*?---/, '') // Remover frontmatter
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remover imágenes
    .replace(/#{1,6}\s+/g, '') // Remover headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remover bold
    .replace(/\*(.*?)\*/g, '$1') // Remover italic
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remover links
    .trim();

  // Estimar líneas de descripción (45 caracteres por línea aprox.)
  const estimatedLines = Math.ceil(description.length / 45);
  
  // Ajustar longitud según líneas de descripción
  let adaptiveLength;
  if (estimatedLines <= 1) {
    adaptiveLength = 350; // Más texto para descripciones cortas
  } else {
    adaptiveLength = 290; // Menos texto para descripciones largas
  }

  // Truncar si es necesario
  if (cleanContent.length > adaptiveLength) {
    return cleanContent.substring(0, adaptiveLength).trim() + '...';
  }
  
  return cleanContent;
}
```

### 2. CSS Grid Responsive

```css
/* Contenedor principal con Grid */
.post-content {
  display: grid;
  grid-template-rows: auto auto 1fr auto; /* título, descripción, excerpt, botón */
  min-height: 180px; /* Altura mínima consistente */
  gap: 0.5rem;
}

/* Control de líneas con line-clamp */
.post-excerpt {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Máximo 3 líneas en desktop */
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

/* Media Queries Responsive */

/* Tablet */
@media (max-width: 768px) {
  .post-content {
    min-height: 160px;
  }
  
  .post-excerpt {
    -webkit-line-clamp: 2; /* 2 líneas en tablet */
  }
}

/* Mobile */
@media (max-width: 480px) {
  .post-content {
    min-height: 140px;
  }
  
  .post-excerpt {
    -webkit-line-clamp: 4; /* 4 líneas en mobile */
  }
}
```

### 3. Estructura HTML en Astro

```astro
---
// En el frontmatter
const recentPosts = (await getCollection('posts'))
  .sort((a, b) => new Date(b.data.pubDate).valueOf() - new Date(a.data.pubDate).valueOf())
  .slice(0, 6);
---

<!-- En el template -->
<div class="posts-grid">
  {recentPosts.map((post) => (
    <article class="post-card">
      <div class="post-layout">
        <!-- Imagen -->
        <div class="post-thumbnail">
          <img src={post.data.image} alt={post.data.title} />
        </div>
        
        <!-- Contenido con Grid -->
        <div class="post-content">
          <h3 class="post-title">{post.data.title}</h3>
          <p class="post-description">{post.data.description}</p>
          <p class="post-excerpt">
            {getResponsiveExcerpt(post.body, post.data.description)}
          </p>
          <a href={`/blog/${post.slug}/`} class="read-more-btn">Ver más</a>
        </div>
      </div>
      
      <footer class="post-date-footer">
        <time>{post.data.pubDate.toLocaleDateString()}</time>
      </footer>
    </article>
  ))}
</div>
```

## Ventajas del Sistema Híbrido

### ✅ Consistencia Visual
- Todas las tarjetas mantienen la misma altura
- Elementos alineados uniformemente
- Botones en posiciones fijas

### ✅ Contenido Adaptativo
- Más texto cuando hay espacio disponible
- Menos texto cuando el espacio es limitado
- Optimización automática del contenido

### ✅ Responsive Completo
- Adaptación automática a diferentes dispositivos
- Media queries optimizadas
- Line-clamp responsive

### ✅ Performance
- CSS Grid nativo (sin JavaScript en runtime)
- Procesamiento en build-time con Astro
- Carga rápida y eficiente

### ✅ Compatibilidad
- Funciona perfectamente con SSG de Astro
- Compatible con todos los navegadores modernos
- Fallbacks para navegadores antiguos

## Casos de Uso

### Ideal Para:
- **Tarjetas de blog** con contenido variable
- **Grids de productos** con descripciones diferentes
- **Portfolios** con proyectos de distinta complejidad
- **Listados de noticias** con títulos y extractos
- **Galerías de contenido** que requieren uniformidad visual

### No Recomendado Para:
- Contenido que debe mostrar texto completo
- Layouts que requieren alturas dinámicas
- Casos donde la truncación de texto no es aceptable

## Personalización

### Ajustar Longitudes de Texto

```javascript
// Modificar los valores según necesidades
if (estimatedLines <= 1) {
  adaptiveLength = 400; // Aumentar para más texto
} else {
  adaptiveLength = 250; // Reducir para menos texto
}
```

### Cambiar Breakpoints

```css
/* Personalizar breakpoints según diseño */
@media (max-width: 1024px) { /* Tablet grande */ }
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }
```

### Ajustar Line-Clamp

```css
/* Modificar número de líneas según necesidades */
.post-excerpt {
  -webkit-line-clamp: 2; /* Cambiar número */
}
```

## Mejores Prácticas

### 1. Estimación de Líneas
- **45 caracteres por línea** es una buena aproximación para desktop
- Ajustar según la tipografía y ancho del contenedor
- Considerar espacios y puntuación en el cálculo

### 2. Alturas Mínimas
- Establecer `min-height` basado en el contenido más largo esperado
- Usar unidades relativas (`rem`, `em`) para mejor escalabilidad
- Probar en diferentes dispositivos y tamaños de pantalla

### 3. Grid Template Rows
- `auto` para elementos de altura variable (título, descripción)
- `1fr` para el área que debe expandirse (excerpt)
- `auto` para elementos fijos (botones, footer)

### 4. Testing Responsive
- Probar con contenido real de diferentes longitudes
- Verificar en múltiples dispositivos y navegadores
- Validar que el line-clamp funciona correctamente

## Troubleshooting

### Problema: Alturas Inconsistentes
**Solución:** Verificar que `min-height` esté aplicado correctamente y que `grid-template-rows` use `1fr` para el área expansible.

### Problema: Line-Clamp No Funciona
**Solución:** Asegurar que el elemento tenga `display: -webkit-box` y `-webkit-box-orient: vertical`.

### Problema: Texto Cortado Abruptamente
**Solución:** Ajustar la función `getResponsiveExcerpt` para cortar en espacios o palabras completas.

### Problema: Layout Roto en Mobile
**Solución:** Revisar media queries y ajustar `min-height` y `line-clamp` para pantallas pequeñas.

## Conclusión

Este sistema híbrido proporciona una solución robusta y escalable para mantener layouts consistentes con contenido variable. La combinación de CSS Grid nativo y funciones adaptativas en build-time ofrece el mejor balance entre performance, flexibilidad y compatibilidad en proyectos Astro.

**Recuerda:** Siempre probar con contenido real y en múltiples dispositivos para garantizar la mejor experiencia de usuario.