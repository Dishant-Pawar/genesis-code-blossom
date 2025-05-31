
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const ImportIngredients = () => {
  const navigate = useNavigate();
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
    if (!selectedFile) {
      toast.error("Please select a file");
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
      const ingredientsToInsert = excelData.map((row: any) => ({
        name: row.Name || row.name || '',
        category: row.Category || row.category || 'Other ingredient',
        e_number: row['E Number'] || row.e_number || row['E number'] || null,
        allergen: row.Allergen || row.allergen || null,
      }));

      console.log("Ingredients to insert:", ingredientsToInsert);

      const { data, error } = await supabase
        .from('ingredients')
        .insert(ingredientsToInsert);

      if (error) {
        console.error('Error inserting ingredients:', error);
        toast.error(`Failed to import ingredients: ${error.message}`);
        return;
      }

      console.log("Successfully inserted ingredients:", data);
      toast.success(`Successfully imported ${ingredientsToInsert.length} ingredients`);
      navigate("/ingredients");
      
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
          <p className="text-lg text-gray-600">Ingredients</p>
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
                  onClick={() => navigate("/ingredients")}
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
                  <li>Category</li>
                  <li>E Number</li>
                  <li>Allergen</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  There's a list of common ingredients in the wine industry available here:
                </p>
                <ul className="list-disc list-inside text-blue-600">
                  <li>
                    <a href="#" className="hover:underline">elabel-ingredients.xlsx</a>
                  </li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Use this list to get you started.
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

export default ImportIngredients;
