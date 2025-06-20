#!/usr/bin/env node

/**
 * Script de Generación de Paleta de Colores
 * Convierte color-palette.jsonc a color-palette.css automáticamente
 * 
 * Uso:
 * node generate-color-palette.js
 * 
 * Este script lee el archivo color-palette.jsonc y genera automáticamente
 * el archivo color-palette.css con todas las variables CSS correspondientes.
 */

const fs = require('fs');
const path = require('path');

// Rutas de archivos
const JSONC_FILE = path.join(__dirname, 'color-palette.jsonc');
const CSS_FILE = path.join(__dirname, 'color-palette.css');

/**
 * Función para leer y parsear el archivo JSONC
 * Elimina comentarios y parsea como JSON
 */
function readJSONC(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Eliminar comentarios de línea (//)
    const withoutLineComments = content.replace(/\/\/.*$/gm, '');
    // Eliminar comentarios de bloque (/* */)
    const withoutBlockComments = withoutLineComments.replace(/\/\*[\s\S]*?\*\//g, '');
    // Eliminar comas finales
    const withoutTrailingCommas = withoutBlockComments.replace(/,\s*([}\]])/g, '$1');
    
    return JSON.parse(withoutTrailingCommas);
  } catch (error) {
    console.error('❌ Error al leer el archivo JSONC:', error.message);
    process.exit(1);
  }
}

/**
 * Función para generar el contenido CSS
 */
