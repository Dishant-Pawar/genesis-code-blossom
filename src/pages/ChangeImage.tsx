
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ChangeImage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Handle image upload logic here
      console.log("Uploading file:", selectedFile);
      navigate(`/products/${id}/edit`);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Change Image</h1>
          <p className="text-lg text-gray-600">Copy of Wine2 1111</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <Label htmlFor="image">Image File</Label>
              <div className="mt-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-4"
                />
                <p className="text-sm text-gray-500 mb-4">Image to upload</p>
                <Button onClick={handleUpload} disabled={!selectedFile}>
                  Upload
                </Button>
              </div>
            </div>

            <div className="mt-8">
              <Link to={`/products/${id}/edit`}>
                <Button variant="link" className="text-blue-600">
                  Back to Product
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Transparent Background</h3>
              <p className="text-sm text-gray-700 mb-4">
                To ensure your image look stunning in both dark and light modes, we recommend
                uploading images with a transparent background.
              </p>
              <p className="text-sm text-gray-700 mb-4">
                If you don't have images with transparent backgrounds, don't worry! You can easily
                achieve this by using online background removal services. Here are a few
                recommendations:
              </p>
              <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
                <li>Adobe Express Free image background remover</li>
                <li>LunaPic Background Removal</li>
              </ul>
              <p className="text-sm text-gray-700 mt-4">
                Take a moment to check and, if necessary, update your images. This small adjustment will go a
                long way in enhancing the overall aesthetics of your content.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Image Optimization</h3>
              <p className="text-sm text-gray-700 mb-4">
                For better performance, image will be resized and compressed for web.
              </p>
              <p className="text-sm text-gray-700 mb-2">
                Please provide a product image, in any format, with one of it's with <span className="text-red-500">500 px</span>.
              </p>
              <p className="text-sm text-gray-700">
                Uploaded images will be scaled down to a maximum size of 2000 x 2000 px and will be stored in
                WebP format, with 90% quality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChangeImage;
