import { type KeyboardEventHandler, useMemo, useState } from 'react';
import type { Ingredient, Recipe } from '../types.ts';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface RecipeFormProps {
  recipe?: Recipe;
  onSubmit: (recipe: Recipe) => void;
}

const emptyIngredient = (): Ingredient => ({
  ingredientName: '',
  quantity: 0,
  unit: '',
});

export const RecipeForm = ({ recipe, onSubmit }: RecipeFormProps) => {
  const [name, setName] = useState(recipe?.name ?? '');
  const [difficulty, setDifficulty] = useState<number>(recipe?.difficulty ?? 0);
  const [instructions, setInstructions] = useState(recipe?.instructions ?? '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients?.length ? recipe.ingredients : [emptyIngredient()],
  );
  const [tags, setTags] = useState<string[]>(recipe?.tags ?? []);
  const [tagInput, setTagInput] = useState('');

  const trimmedTag = tagInput.trim();
  const canAddTag = trimmedTag.length > 0 && !tags.includes(trimmedTag);

  const isFormValid = useMemo(() => {
    const hasName = name.trim().length > 0;
    const hasValidDifficulty = difficulty >= 1 && difficulty <= 5;
    const hasInstructions = instructions.trim().length > 0;
    const hasValidIngredients = ingredients.every(
      (item) =>
        item.ingredientName.trim().length > 0 &&
        item.unit.trim().length > 0 &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0,
    );

    return hasName && hasValidDifficulty && hasInstructions && hasValidIngredients;
  }, [name, difficulty, instructions, ingredients]);

  const handleAddTag = () => {
    if (!canAddTag) return;
    setTags((prev) => [...prev, trimmedTag]);
    setTagInput('');
  };

  const handleTagInputKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string | number,
  ) => {
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleAddIngredient = () => {
    setIngredients((prev) => [...prev, emptyIngredient()]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSave = () => {
    if (!isFormValid) return;

    onSubmit({
      id: recipe?.id ?? '',
      name: name.trim(),
      difficulty,
      instructions: instructions.trim(),
      ingredients: ingredients.map((ingredient) => ({
        ingredientName: ingredient.ingredientName.trim(),
        quantity: ingredient.quantity,
        unit: ingredient.unit.trim(),
      })),
      tags,
    });
  };

  const requiredMark = (
    <Box component="span" sx={{ color: 'error.main', ml: 0.25 }} aria-hidden>
      *
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table size="small" aria-label="recipe edit form">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>
                Name
                {requiredMark}
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Recipe name"
                  required
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>
                Difficulty
                {requiredMark}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating
                    value={difficulty}
                    max={5}
                    onChange={(_event, newValue) => setDifficulty(newValue ?? 0)}
                  />
                  <Typography variant="body2">{difficulty}/5</Typography>
                </Stack>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 700, verticalAlign: 'top' }}>Tags</TableCell>
              <TableCell>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Add tag"
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      placeholder="e.g. vegan"
                    />
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={handleAddTag}
                      disabled={!canAddTag}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Stack>

                  {tags.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No tags
                    </Typography>
                  ) : (
                    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                      {tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          onDelete={() => handleRemoveTag(tag)}
                        />
                      ))}
                    </Stack>
                  )}
                </Stack>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 700, verticalAlign: 'top' }}>
                Ingredients
                {requiredMark}
              </TableCell>
              <TableCell>
                <Stack spacing={1}>
                  {ingredients.map((ingredient, index) => (
                    <Stack key={index} direction="row" spacing={1} alignItems="center">
                      <TextField
                        size="small"
                        label="Ingredient"
                        value={ingredient.ingredientName}
                        onChange={(event) =>
                          handleIngredientChange(index, 'ingredientName', event.target.value)
                        }
                        sx={{ flex: 2 }}
                        required
                      />
                      <TextField
                        size="small"
                        label="Qty"
                        type="number"
                        value={ingredient.quantity}
                        onChange={(event) =>
                          handleIngredientChange(index, 'quantity', Number(event.target.value))
                        }
                        sx={{ flex: 1 }}
                        required
                      />
                      <TextField
                        size="small"
                        label="Unit"
                        value={ingredient.unit}
                        onChange={(event) =>
                          handleIngredientChange(index, 'unit', event.target.value)
                        }
                        sx={{ flex: 1 }}
                        required
                      />
                      <IconButton
                        type="button"
                        aria-label="remove ingredient"
                        onClick={() => handleRemoveIngredient(index)}
                        disabled={ingredients.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}

                  <Button
                    type="button"
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={handleAddIngredient}
                  >
                    Add ingredient
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 700, verticalAlign: 'top' }}>
                Instructions
                {requiredMark}
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  placeholder="Describe all preparation steps..."
                  required
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button type="button" variant="contained" disabled={!isFormValid} onClick={handleSave}>
          Save
        </Button>
      </Stack>
    </Box>
  );
};
