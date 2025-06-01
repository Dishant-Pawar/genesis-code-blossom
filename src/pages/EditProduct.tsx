import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Ingredient {
  order: number;
  ingredient: string;
}

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [appellations, setAppellations] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    netVolume: "",
    vintage: "",
    type: "",
    sugarContent: "",
    appellation: "",
    alcohol: "",
    ingredients: [] as Ingredient[]
  });

  const [responsibleConsumption, setResponsibleConsumption] = useState({
    pregnancyWarning: false,
    ageWarning: false,
    drivingWarning: false
  });

  const [certifications, setCertifications] = useState({
    organic: false,
    vegetarian: false,
    vegan: false
  });

  // Fetch appellations on component mount
  useEffect(() => {
    fetchAppellations();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchAppellations = async () => {
    try {
      const { data, error } = await supabase
        .from('appellations')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching appellations:', error);
        return;
      }
      
      setAppellations(data || []);
    } catch (error) {
      console.error('Error fetching appellations:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          appellations (
            id,
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

      if (data) {
        setFormData({
          name: data.name || "",
          brand: data.brand || "",
          netVolume: data.net_volume || "",
          vintage: data.vintage || "",
          type: data.type || "",
          sugarContent: data.sugar_content || "",
          appellation: data.appellation_id || "",
          alcohol: data.alcohol || "",
          ingredients: [] // You can fetch ingredients separately if needed
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to fetch product');
    }
  };

  // Available ingredients list
  const availableIngredients = [
    "Aleppo pine resin (Other ingredient)",
    "Aleppo pine resin (Antioxidant)",
    "Ascorbic acid (Antioxidant)",
    "Calcium sulphate (Acidity regulator)",
    "Caramel (Other ingredient)",
    "Carbon dioxide (Raw material)",
    "Carboxymethylcellulose (Stabiliser)",
    "Citric acid (Stabiliser)",
    "Concentrated grape must (Enrichment substance)",
    "Concentrated grape must (Raw material)",
    "Concentrated grape must (Sweetener)",
    "Dimethyldicarbonate (Preservative)",
    "Egg (Clarifying agent)",
    "Egg (Preservative)",
    "Expedition liqueur (Raw material)",
    "Fumaric acid (Stabiliser)",
    "Grapes (Raw material)",
    "Gum arabic (Stabiliser)",
    "Lactic acid (Acidity regulator)",
    "Malic acid (Acidity regulator)",
    "Metatartaric acid (Stabiliser)",
    "Milk (Clarifying agent)",
    "Milk casein (Clarifying agent)",
    "Milk products (Clarifying agent)",
    "Milk protein (Clarifying agent)",
    "Organic grapes (Raw material)",
    "Potassium polyaspartate (Stabiliser)",
    "Potassium sorbate (Preservative)",
    "Sucrose (Enrichment substance)",
    "Sugar (Enrichment substance)",
    "Sugar (Sweetener)",
    "Sulphites (Preservative)",
    "Tartaric acid (Acidity regulator)",
    "Tirage liqueur (Raw material)",
    "Yeast mannoproteins (Stabiliser)"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index].ingredient = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    const newOrder = formData.ingredients.length + 1;
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { order: newOrder, ingredient: "" }]
    }));
  };

  const removeIngredient = (index: number) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    // Reorder ingredients
    const reorderedIngredients = newIngredients.map((ing, i) => ({
      ...ing,
      order: i + 1
    }));
    setFormData(prev => ({ ...prev, ingredients: reorderedIngredients }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) {
      toast.error('Invalid request');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          brand: formData.brand,
          net_volume: formData.netVolume,
          vintage: formData.vintage,
          type: formData.type,
          sugar_content: formData.sugarContent,
          appellation_id: formData.appellation || null,
          alcohol: formData.alcohol,
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating product:', error);
        toast.error('Failed to update product');
        return;
      }

      toast.success('Product updated successfully!');
      navigate("/products");
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Edit</h1>
          <p className="text-lg text-gray-600">Product</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Product Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This is the name of the product as you have it in your bottle, without the vintage.
                  </p>
                </div>

                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Brand, producer or product marketing name.
                  </p>
                </div>

                <div>
                  <Label htmlFor="netVolume">Net volume</Label>
                  <Input
                    id="netVolume"
                    value={formData.netVolume}
                    onChange={(e) => handleInputChange("netVolume", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the volume of the liquid in liters.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wine Details */}
          <Card>
            <CardHeader>
              <CardTitle>Wine Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vintage">Vintage</Label>
                  <Input
                    id="vintage"
                    value={formData.vintage}
                    onChange={(e) => handleInputChange("vintage", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The year that the wine was produced. Do not fill for non-vintage wines.
                  </p>
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Red">Red</SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Rosé">Rosé</SelectItem>
                      <SelectItem value="Sparkling">Sparkling</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Wine classification by vinification process. Sometimes referred as wine 'colour'.
                  </p>
                </div>

                <div>
                  <Label htmlFor="sugarContent">Sugar content</Label>
                  <Select value={formData.sugarContent} onValueChange={(value) => handleInputChange("sugarContent", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brut nature">Brut nature</SelectItem>
                      <SelectItem value="Extra brut">Extra brut</SelectItem>
                      <SelectItem value="Brut">Brut</SelectItem>
                      <SelectItem value="Extra dry">Extra dry</SelectItem>
                      <SelectItem value="Dry">Dry</SelectItem>
                      <SelectItem value="Demi-sec">Demi-sec</SelectItem>
                      <SelectItem value="Sweet">Sweet</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Sugar content of the wine product, according to EU Regulation No 2019/33, ANNEX III.
                  </p>
                </div>

                <div>
                  <Label htmlFor="appellation">Appellation</Label>
                  <Select value={formData.appellation} onValueChange={(value) => handleInputChange("appellation", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select appellation" />
                    </SelectTrigger>
                    <SelectContent>
                      {appellations.map((appellation) => (
                        <SelectItem key={appellation.id} value={appellation.id}>
                          {appellation.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Wine legally defined and protected geographical indication.
                  </p>
                </div>

                <div>
                  <Label htmlFor="alcohol">Alcohol</Label>
                  <Input
                    id="alcohol"
                    value={formData.alcohol}
                    onChange={(e) => handleInputChange("alcohol", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Alcohol on label (% vol.)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 border-b pb-2">
                  <div className="col-span-2">Order</div>
                  <div className="col-span-7">Ingredient</div>
                  <div className="col-span-2">Delete</div>
                </div>
                
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={ingredient.order}
                        className="w-16"
                        readOnly
                      />
                    </div>
                    <div className="col-span-7">
                      <Select 
                        value={ingredient.ingredient} 
                        onValueChange={(value) => handleIngredientChange(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ingredient" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {availableIngredients.map((ing) => (
                            <SelectItem key={ing} value={ing}>
                              {ing}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button type="button" variant="link" onClick={addIngredient} className="text-blue-600">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Responsible Consumption */}
          <Card>
            <CardHeader>
              <CardTitle>Responsible consumption</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox 
                    id="pregnancy" 
                    checked={responsibleConsumption.pregnancyWarning}
                    onCheckedChange={(checked) => 
                      setResponsibleConsumption(prev => ({...prev, pregnancyWarning: !!checked}))
                    }
                  />
                  <div>
                    <Label htmlFor="pregnancy" className="font-medium">Warning against drinking during pregnancy</Label>
                    <p className="text-sm text-gray-500">Don't drink during pregnancy and breastfeeding</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  🚫👶
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox 
                    id="age" 
                    checked={responsibleConsumption.ageWarning}
                    onCheckedChange={(checked) => 
                      setResponsibleConsumption(prev => ({...prev, ageWarning: !!checked}))
                    }
                  />
                  <div>
                    <Label htmlFor="age" className="font-medium">Warning against drinking below legal age</Label>
                    <p className="text-sm text-gray-500">Don't drink when below legal drinking age</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  🚫18
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox 
                    id="driving" 
                    checked={responsibleConsumption.drivingWarning}
                    onCheckedChange={(checked) => 
                      setResponsibleConsumption(prev => ({...prev, drivingWarning: !!checked}))
                    }
                  />
                  <div>
                    <Label htmlFor="driving" className="font-medium">Warning against drinking when driving</Label>
                    <p className="text-sm text-gray-500">Don't drink when driving a car, motorbike or operating machinery</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  🚫🚗
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox 
                    id="organic" 
                    checked={certifications.organic}
                    onCheckedChange={(checked) => 
                      setCertifications(prev => ({...prev, organic: !!checked}))
                    }
                  />
                  <div>
                    <Label htmlFor="organic" className="font-medium">Organic</Label>
                    <p className="text-sm text-gray-500">Certified organic based on EU-Guidelines</p>
                  </div>
                </div>
                <div className="w-16 h-12 bg-green-500 rounded flex items-center justify-center text-white text-xs">
                  ⭐⭐⭐
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox 
                    id="vegetarian" 
                    checked={certifications.vegetarian}
                    onCheckedChange={(checked) => 
                      setCertifications(prev => ({...prev, vegetarian: !!checked}))
                    }
                  />
                  <div>
                    <Label htmlFor="vegetarian" className="font-medium">Vegetarian</Label>
                    <p className="text-sm text-gray-500">Certified Vegetarian by V-Label</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                  V
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox 
                    id="vegan" 
                    checked={certifications.vegan}
                    onCheckedChange={(checked) => 
                      setCertifications(prev => ({...prev, vegan: !!checked}))
                    }
                  />
                  <div>
                    <Label htmlFor="vegan" className="font-medium">Vegan</Label>
                    <p className="text-sm text-gray-500">Certified Vegan by V-Label</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">
                  V
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              type="button"
              variant="link"
              onClick={() => navigate("/products")}
              className="text-blue-600"
            >
              Back to List
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;
