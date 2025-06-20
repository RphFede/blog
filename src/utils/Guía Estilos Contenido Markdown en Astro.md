# Guía: Estilos para Contenido Markdown en Astro

## Introducción

Esta guía explica cómo aplicar estilos CSS al contenido markdown renderizado en páginas dinámicas de Astro, específicamente en archivos como `[slug].astro` donde se utiliza el componente `<Content />` para mostrar contenido de posts.

## Contexto del Problema

Cuando Astro renderiza contenido markdown a través del componente `<Content />`, el HTML generado no hereda automáticamente los estilos CSS del componente padre. Esto requiere técnicas específicas para aplicar estilos al contenido dinámico.

## Métodos de Estilización

### 1. Estilos Directos con `:global()` (Recomendado)

**Ubicación:** Directamente en el archivo `[slug].astro`

```astro
<!-- pages/blog/[slug].astro -->
<style>
/* Estilos para el contenido markdown */
article :global(h1) {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

article :global(h2) {
  font-size: 2rem;
  color: #374151;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

article :global(h3) {
  font-size: 1.5rem;
  color: #4b5563;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

article :global(p) {
  line-height: 1.8;
  margin-bottom: 1.25rem;
  color: #374151;
  text-align: justify;
  font-size: 1.1rem;
}

article :global(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: #6b7280;
  background-color: #f8fafc;
  padding: 1rem 1.5rem;
  border-radius: 0 8px 8px 0;
}

article :global(code) {
  background-color: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #dc2626;
}

article :global(pre) {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
}

article :global(pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

article :global(ul), article :global(ol) {
  margin-bottom: 1.25rem;
  padding-left: 2rem;
}

article :global(li) {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

article :global(a) {
  color: #3b82f6;
  text-decoration: underline;
  transition: color 0.2s;
}

article :global(a:hover) {
  color: #1d4ed8;
}

article :global(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

article :global(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

article :global(th), article :global(td) {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

article :global(th) {
  background-color: #f9fafb;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  article :global(h1) {
    font-size: 2rem;
  }
  
  article :global(h2) {
    font-size: 1.75rem;
  }
  
  article :global(p) {
    font-size: 1rem;
  }
  
  article :global(pre) {
    padding: 1rem;
    font-size: 0.9rem;
  }
}
</style>
```

**Ventajas:**
- Control total sobre los estilos
- Especificidad alta
- Fácil mantenimiento
- No afecta otros componentes

### 2. Estilos Globales

**Ubicación:** `src/styles/global.css`

```css
/* Estilos para contenido de posts */
.post-content h1,
.post-content h2,
.post-content h3,
.post-content h4,
.post-content h5,
.post-content h6 {
  font-family: 'Georgia', serif;
  font-weight: 600;
  line-height: 1.3;
}

.post-content p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 1.25rem;
}

.post-content blockquote {
  border-left: 4px solid #f59e0b;
  padding-left: 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: #6b7280;
}
```

**Implementación en [slug].astro:**
```astro
<div class="post-content">
  <Content />
</div>
```

### 3. Componente Wrapper

**Crear:** `src/components/PostContent.astro`

```astro
---
const { Content } = Astro.props;
---

<div class="post-content">
  <Content />
</div>

<style>
.post-content {
  max-width: 65ch;
  margin: 0 auto;
}

.post-content :global(h1) {
  /* Estilos específicos */
}

/* Más estilos... */
</style>
```

**Uso en [slug].astro:**
```astro
import PostContent from '../../components/PostContent.astro';

<PostContent Content={Content} />
```

## Conceptos Clave

### `:global()` en Astro

- **Propósito:** Permite que los estilos afecten elementos generados dinámicamente
- **Sintaxis:** `:global(selector)`
- **Necesario:** Para contenido renderizado por `<Content />`

### Especificidad CSS

1. **Estilos inline** (mayor especificidad)
2. **Estilos en componente con :global()**
3. **Estilos globales**
4. **Estilos por defecto del navegador** (menor especificidad)

### Selectores Recomendados

```css
/* Específico para el artículo */
article :global(elemento)

/* Con clase wrapper */
.post-content :global(elemento)

/* Global directo */
.markdown-content elemento
```

## Mejores Prácticas

### 1. Tipografía Legible

```css
article :global(p) {
  font-size: 1.1rem;
  line-height: 1.8;
  max-width: 65ch; /* Óptimo para lectura */
  color: #374151;
}
```

### 2. Jerarquía Visual Clara

```css
article :global(h1) { font-size: 2.5rem; }
article :global(h2) { font-size: 2rem; }
article :global(h3) { font-size: 1.5rem; }
```

### 3. Espaciado Consistente

```css
article :global(h1),
article :global(h2),
article :global(h3) {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

article :global(p),
article :global(ul),
article :global(ol) {
  margin-bottom: 1.25rem;
}
```

### 4. Elementos Especiales

```css
/* Código inline */
article :global(code) {
  background-color: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* Bloques de código */
article :global(pre) {
  background-color: #1e293b;
  color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
}

/* Citas */
article :global(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1.5rem;
  font-style: italic;
  color: #6b7280;
}
```

## Diseño Responsivo

```css
@media (max-width: 768px) {
  article :global(h1) {
    font-size: 2rem;
  }
  
  article :global(p) {
    font-size: 1rem;
    line-height: 1.7;
  }
  
  article :global(pre) {
    padding: 1rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  article :global(h1) {
    font-size: 1.75rem;
  }
  
  article :global(blockquote) {
    padding-left: 1rem;
    margin: 1rem 0;
  }
}
```

## Ejemplo Completo

```astro
<!-- pages/blog/[slug].astro -->
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ContentSheet from '../../components/ContentSheet.astro';
import PostHeader from '../../components/PostHeader.astro';

export async function getStaticPaths() {
  const allPosts = await getCollection('posts');
  return allPosts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BaseLayout>
  <ContentSheet>
    <article class="blog-post">
      <PostHeader 
        title={post.data.title} 
        description={post.data.description} 
      />
      <div class="post-content">
        <Content />
      </div>
    </article>
  </ContentSheet>
</BaseLayout>

<style>
.blog-post {
  max-width: 800px;
  margin: 0 auto;
}

.post-content :global(h1) {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.post-content :global(p) {
  line-height: 1.8;
  margin-bottom: 1.25rem;
  color: #374151;
  font-size: 1.1rem;
}

/* Más estilos... */
</style>
```

## Troubleshooting

### Problema: Los estilos no se aplican
**Solución:** Verificar que estés usando `:global()` para contenido dinámico

### Problema: Conflictos de estilos
**Solución:** Aumentar especificidad o usar selectores más específicos

### Problema: Estilos no responsivos
**Solución:** Agregar media queries apropiadas

## Recursos Adicionales

- [Documentación oficial de Astro sobre estilos](https://docs.astro.build/en/guides/styling/)
- [Guía de CSS :global() en Astro](https://docs.astro.build/en/guides/styling/#global-styles)
- [Mejores prácticas de tipografía web](https://web.dev/learn/design/typography/)

---

**Nota:** Esta guía se basa en Astro v3+ y las mejores prácticas actuales de desarrollo web.