export async function generateMetadata({ params }) {
  const { category, brand } = await params;
  
  // Map URL-friendly names to display names
  const categoryDisplayNames = {
    'laptops': 'Laptops',
    'desktops': 'Desktop PCs',
    'monitors': 'Monitors',
    'keyboards': 'Keyboards',
    'mice': 'Mice',
    'tablets': 'Tablets',
    'printers': 'Printers',
    'drives': 'Drives',
    'networks': 'Network Devices',
    'lcds': 'LCD Displays',
    'leds': 'LED Displays',
    'accessories': 'Accessories',
    'components': 'Components'
  };
  
  const categoryDisplayName = categoryDisplayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  const brandDisplayName = brand.charAt(0).toUpperCase() + brand.slice(1);
  
  const title = `${brandDisplayName} ${categoryDisplayName} - Certifurb`;
  const description = `Browse our collection of high-quality ${brandDisplayName} ${categoryDisplayName.toLowerCase()}. Refurbished ${brandDisplayName} ${categoryDisplayName.toLowerCase()} with warranty and competitive prices.`;
  const canonicalUrl = `https://certifurb.com/${category}/${brand}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function CategoryBrandLayout({ children }) {
  return children;
} 