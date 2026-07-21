package org.jakob72.recipemanager.services

import org.jakob72.recipemanager.data.IngredientRepository
import org.jakob72.recipemanager.data.RecipeRepository
import org.jakob72.recipemanager.data.dto.RecipeRequest
import org.jakob72.recipemanager.data.models.Ingredient
import org.jakob72.recipemanager.data.models.Recipe
import org.jakob72.recipemanager.data.models.RecipeIngredient
import org.jakob72.recipemanager.exceptions.AlreadyExistsException
import org.jakob72.recipemanager.extensions.toUUID
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class RecipeService(
    private val recipeRepository: RecipeRepository,
    private val ingredientRepository: IngredientRepository,
) {
    @Transactional(readOnly = true)
    fun getAllRecipes(userId: String): List<Recipe> {
        val uuid = userId.toUUID()
        return recipeRepository.findAllByUserId(uuid)
    }

    @Transactional(readOnly = true)
    fun findRecipeById(
        id: String,
        userId: String,
    ): Recipe {
        val recipeId = id.toUUID()
        val userUuid = userId.toUUID()
        return recipeRepository
            .findByIdAndUserId(recipeId, userUuid)
            .orElseThrow { NoSuchElementException("Recipe not found") }
    }

    @Transactional(readOnly = true)
    fun findRecipesByIngredient(
        ingredientName: String,
        userId: String,
    ): List<Recipe> {
        val uuid = userId.toUUID()
        return recipeRepository.findByIngredientName(ingredientName, uuid)
    }

    @Transactional(readOnly = true)
    fun findRecipeByName(
        name: String,
        userId: String,
    ): Recipe? {
        val uuid = userId.toUUID()
        return recipeRepository.findByNameAndUserId(name, uuid).orElse(null)
    }

    @Transactional
    fun createRecipe(
        recipe: RecipeRequest,
        userId: String,
    ): Recipe {
        val userUuid = userId.toUUID()
        recipeRepository.findByNameAndUserId(recipe.name, userUuid).ifPresent {
            throw AlreadyExistsException("Recipe with name '${recipe.name}' already exists.")
        }

        val recipeIngredients =
            recipe.ingredients
                .map {
                    val ingredient =
                        ingredientRepository.findByNameIgnoreCase(it.ingredientName)
                            ?: ingredientRepository.save(Ingredient(name = it.ingredientName))
                    RecipeIngredient(
                        ingredient = ingredient,
                        quantity = it.quantity,
                        unit = it.unit,
                    )
                }.toMutableList()

        val entity =
            Recipe(
                name = recipe.name,
                userId = userUuid,
                ingredients = recipeIngredients,
                instructions = recipe.instructions,
                difficulty = recipe.difficulty,
                tags = recipe.tags?.filter { it.isNotBlank() },
            )

        entity.ingredients.forEach { it.recipe = entity }

        return recipeRepository.save(entity)
    }

    @Transactional
    fun updateRecipe(
        id: String,
        recipe: RecipeRequest,
        userId: String,
    ): Recipe {
        val recipeUuid = id.toUUID()
        val userUuid = userId.toUUID()
        val existingRecipe =
            recipeRepository.findByIdAndUserId(recipeUuid, userUuid).orElseThrow {
                NoSuchElementException("Recipe not found")
            }

        if (existingRecipe.name != recipe.name) {
            recipeRepository.findByNameAndUserId(recipe.name, userUuid).ifPresent {
                throw AlreadyExistsException("Recipe with name '${recipe.name}' already exists.")
            }
        }

        val updatedRecipe =
            existingRecipe.copy(
                id = recipeUuid,
                name = recipe.name,
                instructions = recipe.instructions,
                difficulty = recipe.difficulty,
                tags = recipe.tags?.filter { it.isNotBlank() },
            )

        val updatedIngredients =
            recipe.ingredients
                .map {
                    val ingredient =
                        ingredientRepository.findByNameIgnoreCase(it.ingredientName)
                            ?: ingredientRepository.save(Ingredient(name = it.ingredientName))
                    RecipeIngredient(
                        ingredient = ingredient,
                        quantity = it.quantity,
                        unit = it.unit,
                        recipe = updatedRecipe,
                    )
                }.toMutableList()

        updatedRecipe.ingredients = updatedIngredients

        return recipeRepository.save(updatedRecipe)
    }

    @Transactional
    fun deleteRecipe(
        id: String,
        userId: String,
    ) {
        val recipeUuid = id.toUUID()
        val userUuid = userId.toUUID()
        if (recipeRepository.deleteByIdAndUserId(recipeUuid, userUuid) == 0) {
            throw NoSuchElementException("Recipe not found")
        }
    }
}
