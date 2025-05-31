
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  type: string | null;
  sugar_content: string | null;
  net_volume: string | null;
  brand: string | null;
}

interface NutritionInfo {
  energy_kj: number | null;
  energy_kcal: number | null;
  fat: number | null;
  saturates: number | null;
  carbohydrate: number | null;
  sugars: number | null;
  protein: number | null;
  salt: number | null;
}

interface FoodBusinessOperator {
  name: string | null;
}

interface Ingredient {
  name: string;
  category: string;
}

const ProductPreview = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [nutrition, setNutrition] = useState<NutritionInfo | null>(null);
  const [fbo, setFbo] = useState<FoodBusinessOperator | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;

      try {
        // Fetch product basic info
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) {
          console.error('Error fetching product:', productError);
          toast.error('Failed to fetch product');
          return;
        }

        setProduct(productData);

        // Fetch nutrition info
        const { data: nutritionData, error: nutritionError } = await supabase
          .from('nutrition_info')
          .select('*')
          .eq('product_id', id)
          .maybeSingle();

        if (nutritionError) {
          console.error('Error fetching nutrition:', nutritionError);
        } else {
          setNutrition(nutritionData);
        }

        // Fetch food business operator
        const { data: fboData, error: fboError } = await supabase
          .from('food_business_operator')
          .select('*')
          .eq('product_id', id)
          .maybeSingle();

        if (fboError) {
          console.error('Error fetching FBO:', fboError);
        } else {
          setFbo(fboData);
        }

        // Fetch ingredients
        const { data: ingredientsData, error: ingredientsError } = await supabase
          .from('product_ingredients')
          .select(`
            ingredients (
              name,
              category
            )
          `)
          .eq('product_id', id)
          .order('order_number');

        if (ingredientsError) {
          console.error('Error fetching ingredients:', ingredientsError);
        } else {
          const formattedIngredients = ingredientsData
            .map(item => item.ingredients)
            .filter(Boolean) as Ingredient[];
          setIngredients(formattedIngredients);
        }

      } catch (error) {
        console.error('Error fetching product data:', error);
        toast.error('Failed to fetch product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

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
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Product Preview</h1>
          <p className="text-lg text-gray-600">How customers will see this product</p>
        </div>

        {/* Preview Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h2>
            <div className="flex justify-center space-x-4 text-lg text-gray-600">
              {product.type && <span>{product.type}</span>}
              {product.type && product.sugar_content && <span>•</span>}
              {product.sugar_content && <span>{product.sugar_content}</span>}
              {(product.type || product.sugar_content) && product.net_volume && <span>•</span>}
              {product.net_volume && <span>{product.net_volume}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Nutrition Declaration</h3>
              <div className="text-right text-sm text-gray-600 mb-2">Nutritions per 100 ml</div>
              
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-1">
                  <span className="font-medium">Energy</span>
                  <div className="text-right">
                    <div>{nutrition?.energy_kj || 0} kJ</div>
                    <div>{nutrition?.energy_kcal || 0} kcal</div>
                  </div>
                </div>
                
                <div className="flex justify-between border-b pb-1">
                  <span className="font-medium">Fat</span>
                  <span>{nutrition?.fat || 0} g</span>
                </div>
                
                <div className="flex justify-between border-b pb-1 pl-4">
                  <span className="italic">of which Saturates</span>
                  <span>{nutrition?.saturates || 0} g</span>
                </div>
                
                <div className="flex justify-between border-b pb-1">
                  <span className="font-medium">Carbohydrate</span>
                  <span>{nutrition?.carbohydrate || 0} g</span>
                </div>
                
                <div className="flex justify-between border-b pb-1 pl-4">
                  <span className="italic">of which Sugars</span>
                  <span>{nutrition?.sugars || 0} g</span>
                </div>
                
                <div className="flex justify-between border-b pb-1">
                  <span className="font-medium">Protein</span>
                  <span>{nutrition?.protein || 0} g</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Salt</span>
                  <span>{nutrition?.salt || 0} g</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Food Business Operator</h4>
                <p>{fbo?.name || "My Winery"}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Ingredients</h4>
                {ingredients.length > 0 ? (
                  <p>
                    {ingredients.map((ingredient, index) => (
                      <span key={index}>
                        {ingredient.name} ({ingredient.category})
                        {index < ingredients.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p>No ingredients listed</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-gray-500">Electronic label provided by Open E-Label. Web Accessibility Guidelines.</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Link to="/products">
            <Button variant="link" className="text-blue-600">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPreview;
