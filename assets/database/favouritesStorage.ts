import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = 'favourite_drinks';

export const getFavoriteDrinks = async (): Promise<any[]> => {
    const favourites = await AsyncStorage.getItem(FAVOURITES_KEY);
    return favourites ? JSON.parse(favourites) : [];
};

export const addFavourite = async (drink: any) => {
    const favourites = await getFavoriteDrinks();
    const updatedFavourites = [...favourites, drink];

    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updatedFavourites));
};

export const removeFavourite = async (idDrink: string) => {
    const favourites = await getFavoriteDrinks();
    const updatedFavourites = favourites.filter(drink => drink.idDrink !== idDrink);

    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(updatedFavourites));
};

export const isFavourite = async (idDrink: string) => {
    const favourites = await getFavoriteDrinks();
    return favourites.some(drink => drink.idDrink === idDrink);
};

export const checkIfFavourite = async (idDrink: string): Promise<boolean> => {
    const favourites = await getFavoriteDrinks();
    return favourites.some(drink => drink.idDrink === idDrink);
};
