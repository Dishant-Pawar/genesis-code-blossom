
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Ingredient {
  id: string;
  name: string;
  category: string;
  e_number: string | null;
  allergen: string | null;
}

const EditIngredient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Other ingredient",
    eNumber: "",
    allergen: ""
  });

  const categories = [
    "Acidity regulator",
    "Antioxidant",
    "Clarifying agent", 
    "Enrichment substance",
    "Other ingredient",
    "Preservative",
    "Raw material",
    "Stabiliser",
    "Sweetener"
  ];

  // Fetch ingredient data
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

        setFormData({
          name: data.name,
          category: data.category,
          eNumber: data.e_number || "",
          allergen: data.allergen || ""
        });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from('ingredients')
        .update({
          name: formData.name,
          category: formData.category,
          e_number: formData.eNumber || null,
          allergen: formData.allergen || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating ingredient:', error);
        toast.error('Failed to update ingredient');
        return;
      }

      toast.success('Ingredient updated successfully');
      navigate('/ingredients');
    } catch (error) {
      console.error('Error updating ingredient:', error);
      toast.error('Failed to update ingredient');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">Loading ingredient...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Edit</h1>
          <p className="text-lg text-gray-600">Ingredient</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="eNumber">E number</Label>
                  <Input
                    id="eNumber"
                    value={formData.eNumber}
                    onChange={(e) => handleInputChange("eNumber", e.target.value)}
                    className="mt-1"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <Label htmlFor="allergen">Allergen</Label>
                  <Input
                    id="allergen"
                    value={formData.allergen}
                    onChange={(e) => handleInputChange("allergen", e.target.value)}
                    className="mt-1"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/ingredients")}
              className="text-blue-600"
            >
              Back to List
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditIngredient;