function generateCSS(colorData) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  let css = `/* ==========================================================================
   PALETA DE COLORES - VARIABLES CSS
   Generado automáticamente desde color-palette.jsonc
   Fecha de generación: ${timestamp}
   ========================================================================== */

:root {
`;

  // Generar variables por espectro
  const spectrum = colorData.spectrum;
  
  if (spectrum.reds) {
    css += `  /* ==========================================================================
     ROJOS
     ========================================================================== */
`;
    spectrum.reds.colors.forEach(color => {
      css += `  --color-${color.name}: ${color.hex};
`;
    });
    css += `
`;
  }

  if (spectrum.oranges) {
    css += `  /* ==========================================================================
     NARANJAS
     ========================================================================== */
`;
    spectrum.oranges.colors.forEach(color => {
      css += `  --color-${color.name}: ${color.hex};
`;
    });
    css += `
`;
  }

  if (spectrum.yellows) {
    css += `  /* ==========================================================================
     AMARILLOS
     ========================================================================== */
`;
    spectrum.yellows.colors.forEach(color => {
      css += `  --color-${color.name}: ${color.hex};
`;
    });
    css += `
`;
  }

  if (spectrum.greens) {
    css += `  /* ==========================================================================
     VERDES
     ========================================================================== */
`;
    spectrum.greens.colors.forEach(color => {
      css += `  --color-${color.name}: ${color.hex};
`;
    });
    css += `
`;
  }

  if (spectrum.blues) {
    css += `  /* ==========================================================================
     AZULES
     ========================================================================== */
`;
    spectrum.blues.colors.forEach(color => {
      css += `  --color-${color.name}: ${color.hex};
`;
    });
    css += `
`;
  }

  if (spectrum.purples) {
    css += `  /* ==========================================================================
     VIOLETAS Y PÚRPURAS
     ========================================================================== */
`;
    spectrum.purples.colors.forEach(color => {
      css += `  --color-${color.name}: ${color.hex};
`;
    });
    css += `
`;
  }

  if (spectrum.neutrals) {
    css += `  /* ==========================================================================
     GRISES Y NEUTROS
     ========================================================================== */
`;
    spectrum.neutrals.colors.forEach(color => {
      css += `  --color-${color.name}: ${color.hex};
`;
    });
    css += `
`;
  }

  // Agregar aliases semánticos
  css += `  /* ==========================================================================
     ALIASES SEMÁNTICOS
     Variables con nombres más descriptivos para casos de uso específicos
     ========================================================================== */
  
  /* Colores de texto */
  --text-primary: var(--color-gris-9);
  --text-secondary: var(--color-gris-7);
  --text-muted: var(--color-gris-5);
  --text-light: var(--color-gris-3);
  --text-inverse: var(--color-blanco);

  /* Colores de fondo */
  --bg-primary: var(--color-blanco);
  --bg-secondary: var(--color-gris-1);
  --bg-muted: var(--color-gris-2);
  --bg-dark: var(--color-gris-9);
  --bg-darker: var(--color-gris-10);

  /* Colores de acento */
  --accent-primary: var(--color-azul-3);
  --accent-secondary: var(--color-violeta-3);
  --accent-success: var(--color-verde-3);
  --accent-warning: var(--color-amarillo-1);
  --accent-error: var(--color-rojo-1);
  --accent-info: var(--color-azul-1);

  /* Colores de borde */
  --border-light: var(--color-gris-3);
  --border-medium: var(--color-gris-4);
  --border-dark: var(--color-gris-6);

  /* Gradientes comunes */
  --gradient-primary: linear-gradient(135deg, var(--color-azul-3), var(--color-violeta-3));
  --gradient-warm: linear-gradient(135deg, var(--color-naranja-1), var(--color-rosa-1));
  --gradient-cool: linear-gradient(135deg, var(--color-azul-1), var(--color-verde-2));
}

/* ==========================================================================
   UTILIDADES DE COLOR
   Clases auxiliares para aplicar colores rápidamente
   ========================================================================== */

/* Colores de texto */
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-muted { color: var(--text-muted); }
.text-light { color: var(--text-light); }
.text-inverse { color: var(--text-inverse); }

/* Colores de fondo */
.bg-primary { background-color: var(--bg-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.bg-muted { background-color: var(--bg-muted); }
.bg-dark { background-color: var(--bg-dark); }
.bg-darker { background-color: var(--bg-darker); }

/* Colores de acento */
.accent-primary { color: var(--accent-primary); }
.accent-secondary { color: var(--accent-secondary); }
.accent-success { color: var(--accent-success); }
.accent-warning { color: var(--accent-warning); }
.accent-error { color: var(--accent-error); }
.accent-info { color: var(--accent-info); }

/* Fondos de acento */
.bg-accent-primary { background-color: var(--accent-primary); }
.bg-accent-secondary { background-color: var(--accent-secondary); }
.bg-accent-success { background-color: var(--accent-success); }
.bg-accent-warning { background-color: var(--accent-warning); }
.bg-accent-error { background-color: var(--accent-error); }
.bg-accent-info { background-color: var(--accent-info); }

/* Bordes */
.border-light { border-color: var(--border-light); }
.border-medium { border-color: var(--border-medium); }
.border-dark { border-color: var(--border-dark); }

/* ==========================================================================
   MODO OSCURO
   Variables alternativas para tema oscuro
   ========================================================================== */

@media (prefers-color-scheme: dark) {
  :root {
    /* Invertir colores de texto y fondo para modo oscuro */
    --text-primary: var(--color-gris-1);
    --text-secondary: var(--color-gris-3);
    --text-muted: var(--color-gris-4);
    --text-light: var(--color-gris-5);
    --text-inverse: var(--color-gris-9);

    --bg-primary: var(--color-gris-10);
    --bg-secondary: var(--color-gris-9);
    --bg-muted: var(--color-gris-8);
    --bg-dark: var(--color-gris-1);
    --bg-darker: var(--color-blanco);

    --border-light: var(--color-gris-7);
    --border-medium: var(--color-gris-6);
    --border-dark: var(--color-gris-4);
  }
}

/* Clase para forzar modo oscuro */
.dark-theme {
  --text-primary: var(--color-gris-1);
  --text-secondary: var(--color-gris-3);
  --text-muted: var(--color-gris-4);
  --text-light: var(--color-gris-5);
  --text-inverse: var(--color-gris-9);

  --bg-primary: var(--color-gris-10);
  --bg-secondary: var(--color-gris-9);
  --bg-muted: var(--color-gris-8);
  --bg-dark: var(--color-gris-1);
  --bg-darker: var(--color-blanco);

  --border-light: var(--color-gris-7);
  --border-medium: var(--color-gris-6);
  --border-dark: var(--color-gris-4);
}

/* ==========================================================================
   ARCHIVO GENERADO AUTOMÁTICAMENTE
   
   ⚠️  NO EDITAR MANUALMENTE
   Este archivo se genera automáticamente desde color-palette.jsonc
   
   Para modificar colores:
   1. Edita color-palette.jsonc
   2. Ejecuta: node generate-color-palette.js
   
   ========================================================================== */`;

  return css;
}

/**
 * Función principal
 */
function main() {
  console.log('🎨 Generando paleta de colores CSS...');
  
  // Verificar que existe el archivo JSONC
  if (!fs.existsSync(JSONC_FILE)) {
    console.error('❌ No se encontró el archivo color-palette.jsonc');
    process.exit(1);
  }
  
  // Leer datos del JSONC
  console.log('📖 Leyendo color-palette.jsonc...');
  const colorData = readJSONC(JSONC_FILE);
  
  // Generar CSS
  console.log('⚙️  Generando variables CSS...');
  const cssContent = generateCSS(colorData);
  
  // Escribir archivo CSS
  console.log('💾 Escribiendo color-palette.css...');
  fs.writeFileSync(CSS_FILE, cssContent, 'utf8');
  
  console.log('✅ ¡Paleta de colores CSS generada exitosamente!');
  console.log(`📁 Archivo creado: ${CSS_FILE}`);
  
  // Mostrar estadísticas
  const totalColors = Object.values(colorData.spectrum)
    .reduce((total, category) => total + (category.colors ? category.colors.length : 0), 0);
  
  console.log(`📊 Total de colores procesados: ${totalColors}`);
  console.log('🎯 Para usar en tu proyecto, importa el archivo CSS generado.');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { generateCSS, readJSONC };