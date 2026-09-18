-- Food trivia questions for Food Fun.
-- Safe to run more than once: existing questions are skipped.

-- 1. Make sure a question can only appear once (needed for the ON CONFLICT below).
--    Databases created from the current schema.sql already have this.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'quizzes_question_key') THEN
    ALTER TABLE public.quizzes ADD CONSTRAINT quizzes_question_key UNIQUE (question);
  END IF;
END $$;

-- 2. Remove the non-food placeholder question from the original schema.
DELETE FROM public.quizzes WHERE question = 'What is the capital of France?';

-- 3. Load the questions.
INSERT INTO public.quizzes (question, options, correct_answer, category) VALUES
-- Fruit & Veg
('Which of these is botanically a berry?', ARRAY['Strawberry', 'Banana', 'Raspberry', 'Blackberry'], 'Banana', 'Fruit & Veg'),
('Which fruit is known as the "king of fruits" in Southeast Asia?', ARRAY['Durian', 'Mango', 'Papaya', 'Lychee'], 'Durian', 'Fruit & Veg'),
('Sauerkraut is made from which vegetable?', ARRAY['Cabbage', 'Cucumber', 'Carrot', 'Beetroot'], 'Cabbage', 'Fruit & Veg'),
('Which fruit is dried to make raisins?', ARRAY['Grapes', 'Plums', 'Apricots', 'Figs'], 'Grapes', 'Fruit & Veg'),
('Which tropical fruit has a spiky skin and a crown of leaves?', ARRAY['Pineapple', 'Jackfruit', 'Coconut', 'Papaya'], 'Pineapple', 'Fruit & Veg'),
('Which vitamin are citrus fruits best known for?', ARRAY['Vitamin C', 'Vitamin D', 'Vitamin K', 'Vitamin B12'], 'Vitamin C', 'Fruit & Veg'),

-- Ingredients
('What is the main ingredient in guacamole?', ARRAY['Avocado', 'Tomato', 'Cucumber', 'Green pepper'], 'Avocado', 'Ingredients'),
('Tofu is made from which food?', ARRAY['Soybeans', 'Chickpeas', 'Rice', 'Wheat'], 'Soybeans', 'Ingredients'),
('Hummus is mainly made from which legume?', ARRAY['Chickpeas', 'Lentils', 'Black beans', 'Peas'], 'Chickpeas', 'Ingredients'),
('Which nut is the main ingredient in marzipan?', ARRAY['Almonds', 'Cashews', 'Walnuts', 'Peanuts'], 'Almonds', 'Ingredients'),
('Chocolate is made from the beans of which plant?', ARRAY['Cacao', 'Coffee', 'Vanilla', 'Carob'], 'Cacao', 'Ingredients'),
('Maple syrup is made from the sap of which tree?', ARRAY['Maple', 'Birch', 'Pine', 'Oak'], 'Maple', 'Ingredients'),
('Miso, used in Japanese soup, is made by fermenting which food?', ARRAY['Soybeans', 'Cabbage', 'Fish', 'Seaweed'], 'Soybeans', 'Ingredients'),
('What is the main ingredient in a traditional Indian dal?', ARRAY['Lentils', 'Potatoes', 'Paneer', 'Spinach'], 'Lentils', 'Ingredients'),
('Which cheese is traditionally used on a Margherita pizza?', ARRAY['Mozzarella', 'Cheddar', 'Gouda', 'Parmesan'], 'Mozzarella', 'Ingredients'),
('Which herb is the main ingredient in traditional pesto?', ARRAY['Basil', 'Parsley', 'Mint', 'Cilantro'], 'Basil', 'Ingredients'),
('Which cheese is a classic ingredient in a Greek salad?', ARRAY['Feta', 'Brie', 'Swiss', 'Cheddar'], 'Feta', 'Ingredients'),
('Yogurt is made by fermenting which food?', ARRAY['Milk', 'Eggs', 'Flour', 'Butter'], 'Milk', 'Ingredients'),

-- Spices
('Which spice is the most expensive by weight?', ARRAY['Saffron', 'Cinnamon', 'Black pepper', 'Paprika'], 'Saffron', 'Spices'),
('What compound makes chili peppers taste hot?', ARRAY['Capsaicin', 'Piperine', 'Allicin', 'Curcumin'], 'Capsaicin', 'Spices'),
('Which spice gives curry its yellow color?', ARRAY['Turmeric', 'Cumin', 'Paprika', 'Cardamom'], 'Turmeric', 'Spices'),
('What is the chemical name for table salt?', ARRAY['Sodium chloride', 'Calcium carbonate', 'Potassium nitrate', 'Sodium bicarbonate'], 'Sodium chloride', 'Spices'),

-- Cooking
('In cooking, what does "al dente" mean?', ARRAY['Firm to the bite', 'Very soft', 'Lightly fried', 'Served cold'], 'Firm to the bite', 'Cooking'),
('"Sous vide" cooking involves cooking food in what?', ARRAY['A sealed bag in a water bath', 'A smoking chamber', 'A deep fryer', 'A clay oven'], 'A sealed bag in a water bath', 'Cooking'),
('What does it mean to "julienne" vegetables?', ARRAY['Cut them into thin matchsticks', 'Boil them briefly', 'Blend them smooth', 'Pickle them'], 'Cut them into thin matchsticks', 'Cooking'),
('Flambé is a cooking technique that involves what?', ARRAY['Igniting alcohol over food', 'Freezing food rapidly', 'Slow-cooking in a pit', 'Whipping egg whites'], 'Igniting alcohol over food', 'Cooking'),

-- World Cuisine
('Kimchi is a staple food from which country?', ARRAY['Korea', 'Japan', 'Thailand', 'Vietnam'], 'Korea', 'World Cuisine'),
('Paella is a famous dish from which country?', ARRAY['Spain', 'Italy', 'Portugal', 'Greece'], 'Spain', 'World Cuisine'),
('Tiramisu is a dessert from which country?', ARRAY['Italy', 'France', 'Spain', 'Austria'], 'Italy', 'World Cuisine'),
('Tacos are a traditional dish from which country?', ARRAY['Mexico', 'Peru', 'Argentina', 'Spain'], 'Mexico', 'World Cuisine'),
('Which small pasta shape looks like grains of rice?', ARRAY['Orzo', 'Penne', 'Fusilli', 'Farfalle'], 'Orzo', 'World Cuisine'),

-- Drinks
('Which country produces the most coffee in the world?', ARRAY['Brazil', 'Colombia', 'Vietnam', 'Ethiopia'], 'Brazil', 'Drinks'),
('After water, which drink is the most consumed worldwide?', ARRAY['Tea', 'Coffee', 'Milk', 'Beer'], 'Tea', 'Drinks')
ON CONFLICT (question) DO NOTHING;

-- Check: should return 33 questions across 6 categories.
SELECT category, COUNT(*) AS questions FROM public.quizzes GROUP BY category ORDER BY category;
