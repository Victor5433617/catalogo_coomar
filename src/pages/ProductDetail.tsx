import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number | null;
}

interface Category {
  id: string;
  name: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Tasa de conversión aproximada USD a PYG (Guaraníes paraguayos)
  const USD_TO_PYG = 7300;

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Producto no encontrado",
          description: "El producto que buscas no existe",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setProduct(data);

      // Fetch category if exists
      if (data.category) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id, name')
          .eq('id', data.category)
          .maybeSingle();
        
        if (categoryData) {
          setCategory(categoryData);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudo cargar el producto",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const formatPYG = (usdPrice: number) => {
    const pygPrice = usdPrice * USD_TO_PYG;
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(pygPrice);
  };

  const calculateInstallment = (total: number, months: number) => {
    return formatPYG(total / months);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const priceInPYG = product.price * USD_TO_PYG;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 max-w-7xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8 hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al catálogo
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted shadow-lg">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <p>Sin imagen</p>
                </div>
              </div>
            )}
            {product.stock !== null && product.stock === 0 && (
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="destructive" className="text-lg px-8 py-3 shadow-lg">Agotado</Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-8">
            {category && (
              <Badge variant="secondary" className="w-fit text-sm px-4 py-1.5">
                {category.name}
              </Badge>
            )}
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {product.name}
                </h1>
                
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>
              
              {product.description && (
                <Card className="border-none shadow-md">
                  <CardContent className="p-6">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Descripción
                    </h2>
                    <p className="text-lg text-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Availability Status */}
              {product.stock !== null && product.stock > 0 ? (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    Disponible
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm font-medium text-red-700 dark:text-red-400">
                    No disponible
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
