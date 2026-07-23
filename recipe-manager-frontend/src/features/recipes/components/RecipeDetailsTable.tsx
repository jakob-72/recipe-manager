import type { SavedRecipe } from '../types.ts';
import {
  Box,
  Chip,
  Fab,
  Paper,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface RecipeDetailsTableProps {
  recipe: SavedRecipe;
  onEdit: () => void;
}

export const RecipeDetailsTable = ({ recipe, onEdit }: RecipeDetailsTableProps) => (
  <Box sx={{ width: '100%', position: 'relative' }}>
    <Fab
      color="primary"
      size="medium"
      aria-label="edit recipe"
      onClick={onEdit}
      sx={{ position: 'absolute', bottom: 16, right: 16, zIndex: 1 }}
    >
      <EditIcon />
    </Fab>

    <TableContainer component={Paper} sx={{ width: '100%' }}>
      <Table size="small" aria-label="recipe details">
        <TableBody>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell>
              <Typography variant="h6" component="span">
                {recipe.name}
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Difficulty</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Rating value={recipe.difficulty} max={5} readOnly />
                <Typography variant="body2">{recipe.difficulty}/5</Typography>
              </Stack>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Tags</TableCell>
            <TableCell>
              {recipe.tags.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No tags
                </Typography>
              ) : (
                <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
                  {recipe.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: 700, verticalAlign: 'top' }}>Ingredients</TableCell>
            <TableCell>
              {recipe.ingredients.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No ingredients
                </Typography>
              ) : (
                <Stack spacing={0.5}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <Typography key={`${ingredient.ingredientName}-${index}`} variant="body2">
                      {ingredient.ingredientName}: {ingredient.quantity} {ingredient.unit}
                    </Typography>
                  ))}
                </Stack>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: 700, verticalAlign: 'top' }}>Instructions</TableCell>
            <TableCell>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {recipe.instructions}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);
