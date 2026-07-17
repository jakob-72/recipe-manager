package org.jakob72.recipemanager.data.dto

import org.jakob72.recipemanager.data.models.Recipe
import java.util.UUID

data class RecipeResponse(
    val id: UUID,
    val name: String,
    val ingredients: List<RecipeIngredientDto>,
    val instructions: String,
    val difficulty: Int,
    val tags: List<String>,
)

fun Recipe.toResponse(): RecipeResponse =
    RecipeResponse(
        id = this.id ?: throw IllegalStateException("Recipe ID is null"),
        name = this.name,
        ingredients =
            this.ingredients.map {
                RecipeIngredientDto(
                    ingredientName = it.ingredient.name,
                    quantity = it.quantity,
                    unit = it.unit,
                )
            },
        instructions = this.instructions,
        difficulty = this.difficulty,
        tags = this.tags ?: emptyList(),
    )
