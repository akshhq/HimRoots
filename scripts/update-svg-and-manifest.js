import fs from 'fs';

// 1. Generate clean SVG favicon embedding the authentic Himroots logo
const b64 = fs.readFileSync('public/android-chrome-192x192.png').toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <image href="data:image/png;base64,${b64}" width="192" height="192" preserveAspectRatio="xMidYMid meet" />
</svg>
`;
fs.writeFileSync('public/favicon.svg', svg);
console.log('✅ public/favicon.svg updated with Himroots brand logo');

// 2. Generate standard site.webmanifest
const manifest = {
  name: "Himroots Wellness",
  short_name: "Himroots",
  description: "Pure, natural, wild-foraged Himalayan Sea Buckthorn juice and wellness.",
  start_url: "/",
  display: "standalone",
  background_color: "#120e0b",
  theme_color: "#120e0b",
  icons: [
    {
      src: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png"
    },
    {
      src: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png"
    },
    {
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    },
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ]
};

fs.writeFileSync('public/site.webmanifest', JSON.stringify(manifest, null, 2));
console.log('✅ public/site.webmanifest created');
