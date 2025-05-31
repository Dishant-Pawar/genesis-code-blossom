
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  e_number: string | null;
  allergen: string | null;
  created_at: string;
  updated_at: string;
}

const IngredientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredient = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching ingredient:', error);
          toast.error('Failed to fetch ingredient');
          navigate('/ingredients');
          return;
        }

        setIngredient(data);
      } catch (error) {
        console.error('Error fetching ingredient:', error);
        toast.error('Failed to fetch ingredient');
        navigate('/ingredients');
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">Loading ingredient...</div>
        </div>
      </Layout>
    );
  }

  if (!ingredient) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">Ingredient not found</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Ingredient Details</h1>
          <p className="text-lg text-gray-600">{ingredient.name}</p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Ingredient Name</h3>
                  <p className="text-gray-600">{ingredient.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Category</h3>
                  <p className="text-gray-600">{ingredient.category}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">E Number</h3>
                  <p className="text-gray-600">{ingredient.e_number || "-"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Allergen</h3>
                  <p className="text-gray-600">{ingredient.allergen || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t mt-8">
          <Button
            variant="link"
            onClick={() => navigate("/ingredients")}
            className="text-blue-600"
          >
            Back to List
          </Button>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/ingredients/${id}/edit`)}
              className="text-blue-600 border-blue-600"
            >
              Edit Ingredient
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IngredientDetails;
