package org.jakob72.recipemanager

import org.jakob72.recipemanager.data.dto.RecipeIngredientDto
import org.jakob72.recipemanager.data.dto.RecipeRequest
import org.jakob72.recipemanager.data.models.Ingredient
import org.jakob72.recipemanager.data.models.Recipe
import org.jakob72.recipemanager.data.models.RecipeIngredient
import org.jakob72.recipemanager.extensions.toUUID

object TestData {
    const val ID = "3f4afbeb-a299-4f59-a2fb-ac4c5417fb6b"

    const val USER_ID = "c9863a7c-28ab-46fc-ab88-5ee26a5d7a51"

    val userUuid = USER_ID.toUUID()

    val testRecipeRequest =
        RecipeRequest(
            name = "Test Recipe",
            ingredients =
                listOf(
                    RecipeIngredientDto(
                        ingredientName = "Test ingredient",
                        quantity = 2.5,
                        unit = "tests",
                    ),
                ),
            instructions = "Test instructions",
            difficulty = 3,
            tags = listOf("test"),
        )

    val testIngredient =
        Ingredient(
            id = "d290f1ee-6c54-4b01-90e6-d701748f0851".toUUID(),
            name = "Test ingredient",
        )

    val testRecipe =
        Recipe(
            id = "3f4afbeb-a299-4f59-a2fb-ac4c5417fb6b".toUUID(),
            name = "Test Recipe",
            userId = userUuid,
            ingredients =
                mutableListOf(
                    RecipeIngredient(
                        ingredient =
                            Ingredient(
                                name = "Test ingredient",
                            ),
                        quantity = 2.5,
                        unit = "tests",
                    ),
                ),
            instructions = "Test instructions",
            difficulty = 3,
            tags = listOf("test"),
        )

    val updatedTestRecipeRequest =
        RecipeRequest(
            name = "Updated Test Recipe",
            ingredients =
                listOf(
                    RecipeIngredientDto(
                        ingredientName = "Updated Test ingredient",
                        quantity = 3.0,
                        unit = "updated tests",
                    ),
                ),
            instructions = "Updated test instructions",
            difficulty = 4,
            tags = listOf("test", "updated"),
        )
}
