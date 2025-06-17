# Guía: Manejo de Imágenes en Astro

## Problema Resuelto: Thumbnails no aparecían en index.astro

### Contexto del Problema

Las imágenes se mostraban correctamente en los posts individuales (`/blog/[slug]`) pero **NO** aparecían como thumbnails en la página principal (`index.astro`).

### Diagnóstico Inicial (Incorrecto)

❌ **Pensamos que el problema eran las rutas en markdown:**
- Creíamos que `../posts-content/` debía cambiarse a `./posts-content/`
- Pero esto era incorrecto porque las rutas funcionaban perfectamente en posts individuales

### Diagnóstico Correcto

✅ **El verdadero problema:**

1. **En posts individuales**: Las rutas `../posts-content/` funcionan porque son correctas desde `src/content/posts/`
2. **En index.astro**: Se usaba tag `<img>` normal que **NO** puede procesar rutas relativas con el schema `image()` de Astro

### La Solución

#### Antes (No funcionaba):
```astro
<!-- En src/pages/index.astro líneas 44-50 -->
<img
  src={post.data.image.url}
  alt={post.data.image.alt}
  width={200}
  height={150}
  loading="lazy"
/>
```

#### Después (Funciona correctamente):
```astro
<!-- Agregar import al inicio del archivo -->
import { Image } from 'astro:assets';

<!-- Reemplazar <img> por <Image> -->
<Image
  src={post.data.image.url}
  alt={post.data.image.alt}
  width={200}
  height={150}
  loading="lazy"
/>
```

## Configuración del Schema

### En `src/content/config.ts`:
```typescript
const postsCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string(),
    image: z.object({
        url: image(), // ← Esto es clave
        alt: z.string(),
    }).optional(),
    tags: z.array(z.string()),
  }),
});
```

### En archivos markdown (Correcto):
```yaml
---
title: 'Mi Post'
image:
    url: "../posts-content/post-1/imagen.webp"  # ✅ Correcto
    alt: "Descripción de la imagen"
---
```

## ¿Por qué funciona así?

### Schema `image()` de Astro:
- **Procesa rutas relativas automáticamente**
- **Optimiza imágenes** (compresión, formatos modernos)
- **Genera metadata** necesaria para el componente `<Image>`
- **Resuelve rutas** desde `./posts-content/` correctamente

### Diferencia entre `<img>` y `<Image>`:

| Aspecto | `<img>` normal | `<Image>` de Astro |
|---------|----------------|--------------------|
| Rutas relativas | ❌ No procesa | ✅ Procesa automáticamente |
| Optimización | ❌ No optimiza | ✅ Optimiza automáticamente |
| Schema `image()` | ❌ No compatible | ✅ Totalmente compatible |
| Metadata | ❌ Manual | ✅ Automática |

## Código Innecesario Detectado

### Problema: `{ Content }` "never read"

En `index.astro` línea 36:
```javascript
const { Content } = await post.render(); // ← Innecesario aquí
const excerpt = getExcerpt(post.body);
```

**Solución**: Eliminar la línea del `Content`:
```javascript
const excerpt = getExcerpt(post.body); // ← Solo esto es necesario
```

**¿Por qué?**
- `Content` se usa para renderizar el post completo
- En `index.astro` solo necesitamos: título, descripción, excerpt e imagen
- `Content` SÍ se usa en `/blog/[slug].astro` para mostrar el post completo

## Estructura de Archivos

```
src/
├── content/
│   ├── config.ts           # Schema con image()
│   ├── posts/
│   │   ├── post-1.md       # Rutas: ../posts-content/
│   │   ├── post-2.md
│   │   └── post-3.md
│   └── posts-content/      # Imágenes aquí
│       ├── post-1/
│       ├── post-2/
│       └── post-3/
└── pages/
    ├── index.astro         # Usa <Image> para thumbnails
    └── blog/
        └── [slug].astro    # Usa <Content /> para posts
```

## Mejores Prácticas

### ✅ Hacer:
1. **Usar `<Image>` de Astro** para todas las imágenes dinámicas
2. **Mantener rutas relativas** en markdown (`../posts-content/`)
3. **Usar schema `image()`** en `config.ts`
4. **Importar `{ Image }`** en archivos que lo necesiten

### ❌ Evitar:
1. **No usar `<img>` normal** para imágenes del schema
2. **No cambiar rutas** en markdown sin entender el contexto
3. **No dejar código innecesario** como `{ Content }` sin usar
4. **No asumir que el problema** está en las rutas sin verificar

## Comandos Útiles

```bash
# Verificar que el servidor funciona
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

---

**Fecha de creación**: Enero 2025  
**Problema resuelto**: Thumbnails no aparecían en index.astro  
**Solución**: Cambiar `<img>` por `<Image>` de Astro