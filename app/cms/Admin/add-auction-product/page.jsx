"use client";
import { useState } from "react";
import Layout from "../../Components/Layout/Layout";
import { font } from "../../../Components/Font/font";
import {
  PhotoIcon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const AddAuctionProductPage = () => {
  const [productTitle, setProductTitle] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [category, setCategory] = useState("Technology");
  const [vendor, setVendor] = useState("Technology");
  const [collection, setCollection] = useState("");
  const [tags, setTags] = useState("Technology");
  const [sizeOption, setSizeOption] = useState("Size");
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState("");
  const [includedItems, setIncludedItems] = useState("");

  const router = useRouter();

  // Labels for the fields based on category
  const getFieldLabels = () => {
    if (productCategory === "Mouse") {
      return { field1: "Type", field2: "DPI" };
    } else if (productCategory === "Printer") {
      return {
        field1: "Type",
        field2: "Print Quality",
        field3: "Paper Size",
        field4: "Connectivity",
      };
    } else if (productCategory === "Network") {
      return {
        field1: "Device Type",
        field2: "Speed",
        field3: "Ports",
        field4: "Range",
      };
    } else if (productCategory === "Keyboard") {
      return {
        field1: "Switch Type",
        field2: "Connectivity",
        field3: "Layout",
        field4: "Features",
      };
    } else if (
      productCategory === "LCD" ||
      productCategory === "LED" ||
      productCategory === "Monitors"
    ) {
      return {
        field1: "Panel Type",
        field2: "Resolution",
        field3: "Screen Size",
        field4: "Refresh Rate",
      };
    } else if (productCategory === "Drive") {
      return {
        field1: "Drive Type",
        field2: "Interface",
        field3: "Form Factor",
        field4: "Capacity Range",
      };
    } else if (productCategory === "GOAT Product") {
      return {
        field1: "Type",
        field2: "Technology",
        field3: "Features",
        field4: "Eco-Attributes",
      };
    } else if (productCategory === "Tablet") {
      return {
        field1: "Operating System",
        field2: "RAM",
        field3: "Storage",
        field4: "Screen Size",
      };
    } else if (productCategory === "Desktop PC") {
      return {
        field1: "Keyboard Type",
        field2: "RAM",
        field3: "Storage",
        field4: "Screen",
      };
    } else if (productCategory === "Laptop") {
      return {
        field1: "Keyboard",
        field2: "RAM",
        field3: "Storage",
        field4: "Screen Size",
      };
    }
    return {
      field1: "Field 1",
      field2: "Field 2",
      field3: "Field 3",
      field4: "Field 4",
    };
  };

  const handleCategoryChange = (newCategory) => {
    setProductCategory(newCategory);
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folder", "products");

        const response = await fetch(
          "https://api.certifurb.com/api/upload-image",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        if (result.success) {
          const imageUrl = result.data.secure_url || result.data.url;
          if (imageUrl) {
            uploadedUrls.push(imageUrl);
            console.log("Image uploaded successfully:", imageUrl);
          } else {
            console.error("No URL found in response:", result.data);
            alert(`Failed to get URL for ${file.name}`);
          }
        } else {
          console.error("Failed to upload image:", result.message);
          alert(`Failed to upload ${file.name}: ${result.message}`);
        }
      }

      setSelectedImages((prev) => [...prev, ...uploadedUrls]);
      if (uploadedUrls.length > 0) {
        console.log("All images uploaded. Total URLs:", uploadedUrls);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async () => {
    if (!productTitle.trim()) {
      alert("Please enter a product title");
      return;
    }
    if (!regularPrice.trim()) {
      alert("Please enter a regular price");
      return;
    }
    if (!productCategory) {
      alert("Please select a product category");
      return;
    }

    setIsSubmitting(true);

    try {
      const productSpecs = [];

      let formattedUTC = null;
      if (auctionTimer.trim()) {
        // Convert local datetime-local value to UTC string for MySQL
        const localDate = new Date(auctionTimer);
        const utcDate = new Date(
          localDate.getTime() - localDate.getTimezoneOffset() * 60000
        );
        formattedUTC = utcDate.toISOString().slice(0, 19).replace("T", " ");
      }
      const auctionProductData = {
        product_name: productTitle.trim(),
        price: salePrice.trim() || regularPrice.trim(),
        image_url: selectedImages.length > 0 ? selectedImages[0] : null,
        product_specs: productSpecs,
        auction_timer: formattedUTC,
        included_items: includedItems,
      };

      const response = await fetch(
        "https://api.certifurb.com/api/auctionproducts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(auctionProductData),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Auction product added successfully!");
        setProductTitle("");
        setRegularPrice("");
        setSalePrice("");
        setProductCategory("");
        setSelectedImages([]);
        setCategory("Electronics");
        setVendor("Technology");
        setCollection("");
        setTags("Technology");
        setSizeOption("Size");
        setAuctionTimer("");
        router.push("/cms/Admin/auction-products");
      } else {
        alert(`Failed to add auction product: ${result.message}`);
      }
    } catch (error) {
      console.error("Error adding auction product:", error);
      alert("Error adding auction product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className={`${font.className} p-6 bg-gray-50 min-h-screen`}>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="text-blue-600 hover:underline cursor-pointer">
            Home
          </span>
          <span className="mx-2">›</span>
          <span className="text-blue-600 hover:underline cursor-pointer">
            Admin
          </span>
          <span className="mx-2">›</span>
          <span>Add Auction Product</span>
        </div>

        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Add an Auction Product
            </h1>
            <p className="text-gray-600">Orders placed across your store</p>
          </div>
        </div>

        {/* Fixed Action Buttons - Stacked on Right Side */}
        <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 flex flex-col space-y-3 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <button
            onClick={() => {
              setProductTitle("");
              setRegularPrice("");
              setSalePrice("");
              setProductCategory("");
              setSelectedImages([]);
              setCategory("Technology");
              setVendor("Technology");
              setCollection("");
              setTags("Technology");
              setSizeOption("Size");
              setIncludedItems("");
              setAuctionTimer("");
            }}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Discard
          </button>
          <button className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
            Save draft
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? "Publishing..." : "Publish product"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Product Title
              </label>
              <input
                type="text"
                placeholder="Write title here..."
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Product Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={productCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop PC">Desktop PC</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Mouse">Mouse</option>
                  <option value="LCD">LCD</option>
                  <option value="LED">LED</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Printer">Printer</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Drive">Drive</option>
                  <option value="Network">Network</option>
                  <option value="GOAT Product">GOAT Product</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Product Specifications Section */}
            {/* {productCategory && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Specifications
                </h3>

                <div
                  className={`grid grid-cols-1 ${
                    getFieldCount() === 2 ? "md:grid-cols-2" : "md:grid-cols-2"
                  } gap-6`}
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      {getFieldLabels().field1}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={keyboard}
                        onChange={(e) => setKeyboard(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        required
                      >
                        <option value="">
                          Select {getFieldLabels().field1}
                        </option>
                        {getField1Options().map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      {getFieldLabels().field2}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={ram}
                        onChange={(e) => setRam(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        required
                      >
                        <option value="">
                          Select {getFieldLabels().field2}
                        </option>
                        {getField2Options().map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {getFieldCount() > 2 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        {getFieldLabels().field3}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={storage}
                          onChange={(e) => setStorage(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                          required
                        >
                          <option value="">
                            Select {getFieldLabels().field3}
                          </option>
                          {getField3Options().map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {getFieldCount() > 3 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-3">
                        {getFieldLabels().field4}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={screenSize}
                          onChange={(e) => setScreenSize(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                          required
                        >
                          <option value="">
                            Select {getFieldLabels().field4}
                          </option>
                          {getField4Options().map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )} */}

            {/* Technical Specifications Section */}
            <>
            {/* {productCategory && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Technical Specifications
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Model
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Graphics
                    </label>
                    <input
                      type="text"
                      placeholder="Enter graphics information"
                      value={graphics}
                      onChange={(e) => setGraphics(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Weight
                    </label>
                    <input
                      type="text"
                      placeholder="Enter weight (e.g., 2.5kg, 5.5lbs)"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      CPU
                    </label>
                    <input
                      type="text"
                      placeholder="Enter CPU information"
                      value={cpu}
                      onChange={(e) => setCpu(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Resolution
                    </label>
                    <input
                      type="text"
                      placeholder="Enter screen resolution (e.g., 1920x1080)"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Operating System
                    </label>
                    <input
                      type="text"
                      placeholder="Enter OS information"
                      value={os}
                      onChange={(e) => setOs(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Battery
                    </label>
                    <input
                      type="text"
                      placeholder="Enter battery information"
                      value={battery}
                      onChange={(e) => setBattery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Bluetooth
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Bluetooth version/info"
                      value={bluetooth}
                      onChange={(e) => setBluetooth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      WiFi
                    </label>
                    <input
                      type="text"
                      placeholder="Enter WiFi specifications"
                      value={wifi}
                      onChange={(e) => setWifi(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Camera
                    </label>
                    <input
                      type="text"
                      placeholder="Enter camera specifications"
                      value={camera}
                      onChange={(e) => setCamera(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Audio
                    </label>
                    <input
                      type="text"
                      placeholder="Enter audio specifications"
                      value={audio}
                      onChange={(e) => setAudio(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Brand
                    </label>
                    <input
                      type="text"
                      placeholder="Enter brand name"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )} */}
            </>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                What's Included
              </label>

              <div className="border border-gray-300 rounded-t-lg p-3 bg-gray-50 flex items-center space-x-2">
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4l16 16m0 0V8m0 8H8"
                    />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded font-bold">
                  B
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded italic">
                  I
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded underline">
                  U
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded line-through">
                  S
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h8M4 18h16"
                    />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h4M4 18h16"
                    />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                </button>
                <button className="p-1 text-gray-600 hover:bg-gray-200 rounded">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </button>
              </div>

              <textarea
                placeholder="Write a description here..."
                value={includedItems}
                onChange={(e) => setIncludedItems(e.target.value)}
                rows={8}
                className="w-full px-3 py-3 border border-t-0 border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Auction End Date & Time
              </label>
              <input
                type="datetime-local"
                value={auctionTimer}
                onChange={(e) => setAuctionTimer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Set when this auction should end. Leave empty for no time limit.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Display images
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-4">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  {uploading ? "Uploading..." : "Drag your photo here or"}{" "}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Browse from device
                  </label>
                </p>
                {uploading && (
                  <div className="text-sm text-gray-500">
                    Please wait while images are uploading...
                  </div>
                )}
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <h3 className="text-lg font-semibold text-gray-900 p-6 pb-0">
                Inventory
              </h3>

              <div className="flex">
                <div className="w-48 border-r border-gray-200">
                  <nav className="p-4 space-y-1">
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                      <div className="flex items-center justify-center w-5 h-5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Pricing</span>
                    </div>

                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-center w-5 h-5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Restock</span>
                    </div>

                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-center w-5 h-5">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Shipping</span>
                    </div>
                  </nav>
                </div>

                <div className="flex-1 p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Regular price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={regularPrice}
                          onChange={(e) => setRegularPrice(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sale price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={salePrice}
                          onChange={(e) => setSalePrice(e.target.value)}
                          className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddAuctionProductPage;
