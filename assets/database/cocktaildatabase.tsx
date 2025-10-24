import axios from 'axios';

const ozToMl = 3035;

const convertOzToMl = (measure: string) => {
    const regex = /(\d+(\.\d+)?)(?:\s*-\s*(\d+(\.\d+)?))?\s*oz/;
    const match = measure.match(regex);

    if (match) {
        const lowerBound = parseFloat(match[1]) * ozToMl;
        const upperBound = match[3] ? parseFloat(match[3]) * ozToMl : null;

        if (upperBound) {
            return `${lowerBound.toFixed(2)}-${upperBound.toFixed(2)} ml`;
        } else {
            return `${lowerBound.toFixed(2)} ml`;
        }
    }

    return measure; // Return the original measure if it doesn't match the pattern
};

export const cocktailDatabase = async (idDrink: string) => {
    try {
        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`);
        const drink = response.data.drinks ? response.data.drinks[0] : null;

        if (drink) {
            for (let i = 1; i <= 15; i++) {
                let measure = drink[`strMeasure${i}`];
                if (measure) {
                    drink[`strMeasure${i}`] = convertOzToMl(measure);
                }
            }
        }

        return drink;
    } catch (error) {
        console.error('Error fetching drink details:', error);
        return null;
    }
};
export const getCocktailDetails = async (idDrink: string) => {
    const drink = await cocktailDatabase(idDrink);

    if (drink) {
        const ingredients = [];
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];
            if (ingredient) {
                ingredients.push({ ingredient, measure });
            }
        }

        return {
            name: drink.strDrink,
            ingredients,
            instructions: drink.strInstructions
        };
    }

    return null;
};