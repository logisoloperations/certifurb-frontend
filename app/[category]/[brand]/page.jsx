'use client';

import React, { useState, useEffect } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { font } from '../../Components/Font/font';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatPrice } from '../../utils/priceFormatter';
import Navbar from '../../Components/Layout/Navbar';
import Footer from '../../Components/Layout/Footer';
import { useFavorites } from '../../context/FavoritesContext';
import { useCurrency } from '../../context/CurrencyContext';

const PRICE_MIN_PKR = 500;
const PRICE_MAX_PKR = 500000;

const CategoryBrandPage = () => {
  const params = useParams();
  const { category: categoryParam, brand: brandParam } = params;
  
  const { toggleFavorite, isFavorite } = useFavorites();
  const { convertPriceString, getCurrentCurrency, selectedCountry } = useCurrency();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceMin, setPriceMin] = useState(PRICE_MIN_PKR);
  const [priceMax, setPriceMax] = useState(PRICE_MAX_PKR);
  const [visibleCount, setVisibleCount] = useState(12);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');

  // Category-specific filters
  const [selectedProcessors, setSelectedProcessors] = useState([]);
  const [selectedScreenSizes, setSelectedScreenSizes] = useState([]);
  const [selectedResolutions, setSelectedResolutions] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedRam, setSelectedRam] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedConnections, setSelectedConnections] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Determine the category and brand from URL
  useEffect(() => {
    // Map URL-friendly names to database category names
    const categoryMapping = {
      'laptops': 'Laptop',
      'desktops': 'Desktop PC',
      'monitors': 'Monitors',
      'keyboards': 'Keyboard',
      'mice': 'Mouse',
      'tablets': 'Tablet',
      'printers': 'Printer',
      'drives': 'Drive',
      'networks': 'Network',
      'lcds': 'LCD',
      'leds': 'LED',
      'accessories': 'Accessories',
      'components': 'Components'
    };
    
    const dbCategory = categoryMapping[categoryParam] || categoryParam;
    setCategory(dbCategory);
    setBrand(brandParam);
  }, [categoryParam, brandParam]);

  // Reset all filters when component mounts or category/brand changes
  useEffect(() => {
    setPriceMin(PRICE_MIN_PKR);
    setPriceMax(PRICE_MAX_PKR);
    setSelectedProcessors([]);
    setSelectedScreenSizes([]);
    setSelectedResolutions([]);
    setSelectedStorage([]);
    setSelectedRam([]);
    setSelectedBrands([]);
    setSelectedConnections([]);
    setSelectedTypes([]);
  }, [category, brand]);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      if (!category || !brand) return;

      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        queryParams.append('category', category);
        queryParams.append('brand', brand);

        const response = await fetch(`https://api.certifurb.com/api/products?${queryParams}`);
        console.log('API Response status:', response.status);
        const data = await response.json();
        console.log('API Response data:', data);

        if (data.success) {
          console.log('Raw products from database:', data.data);
          console.log('Number of products received:', data.data.length);

          // Map database fields to card structure
          const mappedProducts = data.data.map(product => {
            console.log('Mapping product:', product);
            return {
              id: product.ProductID,
              name: product.ProductName,
              specs: product.ProductDesc || 'High-quality refurbished product',
              price: `PKR ${product.ProductPrice}`, // Store as PKR for conversion
              discount: '45% vs. new', // You can calculate this based on your logic
              image: product.ProductImageURL || '/laptop.png',
              category: product.ProductCategory,
              brand: product.ProductBrand,
              storage: product.ProductStorage,
              ram: product.ProductRam,
              keyboard: product.ProductKeyboard,
              screenSize: product.ProductScreenSize
            };
          });
          console.log('Mapped products:', mappedProducts);
          setProducts(mappedProducts);
        } else {
          console.error('API returned error:', data);
          setError(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, brand]);

  const handleSliderChange = (e) => {
    const value = Number(e.target.value);
    const minDifference = 100;
    if (e.target.name === 'min') {
      setPriceMin(Math.min(value, priceMax - minDifference));
    } else {
      setPriceMax(Math.max(value, priceMin + minDifference));
    }
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    const minDifference = 100;
    if (e.target.name === 'min') {
      setPriceMin(Math.max(PRICE_MIN_PKR, Math.min(value, priceMax - minDifference)));
    } else {
      setPriceMax(Math.min(PRICE_MAX_PKR, Math.max(value, priceMin + minDifference)));
    }
  };

  const handleShowMore = () => {
    setVisibleCount(Math.min(products.length, visibleCount + 8));
  };

  const handleShowLess = () => {
    setVisibleCount(12);
  };

  const handleFilterChange = (filterType, value, checked) => {
    const setterMap = {
      processors: setSelectedProcessors,
      screenSizes: setSelectedScreenSizes,
      resolutions: setSelectedResolutions,
      storage: setSelectedStorage,
      ram: setSelectedRam,
      brands: setSelectedBrands,
      connections: setSelectedConnections,
      types: setSelectedTypes,
    };

    const setter = setterMap[filterType];
    if (setter) {
      setter(prev => {
        if (checked) {
          return [...prev, value];
        } else {
          return prev.filter(item => item !== value);
        }
      });
    }
  };

  // Filter products based on all selected filters
  const filteredProducts = products.filter(product => {
    // Price filtering
    const priceNumber = parseFloat(product.price.replace(/[^\d]/g, ''));
    const isInPriceRange = priceNumber >= priceMin && priceNumber <= priceMax;

    // Category and brand filtering (already done by API, but double-check)
    const matchesCategory = product.category?.toLowerCase().includes(category.toLowerCase());
    const matchesBrand = product.brand?.toLowerCase().includes(brand.toLowerCase());

    // Additional filters
    const matchesStorage = selectedStorage.length === 0 ||
      selectedStorage.some(storage => product.storage?.includes(storage));

    const matchesRam = selectedRam.length === 0 ||
      selectedRam.some(ram => product.ram?.includes(ram));

    const matchesScreenSize = selectedScreenSizes.length === 0 ||
      selectedScreenSizes.some(size => product.screenSize?.includes(size));

    const matchesKeyboard = selectedTypes.length === 0 ||
      selectedTypes.some(type => product.keyboard?.includes(type));

    return isInPriceRange && matchesCategory && matchesBrand &&
           matchesStorage && matchesRam && matchesScreenSize && matchesKeyboard;
  });

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  // Get display names
  const getCategoryDisplayName = () => {
    const { category: categoryParam } = params;
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
    return displayNames[categoryParam] || categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
  };

  const getBrandDisplayName = () => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  return (
    <div className={`${font.className} w-full min-h-screen bg-[#fafbfc] flex flex-col items-center`}>
      <Navbar />
      <div className="w-[95%] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 mt-4 lg:mt-6">
        {/* Filters Sidebar - Mobile: top, Desktop: left */}
        <div className="w-full lg:w-[260px] bg-white rounded-xl shadow p-4 flex flex-col gap-4 lg:gap-6 border border-gray-200 lg:h-fit lg:sticky lg:top-8">
          {/* Page Header */}
          <div className="border-b pb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {getBrandDisplayName()} {getCategoryDisplayName()}
            </h1>
            <p className="text-sm text-gray-600">
              {filteredProducts.length} products found
            </p>
            {/* Breadcrumb */}
            <div className="text-xs text-gray-500 mt-2">
              <Link href="/" className="hover:text-green-600">Home</Link>
              <span className="mx-1">›</span>
              <Link href={`/${params.category}`} className="hover:text-green-600">
                {getCategoryDisplayName()}
              </Link>
              <span className="mx-1">›</span>
              <span>{getBrandDisplayName()}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-bold text-md">Price</div>
              <button
                onClick={() => {
                  setPriceMin(PRICE_MIN_PKR);
                  setPriceMax(PRICE_MAX_PKR);
                }}
                className="text-xs text-green-500 hover:text-green-600 font-semibold"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="number"
                name="min"
                value={priceMin}
                min={PRICE_MIN_PKR}
                max={priceMax - 100}
                onChange={handleInputChange}
                className="w-20 px-3 py-1 rounded-lg border border-gray-300 shadow-sm text-xs font-semibold focus:ring-2 focus:ring-green-400 focus:border-green-400 transition outline-none text-center bg-[#f7f7f7]"
                style={{ boxShadow: '0 1px 4px 0 #e5e7eb' }}
              />
              <span className="text-gray-400 font-bold">-</span>
              <input
                type="number"
                name="max"
                value={priceMax}
                min={priceMin + 100}
                max={PRICE_MAX_PKR}
                onChange={handleInputChange}
                className="w-20 px-3 py-1 rounded-lg border border-gray-300 shadow-sm text-xs font-semibold focus:ring-2 focus:ring-green-400 focus:border-green-400 transition outline-none text-center bg-[#f7f7f7]"
                style={{ boxShadow: '0 1px 4px 0 #e5e7eb' }}
              />
            </div>
            <div className="relative h-8 flex items-center">
              <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full" />
              <div
                className="absolute h-1 bg-green-400 rounded-full"
                style={{
                  left: `${((priceMin - PRICE_MIN_PKR) / (PRICE_MAX_PKR - PRICE_MIN_PKR)) * 100}%`,
                  right: `${100 - ((priceMax - PRICE_MIN_PKR) / (PRICE_MAX_PKR - PRICE_MIN_PKR)) * 100}%`,
                }}
              />
              <input
                type="range"
                name="min"
                min={PRICE_MIN_PKR}
                max={PRICE_MAX_PKR - 100}
                value={priceMin}
                onChange={handleSliderChange}
                className="absolute w-full accent-green-500 pointer-events-auto h-1 bg-transparent"
                style={{ zIndex: 1 }}
              />
              <input
                type="range"
                name="max"
                min={PRICE_MIN_PKR + 100}
                max={PRICE_MAX_PKR}
                value={priceMax}
                onChange={handleSliderChange}
                className="absolute w-full accent-green-500 pointer-events-auto h-1 bg-transparent"
                style={{ zIndex: 2 }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
              <span>{PRICE_MIN_PKR.toLocaleString()}</span>
              <span>{PRICE_MAX_PKR.toLocaleString()}</span>
            </div>
          </div>

          {/* Storage Filter */}
          <div>
            <div className="font-bold text-md mb-2">Storage</div>
            <div className="flex flex-col gap-1 text-sm">
              {['128GB', '256GB', '512GB', '1TB', '2TB'].map(storage => (
                <label key={storage} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStorage.includes(storage)}
                    onChange={(e) => handleFilterChange('storage', storage, e.target.checked)}
                  />
                  {storage}
                </label>
              ))}
            </div>
          </div>

          {/* RAM Filter */}
          <div>
            <div className="font-bold text-md mb-2">RAM</div>
            <div className="flex flex-col gap-1 text-sm">
              {['4GB', '8GB', '16GB', '32GB', '64GB'].map(ram => (
                <label key={ram} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedRam.includes(ram)}
                    onChange={(e) => handleFilterChange('ram', ram, e.target.checked)}
                  />
                  {ram}
                </label>
              ))}
            </div>
          </div>

          {/* Screen Size Filter */}
          <div>
            <div className="font-bold text-md mb-2">Screen Size</div>
            <div className="flex flex-col gap-1 text-sm">
              {['13"', '14"', '15.6"', '17"'].map(size => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedScreenSizes.includes(size)}
                    onChange={(e) => handleFilterChange('screenSizes', size, e.target.checked)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* Keyboard Type Filter */}
          <div>
            <div className="font-bold text-md mb-2">Keyboard Type</div>
            <div className="flex flex-col gap-1 text-sm">
              {['English', 'English & Arabic', 'Backlit English', 'Backlit English & Arabic'].map(type => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={(e) => handleFilterChange('types', type, e.target.checked)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="flex-1 flex flex-col items-center">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  No {getBrandDisplayName()} {getCategoryDisplayName().toLowerCase()} found
                </p>
                <Link
                  href={`/${params.category}`}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Browse All {getCategoryDisplayName()}
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayedProducts.map((item, idx) => (
                  <Link key={item.id || idx} href={`/product/${item.id}`}>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                      {/* Product Image */}
                      <div className="relative w-full h-48 mb-4">
                        {/* Discount Badge */}
                        {item.discount && (
                          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-medium py-1 px-2 rounded z-10">
                            {item.discount}
                          </span>
                        )}
                        {/* Wishlist Icon */}
                        <div
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 cursor-pointer z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(item);
                          }}
                        >
                          {isFavorite(item.id) ? (
                            <FaHeart size={16} className="text-red-500" />
                          ) : (
                            <FaRegHeart size={16} />
                          )}
                        </div>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain rounded-lg bg-gray-50"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="space-y-2">
                        {/* Product Title */}
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>

                        {/* Brand and Condition */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-600">
                            Brand New
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-600">
                            {item.brand || 'Certified Brand'}
                          </span>
                        </div>

                        {/* Product Description */}
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.specs}
                        </p>

                        {/* Price */}
                        <div className="text-lg font-bold text-gray-900">
                          {convertPriceString(item.price)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Show More/Less Buttons */}
              {visibleCount < filteredProducts.length && (
                <div className="w-full flex justify-center mt-6 lg:mt-8 mb-4">
                  <button
                    onClick={handleShowMore}
                    className="bg-white border border-green-400 text-green-500 px-6 py-2 rounded-full font-semibold shadow hover:bg-green-50 transition"
                  >
                    Show More Products
                  </button>
                </div>
              )}
              {visibleCount >= filteredProducts.length && filteredProducts.length > 12 && (
                <div className="w-full flex justify-center mt-6 lg:mt-8 mb-4">
                  <button
                    onClick={handleShowLess}
                    className="bg-white border border-green-400 text-green-500 px-6 py-2 rounded-full font-semibold shadow hover:bg-green-50 transition"
                  >
                    Show Less Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-2 mb-8">
        {loading
          ? 'Loading...'
          : `Showing 1-${Math.min(visibleCount, filteredProducts.length)} of ${filteredProducts.length} products`}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryBrandPage; 