// genres.js

const genres = [
    {
      category: 'Classic Cocktails',
      color: 'red',
      drinks: [
        { name: 'Martini', ingredients: ['Gin/Vodka', 'Dry Vermouth'] },
        { name: 'Old Fashioned', ingredients: ['Whiskey', 'Bitters', 'Sugar'] },
        { name: 'Manhattan', ingredients: ['Whiskey', 'Sweet Vermouth', 'Bitters'] },
        { name: 'Negroni', ingredients: ['Gin', 'Campari', 'Sweet Vermouth'] },
      ]
    },
    {
      category: 'Tiki Cocktails',
      color: 'red',
      drinks: [
        { name: 'Mai Tai', ingredients: ['Rum', 'Lime', 'Orgeat', 'Curaçao'] },
        { name: 'Piña Colada', ingredients: ['Rum', 'Pineapple', 'Coconut'] },
        { name: 'Zombie', ingredients: ['Multiple Rums', 'Fruit Juices', 'Falernum'] },
        { name: 'Blue Hawaiian', ingredients: ['Rum', 'Blue Curaçao', 'Pineapple', 'Coconut'] },
      ]
    },
    {
      category: 'Sour Cocktails',
      color: 'red',
      drinks: [
        { name: 'Whiskey Sour', ingredients: ['Whiskey', 'Lemon', 'Sugar', 'Egg White'] },
        { name: 'Margarita', ingredients: ['Tequila', 'Lime', 'Triple Sec'] },
        { name: 'Daiquiri', ingredients: ['Rum', 'Lime', 'Simple Syrup'] },
        { name: 'Amaretto Sour', ingredients: ['Amaretto', 'Lemon', 'Egg White'] },
      ]
    },
    {
      category: 'Highball Cocktails',
      color: 'red',
      drinks: [
        { name: 'Mojito', ingredients: ['Rum', 'Mint', 'Lime', 'Soda'] },
        { name: 'Gin & Tonic', ingredients: ['Gin', 'Tonic Water'] },
        { name: 'Moscow Mule', ingredients: ['Vodka', 'Ginger Beer', 'Lime'] },
        { name: 'Paloma', ingredients: ['Tequila', 'Grapefruit Soda'] },
      ]
    },
    {
      category: 'Dessert Cocktails',
      color: 'red',
      drinks: [
        { name: 'White Russian', ingredients: ['Vodka', 'Coffee Liqueur', 'Cream'] },
        { name: 'Espresso Martini', ingredients: ['Vodka', 'Coffee Liqueur', 'Espresso'] },
        { name: 'Mudslide', ingredients: ['Vodka', 'Coffee Liqueur', 'Irish Cream'] },
        { name: 'Brandy Alexander', ingredients: ['Brandy', 'Cocoa Liqueur', 'Cream'] },
      ]
    },
    {
      category: 'Spicy Cocktails',
      color: 'red',
      drinks: [
        { name: 'Spicy Margarita', ingredients: ['Tequila', 'Lime', 'Jalapeño', 'Agave'] },
        { name: 'Bloody Mary', ingredients: ['Vodka', 'Tomato Juice', 'Spices'] },
        { name: 'Michelada', ingredients: ['Beer', 'Lime', 'Hot Sauce', 'Worcestershire'] },
        { name: 'Fireball Mule', ingredients: ['Cinnamon Whiskey', 'Ginger Beer', 'Lime'] },
      ]
    },
    {
      category: 'Herbal & Aromatic Cocktails',
      color: 'red',
      drinks: [
        { name: 'Chartreuse Swizzle', ingredients: ['Green Chartreuse', 'Pineapple', 'Lime'] },
        { name: 'Bee’s Knees', ingredients: ['Gin', 'Honey', 'Lemon'] },
        { name: 'Hugo', ingredients: ['Prosecco', 'Elderflower', 'Mint'] },
        { name: 'Sazerac', ingredients: ['Whiskey', 'Absinthe', 'Sugar', 'Bitters'] },
      ]
    },
    {
      category: 'Strong & Boozy Cocktails',
      color: 'red',
      drinks: [
        { name: 'Boulevardier', ingredients: ['Bourbon', 'Campari', 'Sweet Vermouth'] },
        { name: 'Vieux Carré', ingredients: ['Whiskey', 'Cognac', 'Vermouth', 'Bitters'] },
        { name: 'Corpse Reviver #2', ingredients: ['Gin', 'Cointreau', 'Lillet', 'Absinthe'] },
        { name: 'Rum Old Fashioned', ingredients: ['Dark Rum', 'Bitters', 'Sugar'] },
      ]
    },
    {
      category: 'Low-ABV Cocktails',
      color: 'red',
      drinks: [
        { name: 'Aperol Spritz', ingredients: ['Aperol', 'Prosecco', 'Soda'] },
        { name: 'Sherry Cobbler', ingredients: ['Sherry', 'Sugar', 'Citrus', 'Berries'] },
        { name: 'Americano', ingredients: ['Campari', 'Sweet Vermouth', 'Soda'] },
        { name: 'Kir Royale', ingredients: ['Crème de Cassis', 'Champagne'] },
      ]
    },
    {
      category: 'Frozen Cocktails',
      color: 'red',
      drinks: [
        { name: 'Frozen Daiquiri', ingredients: ['Rum', 'Lime', 'Ice'] },
        { name: 'Frozen Margarita', ingredients: ['Tequila', 'Lime', 'Ice'] },
        { name: 'Frosé', ingredients: ['Frozen Rosé', 'Strawberries'] },
        { name: 'Piña Colada', ingredients: ['Rum', 'Pineapple', 'Coconut', 'Ice'] },
      ]
    },
    {
      category: 'Strong & Boozy Cocktails',
      color: 'red',
      drinks: [
        { name: 'Boulevardier', ingredients: ['Bourbon', 'Campari', 'Sweet Vermouth'] },
        { name: 'Vieux Carré', ingredients: ['Whiskey', 'Cognac', 'Vermouth', 'Bitters'] },
        { name: 'Corpse Reviver #2', ingredients: ['Gin', 'Cointreau', 'Lillet', 'Absinthe'] },
        { name: 'Rum Old Fashioned', ingredients: ['Dark Rum', 'Bitters', 'Sugar'] },
      ]
    },
    {
      category: 'Low-ABV Cocktails',
      color: 'red',
      drinks: [
        { name: 'Aperol Spritz', ingredients: ['Aperol', 'Prosecco', 'Soda'] },
        { name: 'Sherry Cobbler', ingredients: ['Sherry', 'Sugar', 'Citrus', 'Berries'] },
        { name: 'Americano', ingredients: ['Campari', 'Sweet Vermouth', 'Soda'] },
        { name: 'Kir Royale', ingredients: ['Crème de Cassis', 'Champagne'] },
      ]
    },
    {
      category: 'Frozen Cocktails',
      color: 'red',
      drinks: [
        { name: 'Frozen Daiquiri', ingredients: ['Rum', 'Lime', 'Ice'] },
        { name: 'Frozen Margarita', ingredients: ['Tequila', 'Lime', 'Ice'] },
        { name: 'Frosé', ingredients: ['Frozen Rosé', 'Strawberries'] },
        { name: 'Piña Colada', ingredients: ['Rum', 'Pineapple', 'Coconut', 'Ice'] },
      ]
    },
    {
      category: 'Strong & Boozy Cocktails',
      color: 'red',
      drinks: [
        { name: 'Boulevardier', ingredients: ['Bourbon', 'Campari', 'Sweet Vermouth'] },
        { name: 'Vieux Carré', ingredients: ['Whiskey', 'Cognac', 'Vermouth', 'Bitters'] },
        { name: 'Corpse Reviver #2', ingredients: ['Gin', 'Cointreau', 'Lillet', 'Absinthe'] },
        { name: 'Rum Old Fashioned', ingredients: ['Dark Rum', 'Bitters', 'Sugar'] },
      ]
    },
    {
      category: 'Low-ABV Cocktails',
      color: 'red',
      drinks: [
        { name: 'Aperol Spritz', ingredients: ['Aperol', 'Prosecco', 'Soda'] },
        { name: 'Sherry Cobbler', ingredients: ['Sherry', 'Sugar', 'Citrus', 'Berries'] },
        { name: 'Americano', ingredients: ['Campari', 'Sweet Vermouth', 'Soda'] },
        { name: 'Kir Royale', ingredients: ['Crème de Cassis', 'Champagne'] },
      ]
    },
    {
      category: 'Frozen Cocktails',
      color: 'red',
      drinks: [
        { name: 'Frozen Daiquiri', ingredients: ['Rum', 'Lime', 'Ice'] },
        { name: 'Frozen Margarita', ingredients: ['Tequila', 'Lime', 'Ice'] },
        { name: 'Frosé', ingredients: ['Frozen Rosé', 'Strawberries'] },
        { name: 'Piña Colada', ingredients: ['Rum', 'Pineapple', 'Coconut', 'Ice'] },
      ]
    },
    {
      category: 'Strong & Boozy Cocktails',
      color: 'red',
      drinks: [
        { name: 'Boulevardier', ingredients: ['Bourbon', 'Campari', 'Sweet Vermouth'] },
        { name: 'Vieux Carré', ingredients: ['Whiskey', 'Cognac', 'Vermouth', 'Bitters'] },
        { name: 'Corpse Reviver #2', ingredients: ['Gin', 'Cointreau', 'Lillet', 'Absinthe'] },
        { name: 'Rum Old Fashioned', ingredients: ['Dark Rum', 'Bitters', 'Sugar'] },
      ]
    },
    {
      category: 'Low-ABV Cocktails',
      color: 'red',
      drinks: [
        { name: 'Aperol Spritz', ingredients: ['Aperol', 'Prosecco', 'Soda'] },
        { name: 'Sherry Cobbler', ingredients: ['Sherry', 'Sugar', 'Citrus', 'Berries'] },
        { name: 'Americano', ingredients: ['Campari', 'Sweet Vermouth', 'Soda'] },
        { name: 'Kir Royale', ingredients: ['Crème de Cassis', 'Champagne'] },
      ]
    },
    {
      category: 'Frozen Cocktails',
      color: 'red',
      drinks: [
        { name: 'Frozen Daiquiri', ingredients: ['Rum', 'Lime', 'Ice'] },
        { name: 'Frozen Margarita', ingredients: ['Tequila', 'Lime', 'Ice'] },
        { name: 'Frosé', ingredients: ['Frozen Rosé', 'Strawberries'] },
        { name: 'Piña Colada', ingredients: ['Rum', 'Pineapple', 'Coconut', 'Ice'] },
      ]
    },
    {
      category: 'Strong & Boozy Cocktails',
      color: 'red',
      drinks: [
        { name: 'Boulevardier', ingredients: ['Bourbon', 'Campari', 'Sweet Vermouth'] },
        { name: 'Vieux Carré', ingredients: ['Whiskey', 'Cognac', 'Vermouth', 'Bitters'] },
        { name: 'Corpse Reviver #2', ingredients: ['Gin', 'Cointreau', 'Lillet', 'Absinthe'] },
        { name: 'Rum Old Fashioned', ingredients: ['Dark Rum', 'Bitters', 'Sugar'] },
      ]
    },
    {
      category: 'Low-ABV Cocktails',
      color: 'red',
      drinks: [
        { name: 'Aperol Spritz', ingredients: ['Aperol', 'Prosecco', 'Soda'] },
        { name: 'Sherry Cobbler', ingredients: ['Sherry', 'Sugar', 'Citrus', 'Berries'] },
        { name: 'Americano', ingredients: ['Campari', 'Sweet Vermouth', 'Soda'] },
        { name: 'Kir Royale', ingredients: ['Crème de Cassis', 'Champagne'] },
      ]
    },
    {
      category: 'Frozen Cocktails',
      color: 'red',
      drinks: [
        { name: 'Frozen Daiquiri', ingredients: ['Rum', 'Lime', 'Ice'] },
        { name: 'Frozen Margarita', ingredients: ['Tequila', 'Lime', 'Ice'] },
        { name: 'Frosé', ingredients: ['Frozen Rosé', 'Strawberries'] },
        { name: 'Piña Colada', ingredients: ['Rum', 'Pineapple', 'Coconut', 'Ice'] },
      ]
    },
    {
      category: 'Strong & Boozy Cocktails',
      color: 'red',
      drinks: [
        { name: 'Boulevardier', ingredients: ['Bourbon', 'Campari', 'Sweet Vermouth'] },
        { name: 'Vieux Carré', ingredients: ['Whiskey', 'Cognac', 'Vermouth', 'Bitters'] },
        { name: 'Corpse Reviver #2', ingredients: ['Gin', 'Cointreau', 'Lillet', 'Absinthe'] },
        { name: 'Rum Old Fashioned', ingredients: ['Dark Rum', 'Bitters', 'Sugar'] },
      ]
    },
    {
      category: 'Low-ABV Cocktails',
      color: 'red',
      drinks: [
        { name: 'Aperol Spritz', ingredients: ['Aperol', 'Prosecco', 'Soda'] },
        { name: 'Sherry Cobbler', ingredients: ['Sherry', 'Sugar', 'Citrus', 'Berries'] },
        { name: 'Americano', ingredients: ['Campari', 'Sweet Vermouth', 'Soda'] },
        { name: 'Kir Royale', ingredients: ['Crème de Cassis', 'Champagne'] },
      ]
    },
    {
      category: 'Frozen Cocktails',
      color: 'green',
      drinks: [
        { name: 'Frozen Daiquiri', ingredients: ['Rum', 'Lime', 'Ice'] },
        { name: 'Frozen Margarita', ingredients: ['Tequila', 'Lime', 'Ice'] },
        { name: 'Frosé', ingredients: ['Frozen Rosé', 'Strawberries'] },
        { name: 'Piña Colada', ingredients: ['Rum', 'Pineapple', 'Coconut', 'Ice'] },
      ]
    }
    
  ];
  
  export default genres;
  