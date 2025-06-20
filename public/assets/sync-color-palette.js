#!/usr/bin/env node

/**
 * Script de Sincronización de Paleta de Colores
 * Verifica y sincroniza color-palette.jsonc con color-palette.css
 * 
 * Uso:
 * node sync-color-palette.js [--fix]
 * 
 * Opciones:
 * --fix    Regenera automáticamente el CSS si hay diferencias
 * 
 * Este script compara ambos archivos y reporta cualquier diferencia.
 * Si se usa --fix, regenera automáticamente el CSS desde el JSONC.
 */

const fs = require('fs');
const path = require('path');
const { generateCSS, readJSONC } = require('./generate-color-palette.js');

// Rutas de archivos
const JSONC_FILE = path.join(__dirname, 'color-palette.jsonc');
const CSS_FILE = path.join(__dirname, 'color-palette.css');

/**
 * Función para extraer variables CSS del archivo
 */
function extractCSSVariables(cssContent) {
  const variables = new Map();
  
  // Buscar todas las variables CSS (--variable: value;)
  const variableRegex = /--([\w-]+):\s*([^;]+);/g;
  let match;
  
  while ((match = variableRegex.exec(cssContent)) !== null) {
    const [, name, value] = match;
    // Solo incluir variables de color (que empiecen con 'color-' o sean colores hex)
    if (name.startsWith('color-') || value.trim().startsWith('#')) {
      variables.set(name, value.trim());
    }
  }
  
  return variables;
}

/**
 * Función para extraer colores del JSONC
 */
function extractJSONCColors(colorData) {
  const colors = new Map();
  
  if (colorData.spectrum) {
    Object.values(colorData.spectrum).forEach(category => {
      if (category.colors) {
        category.colors.forEach(color => {
          colors.set(`color-${color.name}`, color.hex);
        });
      }
    });
  }
  
  return colors;
}

/**
 * Función para comparar las dos fuentes de colores
 */
function compareColorSources() {
  const issues = [];
  
  // Verificar que ambos archivos existan
  if (!fs.existsSync(JSONC_FILE)) {
    issues.push({
      type: 'error',
      message: 'No se encontró el archivo color-palette.jsonc'
    });
    return issues;
  }
  
  if (!fs.existsSync(CSS_FILE)) {
    issues.push({
      type: 'warning',
      message: 'No se encontró el archivo color-palette.css (se puede generar automáticamente)'
    });
    return issues;
  }
  
  try {
    // Leer ambos archivos
    const colorData = readJSONC(JSONC_FILE);
    const cssContent = fs.readFileSync(CSS_FILE, 'utf8');
    
    // Extraer colores de ambas fuentes
    const jsoncColors = extractJSONCColors(colorData);
    const cssVariables = extractCSSVariables(cssContent);
    
    // Verificar colores que están en JSONC pero no en CSS
    jsoncColors.forEach((hex, name) => {
      if (!cssVariables.has(name)) {
        issues.push({
          type: 'missing_in_css',
          message: `Color '${name}' (${hex}) está en JSONC pero no en CSS`,
          color: name,
          value: hex
        });
      } else if (cssVariables.get(name) !== hex) {
        issues.push({
          type: 'value_mismatch',
          message: `Color '${name}' tiene valores diferentes: JSONC='${hex}', CSS='${cssVariables.get(name)}'`,
          color: name,
          jsoncValue: hex,
          cssValue: cssVariables.get(name)
        });
      }
    });
    
    // Verificar variables CSS que no están en JSONC
    cssVariables.forEach((value, name) => {
      if (name.startsWith('color-') && !jsoncColors.has(name)) {
        issues.push({
          type: 'extra_in_css',
          message: `Variable CSS '${name}' (${value}) no está definida en JSONC`,
          color: name,
          value: value
        });
      }
    });
    
    // Verificar fecha de modificación
    const jsoncStats = fs.statSync(JSONC_FILE);
    const cssStats = fs.statSync(CSS_FILE);
    
    if (jsoncStats.mtime > cssStats.mtime) {
      issues.push({
        type: 'outdated',
        message: 'El archivo CSS es más antiguo que el JSONC (posiblemente desactualizado)',
        jsoncDate: jsoncStats.mtime.toISOString(),
        cssDate: cssStats.mtime.toISOString()
      });
    }
    
  } catch (error) {
    issues.push({
      type: 'error',
      message: `Error al procesar archivos: ${error.message}`
    });
  }
  
  return issues;
}

