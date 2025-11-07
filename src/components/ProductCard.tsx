import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  stock?: number;
}
const ProductCard = ({
  id,
  name,
  description,
  price,
  image_url,
  category,
  stock
}: ProductCardProps) => {
  const navigate = useNavigate();
  const categoryLabels: Record<string, string> = {
    electronics: "Electrónica",
    clothing: "Ropa",
    home: "Hogar",
    books: "Libros",
    sports: "Deportes",
    other: "Otros"
  };
  return <Card 
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/product/${id}`)}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {image_url ? <img src={image_url} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sin imagen
            </div>}
          {category}
          {stock !== undefined && stock === 0 && <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive">Agotado</Badge>
            </div>}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">{name}</h3>
        {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
      </CardContent>
      
    </Card>;
};
export default ProductCard;