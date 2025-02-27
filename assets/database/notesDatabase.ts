import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY_PREFIX = 'drink_notes_';

export const getNotes = async (idDrink: string): Promise<string | null> => {
    const notes = await AsyncStorage.getItem(`${NOTES_KEY_PREFIX}${idDrink}`);
    return notes;
};

export const saveNotes = async (idDrink: string, notes: string): Promise<void> => {
    await AsyncStorage.setItem(`${NOTES_KEY_PREFIX}${idDrink}`, notes);
};
