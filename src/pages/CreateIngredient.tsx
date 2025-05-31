
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateIngredient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "Other ingredient",
    eNumber: "",
    allergen: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Ingredient name is required');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('ingredients')
        .insert({
          name: formData.name.trim(),
          category: formData.category,
          e_number: formData.eNumber.trim() || null,
          allergen: formData.allergen.trim() || null,
        });

      if (error) {
        console.error('Error creating ingredient:', error);
        toast.error('Failed to create ingredient');
        return;
      }

      toast.success('Ingredient created successfully!');
      navigate("/ingredients");
    } catch (error) {
      console.error('Error creating ingredient:', error);
      toast.error('Failed to create ingredient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Create</h1>
          <p className="text-lg text-gray-600">Ingredient</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <SelectItem value="Other ingredient">Other ingredient</SelectItem>
                  <SelectItem value="Antioxidant">Antioxidant</SelectItem>
                  <SelectItem value="Acidity regulator">Acidity regulator</SelectItem>
                  <SelectItem value="Stabiliser">Stabiliser</SelectItem>
                  <SelectItem value="Raw material">Raw material</SelectItem>
                  <SelectItem value="Sweetener">Sweetener</SelectItem>
                  <SelectItem value="Enrichment substance">Enrichment substance</SelectItem>
                  <SelectItem value="Clarifying agent">Clarifying agent</SelectItem>
                  <SelectItem value="Preservative">Preservative</SelectItem>
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
                placeholder="e.g., E300"
              />
            </div>

            <div>
              <Label htmlFor="allergen">Allergen</Label>
              <Input
                id="allergen"
                value={formData.allergen}
                onChange={(e) => handleInputChange("allergen", e.target.value)}
                className="mt-1"
                placeholder="e.g., Gluten, Dairy"
              />
            </div>

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
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateIngredient;
