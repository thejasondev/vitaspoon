export interface UserInput {
  dietaryRestrictions: {
    allergies: string[];
    preferences: string[];
    otherRestrictions: string;
  };
  preferences: {
    cuisineType: string;
    dietType: string;
    prepTime: string;
    difficultyLevel: string;
    electricityType: string;
  };
  availableIngredients: string[];
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Recipe {
  id?: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: string;
  difficultyLevel: string;
  cuisineType: string;
  dietType: string;
  createdAt?: string;
  isSaved?: boolean;
  source?: string;
}

export interface RecipeFormProps {
  userInput: UserInput;
  setUserInput: (input: UserInput) => void;
}

export interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export interface RecipeDisplayProps {
  recipe: Recipe | null;
  isLoading: boolean;
  onSaveRecipe?: (recipe: Recipe) => void;
  isSaved?: boolean;
}

export interface SavedRecipes {
  recipes: Recipe[];
}
