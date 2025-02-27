import AsyncStorage from '@react-native-async-storage/async-storage';

const DRINKS_KEY = 'DRINKS_KEY';

export const saveDrinkToDatabase = async (drink: any) => {
    try {
        const existingDrinks = await getSavedDrinks();
        const updatedDrinks = [...existingDrinks, drink];
        await AsyncStorage.setItem(DRINKS_KEY, JSON.stringify(updatedDrinks));
        console.log('Drink saved to database:', drink);
    } catch (error) {
        console.error('Failed to save drink:', error);
        throw error;
    }
};

export const getSavedDrinks = async () => {
    try {
        const drinks = await AsyncStorage.getItem(DRINKS_KEY);
        const parsedDrinks = drinks ? JSON.parse(drinks) : [];
        console.log('Existing drinks:', parsedDrinks);
        return parsedDrinks;
    } catch (error) {
        console.error('Failed to retrieve drinks:', error);
        return [];
    }
};

export const deleteDrinkFromDatabase = async (drinkName: string) => {
    try {
        const existingDrinks = await getSavedDrinks();
        const updatedDrinks = existingDrinks.filter((drink: any) => drink.name !== drinkName);
        await AsyncStorage.setItem(DRINKS_KEY, JSON.stringify(updatedDrinks));
        console.log('Drink deleted from database:', drinkName);
    } catch (error) {
        console.error('Failed to delete drink:', error);
        throw error;
    }
};

export const updateDrinkNotesInDatabase = async (drinkName: string, notes: string) => {
    try {
        const existingDrinks = await getSavedDrinks();
        const updatedDrinks = existingDrinks.map((drink: any) => 
            drink.name === drinkName ? { ...drink, notes } : drink
        );
        await AsyncStorage.setItem(DRINKS_KEY, JSON.stringify(updatedDrinks));
        console.log('Drink notes updated in database:', drinkName);
    } catch (error) {
        console.error('Failed to update drink notes:', error);
        throw error;
    }
};
