# 📚 Guía de Aprendizaje: Helpers y TypeScript en Astro

## 🎯 ¿Qué son los Helpers?

Los **helpers** son funciones utilitarias que encapsulan lógica específica para simplificar y organizar mejor tu código.

### Ventajas de usar Helpers:

✅ **Separación de responsabilidades**: Cada función tiene un propósito específico  
✅ **Reutilización**: Puedes usar la misma función en múltiples componentes  
✅ **Testing**: Fácil de testear cada función por separado  
✅ **Mantenimiento**: Cambios centralizados en un solo lugar  
✅ **Legibilidad**: Código más limpio y autodocumentado  

## 🔧 Ejemplo Práctico: Social Links

### ❌ Sin Helper (Problemático)
```astro
---
// Lógica mezclada con presentación
const platforms = ["github", "instagram"];
const urls = { github: "https://github.com", instagram: "https://instagram.com" };
const usernames = { github: "RphFede", instagram: "rph.fede" };
---

<footer>
  {platforms.map(platform => 
    // ⚠️ Type assertions complejas y lógica duplicada
    <a href={urls[platform as keyof typeof urls] + "/" + usernames[platform as keyof typeof usernames]}>
      {platform}
    </a>
  )}
</footer>
```

### ✅ Con Helper (Mejorado)
```typescript
// socialLinks.ts - Lógica centralizada
export function getSocialLink(platform: SocialPlatform): string {
  return `${platform.url}/${platform.username}`;
}
```

```astro
---
// Footer.astro - Solo presentación
import { socialLinks, getSocialLink } from '../data/socialLinks';
---

<footer>
  {socialLinks.map(social => 
    <a href={getSocialLink(social)}>{social.name}</a>
  )}
</footer>
```

## 🧪 Testing de Helpers

```typescript
// socialLinks.test.ts
import { getSocialLink, getSocialLinkByName } from '../data/socialLinks';

test('getSocialLink construye URL correctamente', () => {
  const platform = {
    name: "GitHub",
    url: "https://github.com",
    username: "RphFede"
  };
  
  expect(getSocialLink(platform)).toBe('https://github.com/RphFede');
});

test('getSocialLinkByName encuentra plataforma existente', () => {
  expect(getSocialLinkByName('GitHub')).toBe('https://github.com/RphFede');
});

test('getSocialLinkByName lanza error para plataforma inexistente', () => {
  expect(() => getSocialLinkByName('LinkedIn')).toThrow('Plataforma "LinkedIn" no encontrada');
});
```

## 🎨 Conceptos de TypeScript

### Interfaces
```typescript
// Define la "forma" que debe tener un objeto
interface SocialPlatform {
  name: string;    // Obligatorio
  url: string;     // Obligatorio
  username: string; // Obligatorio
}

// Con propiedades opcionales
interface SocialPlatformExtended {
  name: string;
  url: string;
  username: string;
  icon?: string;     // Opcional (puede ser undefined)
  verified?: boolean; // Opcional
}
```

### Type Assertions vs Type Guards
```typescript
// ❌ Type Assertion (forzar tipo, puede ser peligroso)
const platform = data as SocialPlatform;

// ✅ Type Guard (verificar tipo de forma segura)
function isSocialPlatform(obj: any): obj is SocialPlatform {
  return obj && 
         typeof obj.name === 'string' && 
         typeof obj.url === 'string' && 
         typeof obj.username === 'string';
}

if (isSocialPlatform(data)) {
  // Aquí TypeScript sabe que data es SocialPlatform
  console.log(data.name);
}
```

## 🚀 Conceptos de Astro

### Estructura de Componente
```astro
---
// SCRIPT SECTION (Server-side)
// - Se ejecuta en build time
// - Puede usar Node.js APIs
// - No está disponible en el cliente

import { getData } from './utils';
const data = await getData(); // ✅ Async/await permitido
---

<!-- TEMPLATE SECTION -->
<!-- HTML con expresiones JavaScript -->
<div>{data.title}</div>

<style>
  /* STYLE SECTION */
  /* Automáticamente scoped al componente */
  div {
    color: blue;
  }
</style>

<script>
  // CLIENT SCRIPT SECTION
  // Se ejecuta en el navegador
  console.log('Esto se ejecuta en el cliente');
</script>
```

### Hidratación Selectiva
```astro
---
import InteractiveComponent from './InteractiveComponent.jsx';
---

<!-- Estático por defecto (mejor performance) -->
<InteractiveComponent />

<!-- Con hidratación cuando sea visible -->
<InteractiveComponent client:visible />

<!-- Con hidratación inmediata -->
<InteractiveComponent client:load />

<!-- Con hidratación cuando el usuario interactúe -->
<InteractiveComponent client:idle />
```

## 📁 Organización de Archivos

```
src/
├── components/          # Componentes reutilizables
│   ├── Footer.astro
│   └── Navigation.astro
├── data/               # Configuración y datos estáticos
│   └── socialLinks.ts
├── utils/              # Funciones helper y utilidades
│   ├── formatters.ts
│   └── validators.ts
├── types/              # Definiciones de tipos TypeScript
│   └── index.ts
└── layouts/            # Layouts de página
    └── BaseLayout.astro
```

## 🎯 Mejores Prácticas

### 1. Naming Conventions
```typescript
// ✅ Descriptivo y claro
function getSocialLink(platform: SocialPlatform): string

// ❌ Muy genérico
function getLink(data: any): string
```

### 2. Error Handling
```typescript
// ✅ Con validación
export function getSocialLinkByName(platformName: string): string {
  const platform = socialLinks.find(social => social.name === platformName);
  
  if (!platform) {
    throw new Error(`Plataforma "${platformName}" no encontrada`);
  }
  
  return getSocialLink(platform);
}

// ❌ Sin validación
export function getSocialLinkByName(platformName: string): string {
  const platform = socialLinks.find(social => social.name === platformName);
  return getSocialLink(platform!); // ⚠️ Peligroso!
}
```

### 3. Documentación JSDoc
```typescript
/**
 * Construye la URL completa de una red social
 * 
 * @param platform - El objeto SocialPlatform que contiene url y username
 * @returns La URL completa para acceder al perfil del usuario
 * @throws Error si platform es null o undefined
 * 
 * @example
 * ```typescript
 * const githubUrl = getSocialLink({
 *   name: "GitHub",
 *   url: "https://github.com",
 *   username: "RphFede"
 * });
 * console.log(githubUrl); // "https://github.com/RphFede"
 * ```
 */
export function getSocialLink(platform: SocialPlatform): string {
  return `${platform.url}/${platform.username}`;
}
```

## 🔄 Próximos Pasos

1. **Experimenta** modificando los helpers existentes
2. **Crea** nuevos helpers para otras funcionalidades
3. **Agrega** tests para validar el comportamiento
4. **Explora** más características de Astro como:
   - Content Collections
   - API Routes
   - Middleware
   - View Transitions

¡Feliz coding! 🚀