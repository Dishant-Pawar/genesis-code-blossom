
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Pencil, Eye, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  net_volume: string;
  vintage: string;
  type: string;
  sugar_content: string;
  sku_code: string;
  appellations?: {
    name: string;
  };
}

const Products = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedAppellation, setSelectedAppellation] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [appellations, setAppellations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          net_volume,
          vintage,
          type,
          sugar_content,
          sku_code,
          appellations (
            name
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch appellations for filter
  const fetchAppellations = async () => {
    try {
      const { data, error } = await supabase
        .from('appellations')
        .select('id, name');

      if (error) {
        console.error('Error fetching appellations:', error);
        return;
      }

      setAppellations(data || []);
    } catch (error) {
      console.error('Error fetching appellations:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchAppellations();
    }
  }, [user]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
        return;
      }

      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: user?.id,
          name: `Copy of ${product.name}`,
          net_volume: product.net_volume,
          vintage: product.vintage,
          type: product.type,
          sugar_content: product.sugar_content,
          sku_code: product.sku_code,
        })
        .select()
        .single();

      if (error) {
        console.error('Error duplicating product:', error);
        toast.error('Failed to duplicate product');
        return;
      }

      toast.success('Product duplicated successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Failed to duplicate product');
    }
  };

  const handleExportProducts = () => {
    const headers = ["Name", "Net Volume", "Vintage", "Type", "Sugar Content", "Appellation", "SKU Code"];
    const csvContent = [
      headers.join(","),
      ...products.map(product => 
        [
          product.name, 
          product.net_volume, 
          product.vintage, 
          product.type, 
          product.sugar_content, 
          product.appellations?.name || '', 
          product.sku_code
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filters = ["All", "Red", "White", "Rosé", "Sparkling"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.vintage?.includes(searchTerm) ||
                         product.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sugar_content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.appellations?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku_code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === "All" || product.type === activeFilter;
    const matchesAppellation = selectedAppellation === "all" || product.appellations?.name === selectedAppellation;
    
    return matchesSearch && matchesFilter && matchesAppellation;
  });

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">Loading products...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-medium text-gray-900">Products</h1>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-blue-600 border-blue-600">
                  Data ▼
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/products/import" className="flex items-center w-full">
                    Import
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleExportProducts}
                  className="cursor-pointer"
                >
                  Export
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mb-6">
          <Link to="/products/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Create New
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search by name, volume, wine vintage, wine type, wine sugar content, wine appellation or SKU."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          <Button variant="outline">Search</Button>
        </div>

        <div className="mb-6">
          <Select value={selectedAppellation} onValueChange={setSelectedAppellation}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by appellation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Appellations</SelectItem>
              {appellations.map((appellation) => (
                <SelectItem key={appellation.id} value={appellation.name}>
                  {appellation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1 text-sm rounded ${
                activeFilter === filter
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Net volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Vintage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Sugar content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Appellation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    SKU Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.net_volume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.vintage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sugar_content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.appellations?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.sku_code || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Link
                          to={`/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        
                        <Link
                          to={`/products/${product.id}/preview`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger className="text-blue-600 hover:text-blue-900">
                            ⋮
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                            <DropdownMenuItem asChild>
                              <Link to={`/products/${product.id}/edit`} className="flex items-center w-full">
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/products/${product.id}/change-image`} className="flex items-center w-full">
                                Change image
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDuplicateProduct(product)}
                              className="cursor-pointer"
                            >
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/products/${product.id}/details`} className="flex items-center w-full">
                                Details
                              </Link>
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer text-red-600">
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product
                                    and all related data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found. Create your first product to get started.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
