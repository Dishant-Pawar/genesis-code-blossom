import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProductData {
  id: string;
  name: string;
  brand: string;
  net_volume: string;
  vintage: string;
  type: string;
  sugar_content: string;
  alcohol: string;
  sku_code: string;
  appellations?: {
    name: string;
  };
}

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchProduct();
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          appellations (
            name
          )
        `)
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to fetch product');
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">Loading product...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">Product not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Product</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Product Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name</span>
                  <p className="text-gray-900">{product.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Title</span>
                  <p className="text-gray-900">{product.name} {product.vintage}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Brand</span>
                  <p className="text-gray-900">{product.brand || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Net volume</span>
                  <p className="text-gray-900">{product.net_volume} l</p>
                </div>
              </div>
            </div>

            {/* Wine Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Wine</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Vintage</span>
                  <p className="text-gray-900">{product.vintage}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type</span>
                  <p className="text-gray-900">{product.type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Sugar content</span>
                  <p className="text-gray-900">{product.sugar_content}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Appellation</span>
                  <p className="text-gray-900">{product.appellations?.name || "-"}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Alcohol</span>
                  <p className="text-gray-900">{product.alcohol || "-"}</p>
                </div>
              </div>
            </div>

            {/* Nutrition Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Nutrition information</h3>
              <div className="text-right text-sm text-gray-600 mb-4">Nutritions per 100 ml</div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Energy</span>
                  <div className="text-right">
                    <div>0 kJ</div>
                    <div>0 kcal</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Fat</span>
                  <span>0 g</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span className="italic">of which Saturates</span>
                  <span>0 g</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Carbohydrate</span>
                  <span>0 g</span>
                </div>
                <div className="flex justify-between pl-4">
                  <span className="italic">of which Sugars</span>
                  <span>0 g</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Protein</span>
                  <span>0 g</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Salt</span>
                  <span>0 g</span>
                </div>
              </div>
            </div>

            {/* Food Business Operator */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Food Business Operator</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Type</span>
                  <p className="text-gray-900">(no title)</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Name</span>
                  <p className="text-gray-900">My Winery</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Address</span>
                  <p className="text-gray-900">-</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Additional information</span>
                  <p className="text-gray-900">-</p>
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Logistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Country of origin</span>
                  <p className="text-gray-900">-</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">SKU Code</span>
                  <p className="text-gray-900">-</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">EAN/GTIN</span>
                  <p className="text-gray-900">-</p>
                </div>
              </div>
            </div>

            {/* Portability */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Portability</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">External short link</span>
                  <p className="text-gray-900">-</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Redirect link</span>
                  <p className="text-gray-900">-</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">QR Code</h3>
              
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-sm text-gray-700">Label public link</span>
                  <p className="text-blue-600 text-sm break-all">
                    http://localhost:5206/l/6ea57bd6-5245-4160-b364-035b7794e52f
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    This is the link that is encoded in the QR code.
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="w-32 h-32 border-2 border-gray-300 flex items-center justify-center bg-gray-50">
                    {/* QR Code placeholder */}
                    <div className="w-24 h-24 bg-black"></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Download SVG</Button>
                  <Button variant="outline" size="sm">Download PNG</Button>
                  <Button variant="outline" size="sm">Download JPEG</Button>
                </div>
              </div>
            </div>

            {/* Audit Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Audit</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Created on</span>
                  <p className="text-gray-900">5/28/2025 4:32:35 PM</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created by</span>
                  <p className="text-gray-900">Admin</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Updated on</span>
                  <p className="text-gray-900">5/28/2025 4:32:35 PM</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Updated by</span>
                  <p className="text-gray-900">Admin</p>
                </div>
              </div>
            </div>

            {/* Action Links */}
            <div className="space-y-2 text-sm">
              <div className="flex flex-wrap gap-2">
                <Link to={`/products/${id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                <span>|</span>
                <Link to={`/products/${id}/change-image`} className="text-blue-600 hover:underline">Change image</Link>
                <span>|</span>
                <button className="text-blue-600 hover:underline">Delete</button>
                <span>|</span>
                <button className="text-blue-600 hover:underline">Duplicate</button>
                <span>|</span>
                <Link to="/products" className="text-blue-600 hover:underline">Back to List</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
