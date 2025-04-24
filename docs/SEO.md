# VitaSpoon SEO Documentation

Este documento detalla la implementación SEO de VitaSpoon para facilitar el mantenimiento y mejora continua.

## Características SEO implementadas

1. **Meta etiquetas**

   - Title, Description y Keywords optimizados
   - Etiquetas canónicas para evitar contenido duplicado
   - Etiquetas Open Graph para Facebook/redes sociales
   - Etiquetas Twitter Card para Twitter

2. **Datos estructurados (Schema.org)**

   - WebSite: Información general del sitio web
   - Organization: Información sobre VitaSpoon como organización
   - Recipe: Información detallada para recetas (rich snippets)
   - FAQPage: Preguntas frecuentes con marcado estructurado

3. **Favicons**

   - Conjunto completo de favicons para diferentes dispositivos:
     - `/favicon.ico` - Favicon principal (en la raíz del sitio)
     - `/icons/favicon.svg` - Versión vectorial para navegadores modernos
     - `/icons/favicon-96x96.png` - Versión de 96x96 píxeles
     - `/icons/apple-touch-icon.png` - Icono para dispositivos Apple
     - `/icons/web-app-manifest-192x192.png` - Icono para Web App Manifest (192x192)
     - `/icons/web-app-manifest-512x512.png` - Icono para Web App Manifest (512x512)
   - Web App Manifest para PWA (`/site.webmanifest`)
   - Configuración para Microsoft Tiles (`/browserconfig.xml`)

4. **Archivos SEO**
   - robots.txt con directivas para motores de búsqueda
   - sitemap.xml generado automáticamente
   - Integración con Google Analytics/Tag Manager

## Componentes SEO y uso

### Componente SEO

`src/components/seo/SEO.astro` es un componente reutilizable que se puede usar en cualquier página:

```astro
---
import SEO from '../components/seo/SEO.astro';
---
<head>
  <SEO
    title="Título de la página | VitaSpoon"
    description="Descripción detallada y relevante para SEO"
    image="/ruta/a/imagen-social.jpg"
  />
</head>
```

### Componente RecipeSchema

Para páginas de recetas, usar el componente específico para datos estructurados de recetas:

```astro
---
import RecipeSchema from '../components/seo/RecipeSchema.astro';
---
<RecipeSchema
  name="Ensalada mediterránea"
  description="Una refrescante ensalada mediterránea con ingredientes frescos"
  image="/images/ensalada-mediterranea.jpg"
  ingredients={[
    "200g de tomates cherry",
    "1 pepino",
    "100g de queso feta"
  ]}
  instructions={[
    "Lavar y cortar los tomates cherry por la mitad",
    "Pelar y picar el pepino en cubos",
    "Desmenuzar el queso feta"
  ]}
/>
```

### Componente FaqSchema

Para secciones de preguntas frecuentes:

```astro
---
import FaqSchema from '../components/seo/FaqSchema.astro';

const questions = [
  {
    question: "¿Cómo genera VitaSpoon las recetas?",
    answer: "VitaSpoon utiliza inteligencia artificial para crear recetas personalizadas basadas en tus preferencias y restricciones dietéticas."
  },
  {
    question: "¿Puedo guardar mis recetas favoritas?",
    answer: "Sí, puedes guardar todas las recetas que te gusten en tu perfil personal."
  }
];
---
<FaqSchema questions={questions} />
```

## Mejores prácticas

1. **URLs amigables**

   - Usar URLs cortas, descriptivas y con palabras clave relevantes
   - Evitar parámetros de URL innecesarios
   - Ejemplo: `/recetas/ensalada-mediterranea` en lugar de `/recetas?id=123`

2. **Contenido**

   - Cada página debe tener un título H1 único
   - Estructurar el contenido con subtítulos H2, H3, etc.
   - Incluir palabras clave relevantes naturalmente en el texto
   - Crear contenido original, útil y de valor

3. **Imágenes**

   - Siempre incluir atributos alt descriptivos
   - Optimizar el tamaño de las imágenes para carga rápida
   - Usar nombres de archivo descriptivos (ej: `ensalada-mediterranea.jpg`)

4. **Rendimiento**
   - Optimizar tiempo de carga (Core Web Vitals)
   - Implementar carga perezosa para imágenes
   - Minimizar CSS/JS

## Configuración de Analytics

Para configurar Google Analytics/Tag Manager, añadir las siguientes variables en el archivo `.env`:

```
PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
PUBLIC_GOOGLE_SITE_VERIFICATION=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Script de generación de Favicons

Se ha incluido un script para generar automáticamente todos los favicons necesarios a partir del logo de VitaSpoon:

```bash
npm install sharp
node scripts/generate-favicons.js
```
