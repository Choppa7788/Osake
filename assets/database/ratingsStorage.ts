import AsyncStorage from '@react-native-async-storage/async-storage';

const RATINGS_KEY = 'drinkRatings';

export const getRating = async (drinkId: string): Promise<number> => {
  try {
    const ratingsData = await AsyncStorage.getItem(RATINGS_KEY);
    if (ratingsData) {
      const ratings = JSON.parse(ratingsData);
      return ratings[drinkId] || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting rating:', error);
    return 0;
  }
};

export const saveRating = async (drinkId: string, rating: number): Promise<void> => {
  try {
    const ratingsData = await AsyncStorage.getItem(RATINGS_KEY);
    let ratings: { [key: string]: number } = {};
    
    if (ratingsData) {
      ratings = JSON.parse(ratingsData);
    }
    
    ratings[drinkId] = rating;
    await AsyncStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  } catch (error) {
    console.error('Error saving rating:', error);
  }
};

export const getAllRatings = async (): Promise<{ [key: string]: number }> => {
  try {
    const ratingsData = await AsyncStorage.getItem(RATINGS_KEY);
    return ratingsData ? JSON.parse(ratingsData) : {};
  } catch (error) {
    console.error('Error getting all ratings:', error);
    return {};
  }
};
