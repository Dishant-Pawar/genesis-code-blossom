
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const ImportProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const processExcelFile = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      toast.error("Please select a file and ensure you're logged in");
      return;
    }

    setIsUploading(true);
    
    try {
      console.log("Processing Excel file:", selectedFile.name);
      const excelData = await processExcelFile(selectedFile) as any[];
      
      if (!excelData || excelData.length === 0) {
        toast.error("No data found in the Excel file");
        return;
      }

      console.log("Parsed Excel data:", excelData);

      // Process each row and insert into database
      const productsToInsert = excelData.map((row: any) => ({
        user_id: user.id,
        name: row.Name || row.name || '',
        net_volume: row['Net Volume'] || row.net_volume || row['Net volume'] || '',
        vintage: row.Vintage || row.vintage || '',
        type: row.Type || row.type || '',
        sugar_content: row['Sugar Content'] || row.sugar_content || row['Sugar content'] || '',
        sku_code: row['SKU Code'] || row.sku_code || row['SKU code'] || '',
        brand: row.Brand || row.brand || '',
        alcohol: row.Alcohol || row.alcohol || '',
        country_of_origin: row['Country of Origin'] || row.country_of_origin || row['Country of origin'] || '',
        ean_gtin: row['EAN/GTIN'] || row.ean_gtin || row['EAN GTIN'] || '',
      }));

      console.log("Products to insert:", productsToInsert);

      const { data, error } = await supabase
        .from('products')
        .insert(productsToInsert);

      if (error) {
        console.error('Error inserting products:', error);
        toast.error(`Failed to import products: ${error.message}`);
        return;
      }

      console.log("Successfully inserted products:", data);
      toast.success(`Successfully imported ${productsToInsert.length} products`);
      navigate("/products");
      
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error("Failed to process the Excel file. Please check the file format.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Import</h1>
          <p className="text-lg text-gray-600">Products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Upload form */}
          <Card>
            <CardHeader>
              <CardTitle>Excel File</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file">File to import</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>
              
              <Button 
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
              
              <div className="pt-4">
                <Button
                  variant="link"
                  onClick={() => navigate("/products")}
                  className="text-blue-600 p-0"
                >
                  Back to List
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expected Excel Format</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Your Excel file should contain the following columns (case-insensitive):
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Name (required)</li>
                  <li>Net Volume</li>
                  <li>Vintage</li>
                  <li>Type</li>
                  <li>Sugar Content</li>
                  <li>SKU Code</li>
                  <li>Brand</li>
                  <li>Alcohol</li>
                  <li>Country of Origin</li>
                  <li>EAN/GTIN</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup and Restore</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  You can use this import to restore a backup (export) you have made previously.
                </p>
                <p className="text-gray-600">
                  Products with the same identification will be updated and new products will be added.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Excel file</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-600">
                  <p>
                    This expects the Excel file to contain a header row with the column names.
                  </p>
                  <p>
                    Objects are read from the first worksheet. If the column names equal the property 
                    names (ignoring case) no other configuration is necessary.
                  </p>
                  <p>
                    The format of the Excel file (xlsx or xls) is autodetected.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ImportProducts;
