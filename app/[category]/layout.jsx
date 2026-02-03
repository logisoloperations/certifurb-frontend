export async function generateMetadata({ params }) {
  const { category } = await params;
  
  // Map URL-friendly names to display names
  const displayNames = {
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
  
  const displayName = displayNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
  const title = `${displayName} - Certifurb`;
  const description = `Browse our collection of high-quality ${displayName.toLowerCase()}. Refurbished ${displayName.toLowerCase()} with warranty and competitive prices.`;
  const canonicalUrl = `https://certifurb.com/${category}`;
  
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

export default function CategoryLayout({ children }) {
  return children;
} 