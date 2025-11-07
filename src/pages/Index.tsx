import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import backgroundImage from "@/assets/background-store.jpg";
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number | null;
}
const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => {
    fetchProducts();
    fetchCategories();

    // Realtime subscription
    const channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }
    setFilteredProducts(filtered);
  };
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Image with Transparency */}
      <div
        className="fixed inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section
          style={{
            background: "var(--gradient-hero)",
          }}
          className="pt-24 pb-12 px-4"
        >
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 animate-in fade-in slide-in-from-bottom duration-700">
              Nuestro Catálogo
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-150">
              Descubre nuestra selección de productos de calidad
            </p>
            <p
              className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto text-center leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150
"
            >
              <ul>
                Para consultas al:
                <li>
                  <a href="https://wa.link/96b69i " target="blank">
                    {" "}
                    0983860064
                  </a>{" "}
                </li>
                <li>
                  <a href="https://wa.link/4k9lvb " target="blank">
                    {" "}
                    0973122827
                  </a>
                </li>
                <li>
                  {" "}
                  <a href="https://wa.link/370p7f " target="blank">
                    {" "}
                    0983860065
                  </a>{" "}
                </li>
              </ul>
            </p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 px-4 border-b">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="text-center text-muted-foreground">
                Cargando productos...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center text-muted-foreground">
                {products.length === 0
                  ? "No hay productos disponibles aún"
                  : "No se encontraron productos con los filtros seleccionados"}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description || undefined}
                    price={product.price}
                    image_url={product.image_url || undefined}
                    category={product.category || undefined}
                    stock={product.stock || undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default Index;
