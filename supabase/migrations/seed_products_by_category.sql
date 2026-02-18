-- Seed products for each category (Braga Bazaar)
-- Run in Supabase Dashboard → SQL Editor
-- Run add_products_subcategory.sql first if you want drinks subcategories (waters, juices_softdrinks)
-- Only inserts if products table is empty (to avoid duplicates)
-- To re-seed: DELETE FROM products; then run this again

ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT;

DO $$
BEGIN
  IF (SELECT COUNT(*) FROM products) = 0 THEN
    INSERT INTO products (id, name, price, stock_level, category, image_url, description, unit, price_per_kg, nutritional_info, on_sale, subcategory)
VALUES
  -- Fruits & Vegetables
  (gen_random_uuid(), 'Morangos', 2.49, 50, 'fruits', NULL, 'Morangos frescos da região', 'kg', 4.98, '{"calories":"32","protein":"0.7g","carbs":"7.7g"}', false, NULL),
  (gen_random_uuid(), 'Maçã Regional', 1.80, 80, 'fruits', NULL, 'Maçãs de produção local', 'kg', 1.80, '{"calories":"52","protein":"0.3g","carbs":"14g"}', false, NULL),
  (gen_random_uuid(), 'Laranjas', 1.49, 60, 'fruits', NULL, 'Laranjas doces portuguesas', 'kg', 1.49, '{"calories":"47","vitamin_c":"53mg"}', false, NULL),
  (gen_random_uuid(), 'Tomate', 1.99, 40, 'fruits', NULL, 'Tomate maduro para salada', 'kg', 1.99, '{"calories":"18","lycopene":"rico"}', false, NULL),
  (gen_random_uuid(), 'Brócolos', 1.69, 30, 'fruits', NULL, 'Brócolos frescos', 'kg', 1.69, '{"calories":"34","fiber":"2.6g"}', false, NULL),
  -- Bakery
  (gen_random_uuid(), 'Pão de Mafra', 1.20, 25, 'bakery', NULL, 'Pão tradicional de Mafra', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Croissant', 0.90, 40, 'bakery', NULL, 'Croissant fresco de manteiga', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Bolo de Arroz', 0.75, 50, 'bakery', NULL, 'Bolo de arroz tradicional', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Tarte de Maçã', 3.50, 15, 'bakery', NULL, 'Tarte caseira de maçã', 'unit', NULL, '{}', true, NULL),
  (gen_random_uuid(), 'Pão de Centeio', 1.50, 20, 'bakery', NULL, 'Pão integral de centeio', 'unit', NULL, '{}', false, NULL),
  -- Meat
  (gen_random_uuid(), 'Frango Inteiro', 4.99, 20, 'meat', NULL, 'Frango nacional fresco', 'kg', 4.99, '{}', false, NULL),
  (gen_random_uuid(), 'Bife de Vacă', 9.99, 15, 'meat', NULL, 'Bife de novilho', 'kg', 9.99, '{}', false, NULL),
  (gen_random_uuid(), 'Costeletas de Porco', 6.49, 18, 'meat', NULL, 'Costeletas de porco Bísaro', 'kg', 6.49, '{}', false, NULL),
  (gen_random_uuid(), 'Alheira', 3.99, 25, 'meat', NULL, 'Alheira de Mirandela tradicional', 'unit', NULL, '{}', false, NULL),
  -- Eggs & Dairy
  (gen_random_uuid(), 'Ovos Caseiros', 2.10, 60, 'eggs', NULL, 'Ovos de galinha caipira', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Leite Meio Gordo', 0.79, 100, 'eggs', NULL, 'Leite nacional 1L', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Queijo Flamengo', 4.99, 30, 'eggs', NULL, 'Queijo flamengo fatiado 200g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Iogurte Natural', 0.65, 80, 'eggs', NULL, 'Iogurte natural 125g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Manteiga', 2.49, 40, 'eggs', NULL, 'Manteiga com sal 200g', 'unit', NULL, '{}', false, NULL),
  -- Drinks - Waters
  (gen_random_uuid(), 'Água Mineral 1.5L', 0.79, 120, 'drinks', NULL, 'Água mineral natural', 'unit', NULL, '{}', false, 'waters'),
  (gen_random_uuid(), 'Água com Gás 1L', 0.89, 80, 'drinks', NULL, 'Água mineral com gás', 'unit', NULL, '{}', false, 'waters'),
  (gen_random_uuid(), 'Água com Limão', 1.19, 50, 'drinks', NULL, 'Água com infusão de limão', 'unit', NULL, '{}', false, 'waters'),
  -- Drinks - Juices & Soft Drinks
  (gen_random_uuid(), 'Sumo de Laranja 1L', 1.49, 60, 'drinks', NULL, 'Sumo de laranja natural', 'unit', NULL, '{}', false, 'juices_softdrinks'),
  (gen_random_uuid(), 'Coca-Cola 33cl', 1.29, 100, 'drinks', NULL, 'Refrigerante cola', 'unit', NULL, '{}', false, 'juices_softdrinks'),
  (gen_random_uuid(), 'Sumo de Maçã 1L', 1.39, 50, 'drinks', NULL, 'Sumo de maçã', 'unit', NULL, '{}', false, 'juices_softdrinks'),
  (gen_random_uuid(), 'Água de Coco', 1.99, 40, 'drinks', NULL, 'Água de coco natural', 'unit', NULL, '{}', false, 'juices_softdrinks'),
  -- Cans & Jars
  (gen_random_uuid(), 'Atum em Lata', 1.99, 45, 'cans_jars', NULL, 'Atum em óleo 120g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Grão de Bico', 1.29, 60, 'cans_jars', NULL, 'Grão de bico em conserva 400g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Compota de Morango', 2.49, 35, 'cans_jars', NULL, 'Compota caseira 270g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Milho Doce', 0.99, 70, 'cans_jars', NULL, 'Milho em conserva 340g', 'unit', NULL, '{}', false, NULL),
  -- Pasta, Rice & Cereals
  (gen_random_uuid(), 'Arroz Carolino 1kg', 1.19, 80, 'pasta_rice_cereals', NULL, 'Arroz carolino nacional', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Massa Espaguete 500g', 0.79, 100, 'pasta_rice_cereals', NULL, 'Massa de sêmola de trigo duro', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Cereais Müsli 500g', 3.49, 40, 'pasta_rice_cereals', NULL, 'Müsli com frutos secos', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Aveia em Flocos', 1.99, 50, 'pasta_rice_cereals', NULL, 'Aveia integral 500g', 'unit', NULL, '{}', false, NULL),
  -- Sauces & Condiments
  (gen_random_uuid(), 'Azeite Extra Virgem', 5.99, 30, 'sauces_condiments', NULL, 'Azeite português 750ml', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Ketchup', 1.49, 55, 'sauces_condiments', NULL, 'Ketchup 350g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Maionese', 1.69, 45, 'sauces_condiments', NULL, 'Maionese 370g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Mostarda', 1.29, 35, 'sauces_condiments', NULL, 'Mostarda Dijon', 'unit', NULL, '{}', false, NULL),
  -- Herbs & Spices
  (gen_random_uuid(), 'Sal Marinho', 0.89, 100, 'herbs_spices', NULL, 'Sal marinho fino 1kg', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Pimenta Preta', 2.49, 60, 'herbs_spices', NULL, 'Pimenta em grão 50g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Orégãos', 1.19, 70, 'herbs_spices', NULL, 'Orégãos secos 15g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Pimentão Doce', 2.99, 40, 'herbs_spices', NULL, 'Pimentão doce moído', 'unit', NULL, '{}', false, NULL),
  -- Frozen Foods
  (gen_random_uuid(), 'Pizza Margherita', 2.99, 35, 'frozen_foods', NULL, 'Pizza congelada 350g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Legumes congelados', 1.79, 50, 'frozen_foods', NULL, 'Mistura de legumes 400g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Gelado de Vanila', 3.49, 25, 'frozen_foods', NULL, 'Gelado artesanal 500ml', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Nuggets de Frango', 4.99, 30, 'frozen_foods', NULL, 'Nuggets 400g', 'unit', NULL, '{}', false, NULL),
  -- Snacks
  (gen_random_uuid(), 'Batatas Fritas', 1.49, 80, 'snacks', NULL, 'Batatas fritas 150g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Amendoins', 2.29, 45, 'snacks', NULL, 'Amendoins torrados 200g', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Barras de Cereais', 1.99, 60, 'snacks', NULL, 'Pack 5 barras', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Chocolate Negro', 2.49, 55, 'snacks', NULL, 'Chocolate 70% cacau 100g', 'unit', NULL, '{}', false, NULL),
  -- Household & Cleaning
  (gen_random_uuid(), 'Detergente Loiça', 1.99, 40, 'household_cleaning', NULL, 'Detergente 500ml', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Papel Cozinha', 1.49, 60, 'household_cleaning', NULL, 'Rolo duplo 2x60 folhas', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Lixívia', 0.99, 50, 'household_cleaning', NULL, 'Lixívia 1L', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Esponja Cozinha', 0.79, 100, 'household_cleaning', NULL, 'Esponja multiusos', 'unit', NULL, '{}', false, NULL),
  -- Personal Care
  (gen_random_uuid(), 'Sabonete Líquido', 2.99, 45, 'personal_care', NULL, 'Sabonete hidratante 250ml', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Champô', 3.49, 40, 'personal_care', NULL, 'Champô 400ml', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Pasta Dentífrica', 1.99, 70, 'personal_care', NULL, 'Pasta dentífrica 75ml', 'unit', NULL, '{}', false, NULL),
  (gen_random_uuid(), 'Desodorizante', 2.49, 55, 'personal_care', NULL, 'Desodorizante roll-on', 'unit', NULL, '{}', false, NULL),
  -- Promotions (on sale)
  (gen_random_uuid(), 'Morangos Promo', 1.99, 30, 'promotions', NULL, 'Morangos em promoção', 'kg', 3.98, '{}', true, NULL),
  (gen_random_uuid(), 'Pão Promoção', 0.99, 20, 'promotions', NULL, 'Pão do dia anterior', 'unit', NULL, '{}', true, NULL);
  END IF;
END $$;