/**
 * Función para mostrar el reporte de sincronización
 */
function showSyncReport(issues) {
  console.log('🔍 Reporte de Sincronización de Paleta de Colores');
  console.log('=' .repeat(60));
  
  if (issues.length === 0) {
    console.log('✅ ¡Perfecto! Los archivos están sincronizados.');
    console.log('📊 No se encontraron diferencias entre JSONC y CSS.');
    return true;
  }
  
  // Agrupar issues por tipo
  const grouped = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {});
  
  // Mostrar errores
  if (grouped.error) {
    console.log('\n❌ ERRORES:');
    grouped.error.forEach(issue => {
      console.log(`   ${issue.message}`);
    });
  }
  
  // Mostrar advertencias
  if (grouped.warning) {
    console.log('\n⚠️  ADVERTENCIAS:');
    grouped.warning.forEach(issue => {
      console.log(`   ${issue.message}`);
    });
  }
  
  // Mostrar colores faltantes en CSS
  if (grouped.missing_in_css) {
    console.log('\n🔍 COLORES FALTANTES EN CSS:');
    grouped.missing_in_css.forEach(issue => {
      console.log(`   --${issue.color}: ${issue.value}`);
    });
  }
  
  // Mostrar diferencias de valores
  if (grouped.value_mismatch) {
    console.log('\n🔄 VALORES DIFERENTES:');
    grouped.value_mismatch.forEach(issue => {
      console.log(`   --${issue.color}:`);
      console.log(`     JSONC: ${issue.jsoncValue}`);
      console.log(`     CSS:   ${issue.cssValue}`);
    });
  }
  
  // Mostrar variables extra en CSS
  if (grouped.extra_in_css) {
    console.log('\n➕ VARIABLES EXTRA EN CSS:');
    grouped.extra_in_css.forEach(issue => {
      console.log(`   --${issue.color}: ${issue.value}`);
    });
  }
  
  // Mostrar archivos desactualizados
  if (grouped.outdated) {
    console.log('\n📅 ARCHIVOS DESACTUALIZADOS:');
    grouped.outdated.forEach(issue => {
      console.log(`   ${issue.message}`);
      console.log(`   JSONC: ${new Date(issue.jsoncDate).toLocaleString()}`);
      console.log(`   CSS:   ${new Date(issue.cssDate).toLocaleString()}`);
    });
  }
  
  console.log('\n💡 SUGERENCIA:');
  console.log('   Ejecuta: node sync-color-palette.js --fix');
  console.log('   Para regenerar automáticamente el CSS desde el JSONC.');
  
  return false;
}

/**
 * Función para arreglar automáticamente las diferencias
 */
function fixSynchronization() {
  console.log('🔧 Reparando sincronización...');
  
  try {
    // Verificar que existe el JSONC
    if (!fs.existsSync(JSONC_FILE)) {
      console.error('❌ No se puede reparar: falta el archivo color-palette.jsonc');
      process.exit(1);
    }
    
    // Leer datos del JSONC
    console.log('📖 Leyendo color-palette.jsonc...');
    const colorData = readJSONC(JSONC_FILE);
    
    // Generar nuevo CSS
    console.log('⚙️  Regenerando color-palette.css...');
    const cssContent = generateCSS(colorData);
    
    // Escribir archivo CSS
    fs.writeFileSync(CSS_FILE, cssContent, 'utf8');
    
    console.log('✅ ¡Sincronización completada!');
    console.log('📁 Archivo CSS regenerado exitosamente.');
    
    // Verificar nuevamente
    const newIssues = compareColorSources();
    if (newIssues.length === 0) {
      console.log('🎯 Verificación: Los archivos ahora están sincronizados.');
    } else {
      console.log('⚠️  Advertencia: Aún hay algunas diferencias después de la reparación.');
    }
    
  } catch (error) {
    console.error('❌ Error durante la reparación:', error.message);
    process.exit(1);
  }
}

/**
 * Función principal
 */
function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  
  console.log('🎨 Sincronización de Paleta de Colores');
  console.log('=====================================\n');
  
  if (shouldFix) {
    fixSynchronization();
  } else {
    const issues = compareColorSources();
    const isSync = showSyncReport(issues);
    
    if (!isSync) {
      process.exit(1);
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { compareColorSources, extractCSSVariables, extractJSONCColors };