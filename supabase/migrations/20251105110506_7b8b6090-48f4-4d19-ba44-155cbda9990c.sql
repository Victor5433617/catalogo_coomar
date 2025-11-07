-- Remove default value from category column
ALTER TABLE public.products 
  ALTER COLUMN category DROP DEFAULT;

-- Change category column type to UUID
ALTER TABLE public.products 
  ALTER COLUMN category TYPE uuid USING NULL;

-- Add foreign key constraint to categories table
ALTER TABLE public.products 
  ADD CONSTRAINT products_category_fkey 
  FOREIGN KEY (category) 
  REFERENCES public.categories(id) 
  ON DELETE SET NULL;