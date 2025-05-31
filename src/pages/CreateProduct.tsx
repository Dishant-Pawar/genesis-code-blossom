
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

const CreateProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<{id: string, ingredient_id: string, order_number: number}[]>([]);
  
  const [formData, setFormData] = useState({
    productName: "",
    netVolume: "",
    vintage: "",
    type: "",
    sugarContent: "",
    appellation: "",
    alcohol: "",
    brand: "",
    businessOperatorType: "",
    businessOperatorName: "My Winery",
    businessOperatorAddress: "",
    additionalInformation: "",
    countryOfOrigin: "",
    skuCode: "",
    eanGtin: "",
    externalShortLink: "",
    redirectLink: "",
    packagingGases: "",
    // Nutrition info
    portion: "100",
    energy: "0",
    fat: "0",
    saturates: "0",
    carbohydrate: "0",
    sugar: "0",
    protein: "0",
    salt: "0",
  });

  const [selectedCertifications, setSelectedCertifications] = useState({
    organic: false,
    vegetarian: false,
    vegan: false
  });

  const [responsibleConsumption, setResponsibleConsumption] = useState({
    pregnancy: true,
    underAge: true,
    driving: true
  });

  // Fetch ingredients on component mount
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching ingredients:', error);
        return;
      }
      
      setIngredients(data || []);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    const newId = Date.now().toString();
    setSelectedIngredients([...selectedIngredients, {
      id: newId,
      ingredient_id: "",
      order_number: selectedIngredients.length + 1
    }]);
  };

  const removeIngredient = (id: string) => {
    setSelectedIngredients(selectedIngredients.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id: string, ingredient_id: string) => {
    setSelectedIngredients(selectedIngredients.map(ing => 
      ing.id === id ? { ...ing, ingredient_id } : ing
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a product');
      return;
    }

    setLoading(true);

    try {
      // Create the main product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          name: formData.productName,
          brand: formData.brand,
          net_volume: formData.netVolume,
          vintage: formData.vintage,
          type: formData.type,
          sugar_content: formData.sugarContent,
          alcohol: formData.alcohol,
          sku_code: formData.skuCode,
          ean_gtin: formData.eanGtin,
          external_short_link: formData.externalShortLink,
          redirect_link: formData.redirectLink,
          country_of_origin: formData.countryOfOrigin,
        })
        .select()
        .single();

      if (productError) {
        console.error('Error creating product:', productError);
        toast.error('Failed to create product');
        return;
      }

      // Create nutrition info
      const { error: nutritionError } = await supabase
        .from('nutrition_info')
        .insert({
          product_id: product.id,
          energy_kcal: parseFloat(formData.energy) || 0,
          energy_kj: (parseFloat(formData.energy) || 0) * 4.184,
          fat: parseFloat(formData.fat) || 0,
          saturates: parseFloat(formData.saturates) || 0,
          carbohydrate: parseFloat(formData.carbohydrate) || 0,
          sugars: parseFloat(formData.sugar) || 0,
          protein: parseFloat(formData.protein) || 0,
          salt: parseFloat(formData.salt) || 0,
        });

      if (nutritionError) {
        console.error('Error creating nutrition info:', nutritionError);
      }

      // Create certifications
      const { error: certError } = await supabase
        .from('certifications')
        .insert({
          product_id: product.id,
          organic: selectedCertifications.organic,
          vegetarian: selectedCertifications.vegetarian,
          vegan: selectedCertifications.vegan,
        });

      if (certError) {
        console.error('Error creating certifications:', certError);
      }

      // Create responsible consumption
      const { error: respError } = await supabase
        .from('responsible_consumption')
        .insert({
          product_id: product.id,
          pregnancy_warning: responsibleConsumption.pregnancy,
          age_warning: responsibleConsumption.underAge,
          driving_warning: responsibleConsumption.driving,
        });

      if (respError) {
        console.error('Error creating responsible consumption:', respError);
      }

      // Create food business operator
      const { error: fboError } = await supabase
        .from('food_business_operator')
        .insert({
          product_id: product.id,
          type: formData.businessOperatorType,
          name: formData.businessOperatorName,
          address: formData.businessOperatorAddress,
          additional_information: formData.additionalInformation,
        });

      if (fboError) {
        console.error('Error creating food business operator:', fboError);
      }

      // Create product ingredients
      if (selectedIngredients.length > 0) {
        const ingredientInserts = selectedIngredients
          .filter(ing => ing.ingredient_id)
          .map(ing => ({
            product_id: product.id,
            ingredient_id: ing.ingredient_id,
            order_number: ing.order_number
          }));

        if (ingredientInserts.length > 0) {
          const { error: ingredientError } = await supabase
            .from('product_ingredients')
            .insert(ingredientInserts);

          if (ingredientError) {
            console.error('Error creating product ingredients:', ingredientError);
          }
        }
      }

      toast.success('Product created successfully!');
      navigate("/products");
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Create</h1>
          <p className="text-lg text-gray-600">Product</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Product Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="productName">Product name</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    className="mt-1"
                    required
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
                      <SelectValue placeholder="(none)" />
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
                      <SelectValue placeholder="(none)" />
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
                  <Input
                    id="appellation"
                    value={formData.appellation}
                    onChange={(e) => handleInputChange("appellation", e.target.value)}
                    className="mt-1"
                  />
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
                {selectedIngredients.map((ingredient, index) => (
                  <div key={ingredient.id} className="flex items-center gap-4">
                    <div className="w-20">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={ingredient.order_number}
                        onChange={(e) => {
                          const newIngredients = [...selectedIngredients];
                          newIngredients[index].order_number = parseInt(e.target.value) || 1;
                          setSelectedIngredients(newIngredients);
                        }}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Ingredient</Label>
                      <Select 
                        value={ingredient.ingredient_id} 
                        onValueChange={(value) => updateIngredient(ingredient.id, value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select ingredient" />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredients.map((ing) => (
                            <SelectItem key={ing.id} value={ing.id}>
                              {ing.name} ({ing.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-20">
                      <Label>Delete</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeIngredient(ingredient.id)}
                        className="mt-1 w-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={addIngredient} variant="link" className="text-blue-600 p-0">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Packaging gases */}
          <Card>
            <CardContent className="pt-6">
              <div>
                <Label htmlFor="packagingGases">Packaging gases</Label>
                <Select value={formData.packagingGases} onValueChange={(value) => handleInputChange("packagingGases", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="(none)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nitrogen">Nitrogen</SelectItem>
                    <SelectItem value="carbon_dioxide">Carbon Dioxide</SelectItem>
                    <SelectItem value="argon">Argon</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  Select an option for bottling atmosphere.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Information */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="portion">Portion</Label>
                  <Input
                    id="portion"
                    value={formData.portion}
                    onChange={(e) => handleInputChange("portion", e.target.value)}
                    className="mt-1"
                    type="number"
                  />
                  <p className="text-sm text-gray-500 mt-1">Volume of a portion (ml)</p>
                </div>

                <div>
                  <Label htmlFor="energy">Energy</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="energy"
                      value={formData.energy}
                      onChange={(e) => handleInputChange("energy", e.target.value)}
                      type="number"
                      step="0.1"
                      placeholder="0"
                    />
                    <Input
                      value={(parseFloat(formData.energy) * 4.184).toFixed(1)}
                      placeholder="(automatically calculated)"
                      disabled
                    />
                  </div>
                  <div className="flex gap-2 text-sm text-gray-500 mt-1">
                    <span>Energy (kcal)</span>
                    <span>Energy (kJ)</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="fat">Fat</Label>
                  <Input
                    id="fat"
                    value={formData.fat}
                    onChange={(e) => handleInputChange("fat", e.target.value)}
                    className="mt-1"
                    type="number"
                    step="0.1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Fat (g)</p>
                </div>

                <div>
                  <Label htmlFor="saturates">Saturates</Label>
                  <Input
                    id="saturates"
                    value={formData.saturates}
                    onChange={(e) => handleInputChange("saturates", e.target.value)}
                    className="mt-1"
                    type="number"
                    step="0.1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Saturated fat (g)</p>
                </div>

                <div>
                  <Label htmlFor="carbohydrate">Carbohydrate</Label>
                  <Input
                    id="carbohydrate"
                    value={formData.carbohydrate}
                    onChange={(e) => handleInputChange("carbohydrate", e.target.value)}
                    className="mt-1"
                    type="number"
                    step="0.1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Carbohydrate (g)</p>
                </div>

                <div>
                  <Label htmlFor="sugar">Sugar</Label>
                  <Input
                    id="sugar"
                    value={formData.sugar}
                    onChange={(e) => handleInputChange("sugar", e.target.value)}
                    className="mt-1"
                    type="number"
                    step="0.1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Sugar carbohydrate (g)</p>
                </div>

                <div>
                  <Label htmlFor="protein">Protein</Label>
                  <Input
                    id="protein"
                    value={formData.protein}
                    onChange={(e) => handleInputChange("protein", e.target.value)}
                    className="mt-1"
                    type="number"
                    step="0.1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Protein (g)</p>
                </div>

                <div>
                  <Label htmlFor="salt">Salt</Label>
                  <Input
                    id="salt"
                    value={formData.salt}
                    onChange={(e) => handleInputChange("salt", e.target.value)}
                    className="mt-1"
                    type="number"
                    step="0.1"
                  />
                  <p className="text-sm text-gray-500 mt-1">Salt (g)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsible consumption */}
          <Card>
            <CardHeader>
              <CardTitle>Responsible consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Warning against drinking during pregnancy</p>
                    <p className="text-sm text-gray-500">Don't drink during pregnancy and breastfeeding</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      🤰🚫
                    </div>
                    <Checkbox
                      checked={responsibleConsumption.pregnancy}
                      onCheckedChange={(checked) => 
                        setResponsibleConsumption(prev => ({ ...prev, pregnancy: !!checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Warning against drinking below legal age</p>
                    <p className="text-sm text-gray-500">Don't drink when below legal drinking age</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      18🚫
                    </div>
                    <Checkbox
                      checked={responsibleConsumption.underAge}
                      onCheckedChange={(checked) => 
                        setResponsibleConsumption(prev => ({ ...prev, underAge: !!checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Warning against drinking when driving</p>
                    <p className="text-sm text-gray-500">Don't drink when driving a car, motorbike or operating machinery</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      🚗🚫
                    </div>
                    <Checkbox
                      checked={responsibleConsumption.driving}
                      onCheckedChange={(checked) => 
                        setResponsibleConsumption(prev => ({ ...prev, driving: !!checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Organic</p>
                    <p className="text-sm text-gray-500">Certified organic based on EU-Guidelines</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      🌿
                    </div>
                    <Checkbox
                      checked={selectedCertifications.organic}
                      onCheckedChange={(checked) => 
                        setSelectedCertifications(prev => ({ ...prev, organic: !!checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Vegetarian</p>
                    <p className="text-sm text-gray-500">Certified Vegetarian by V-Label</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      Ⓥ
                    </div>
                    <Checkbox
                      checked={selectedCertifications.vegetarian}
                      onCheckedChange={(checked) => 
                        setSelectedCertifications(prev => ({ ...prev, vegetarian: !!checked }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Vegan</p>
                    <p className="text-sm text-gray-500">Certified Vegan by V-Label</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      Ⓥ
                    </div>
                    <Checkbox
                      checked={selectedCertifications.vegan}
                      onCheckedChange={(checked) => 
                        setSelectedCertifications(prev => ({ ...prev, vegan: !!checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Food Business Operator */}
          <Card>
            <CardHeader>
              <CardTitle>Food Business Operator</CardTitle>
              <p className="text-sm text-gray-500">
                Operator under whose name or business name the food is marketed or, if that operator is not 
                established in the Union, the importer into the Union market.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessOperatorType">Type</Label>
                  <Select value={formData.businessOperatorType} onValueChange={(value) => handleInputChange("businessOperatorType", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="(no title)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottler">Bottler</SelectItem>
                      <SelectItem value="producer">Producer</SelectItem>
                      <SelectItem value="importer">Importer</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Indication of the bottler, producer, importer or vendor.
                  </p>
                </div>

                <div>
                  <Label htmlFor="businessOperatorName">Name</Label>
                  <Input
                    id="businessOperatorName"
                    value={formData.businessOperatorName}
                    onChange={(e) => handleInputChange("businessOperatorName", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Food business operator name.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="businessOperatorAddress">Address</Label>
                  <Input
                    id="businessOperatorAddress"
                    value={formData.businessOperatorAddress}
                    onChange={(e) => handleInputChange("businessOperatorAddress", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Food business operator address.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="additionalInformation">Additional information</Label>
                  <Textarea
                    id="additionalInformation"
                    value={formData.additionalInformation}
                    onChange={(e) => handleInputChange("additionalInformation", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Optional indications, like a code, VAT number or additional Impressum information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logistics */}
          <Card>
            <CardHeader>
              <CardTitle>Logistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="countryOfOrigin">Country of origin</Label>
                  <Input
                    id="countryOfOrigin"
                    value={formData.countryOfOrigin}
                    onChange={(e) => handleInputChange("countryOfOrigin", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the ISO 3166-1 two-letter contry code.
                  </p>
                </div>

                <div>
                  <Label htmlFor="skuCode">SKU Code</Label>
                  <Input
                    id="skuCode"
                    value={formData.skuCode}
                    onChange={(e) => handleInputChange("skuCode", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your internal Stock Keeping Unit (SKU) text code.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="eanGtin">EAN/GTIN</Label>
                  <Input
                    id="eanGtin"
                    value={formData.eanGtin}
                    onChange={(e) => handleInputChange("eanGtin", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your European Article Number (EAN) or Global Trade Item Number (GTIN) of your product.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portability */}
          <Card>
            <CardHeader>
              <CardTitle>Portability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="externalShortLink">External short link</Label>
                  <Input
                    id="externalShortLink"
                    value={formData.externalShortLink}
                    onChange={(e) => handleInputChange("externalShortLink", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Current link already printed in your label from an external URL shortening service, like Bitly, so you can 
                    manage all QR Codes in Open E-Label.
                  </p>
                </div>

                <div>
                  <Label htmlFor="redirectLink">Redirect link</Label>
                  <Input
                    id="redirectLink"
                    value={formData.redirectLink}
                    onChange={(e) => handleInputChange("redirectLink", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Redirect/forward this label page to a different e-label site (for portability).
                  </p>
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
              {loading ? 'Creating...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateProduct;
