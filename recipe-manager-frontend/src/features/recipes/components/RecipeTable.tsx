import type { Ingredient, SavedRecipe } from '../types.ts';
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Rating,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface RecipeTableProps {
  recipes: SavedRecipe[];
  onDeleteConfirm: (recipe: SavedRecipe) => void;
}

export const RecipeTable = ({ recipes, onDeleteConfirm }: RecipeTableProps) => {
  const navigate = useNavigate();
  const [pendingDeleteRecipe, setPendingDeleteRecipe] = useState<SavedRecipe | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (recipes.length === 0) {
    return (
      <Alert severity="info" sx={{ width: '100%', maxWidth: 960 }}>
        No Recipes yet.
      </Alert>
    );
  }

  const columns: GridColDef<SavedRecipe>[] = [
    {
      field: 'name',
      headerName: 'Recipe Name',
      flex: 2,
      minWidth: 140,
      renderCell: ({ row }) => <b>{row.name}</b>,
    },
    {
      field: 'ingredients',
      headerName: 'ingredients',
      flex: 2,
      minWidth: 140,
      valueGetter: (_value, row: SavedRecipe) =>
        row.ingredients.map((ingredient: Ingredient) => ingredient.ingredientName).join(', '),
    },
    {
      field: 'difficulty',
      headerName: 'Difficulty',
      flex: 1,
      minWidth: 140,
      renderCell: ({ row }) => <Rating value={row.difficulty} max={5} readOnly />,
    },
    {
      field: 'tags',
      headerName: 'Tags',
      flex: 2,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: 'center', height: '100%', flexWrap: 'wrap' }}
        >
          {row.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Stack>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 100,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/recipes/${row.id}/edit`);
            }}
            color="primary"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="delete"
            onClick={(e) => {
              e.stopPropagation();
              setPendingDeleteRecipe(row);
            }}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <Paper sx={{ width: '100%' }}>
        <DataGrid
          rows={recipes}
          columns={columns}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[10, 20]}
          rowSelection={false}
          disableRowSelectionOnClick
          onRowClick={({ row }) => navigate(`/recipes/${row.id}`)}
          autoHeight
          columnVisibilityModel={{
            ingredients: !isMobile,
            difficulty: !isMobile,
            tags: !isSmallScreen,
          }}
          sx={{ border: 0 }}
        />
      </Paper>

      <Dialog open={!!pendingDeleteRecipe} onClose={() => setPendingDeleteRecipe(null)}>
        <DialogTitle>Delete Recipe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{pendingDeleteRecipe?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDeleteRecipe(null)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              if (pendingDeleteRecipe) {
                onDeleteConfirm(pendingDeleteRecipe);
                setPendingDeleteRecipe(null);
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
