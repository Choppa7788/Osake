import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

const NOTES_KEY = 'drinkNotes';
const NOTES_FILE_PATH = `${RNFS.DocumentDirectoryPath}/notes.json`;

export const getNotes = async (): Promise<{ [key: string]: string }> => {
    try {
        const notes = await RNFS.readFile(NOTES_FILE_PATH, 'utf8');
        return notes ? JSON.parse(notes) : {};
    } catch (error) {
        console.error('Error getting notes:', error);
        return {};
    }
};

export const saveNotes = async (drinkId: string, strNotes: string) => {
    try {
        const notes = await getNotes();
        notes[drinkId] = strNotes;
        await RNFS.writeFile(NOTES_FILE_PATH, JSON.stringify(notes), 'utf8');
    } catch (error) {
        console.error('Error saving notes:', error);
    }
};
