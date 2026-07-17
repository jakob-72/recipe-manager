package org.jakob72.recipemanager.data.dto

import jakarta.validation.Valid
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.Size

data class RecipeRequest(
    @field:NotBlank
    @field:Size(max = 255)
    val name: String,
    @field:NotEmpty
    @field:Valid
    val ingredients: List<RecipeIngredientDto>,
    @field:NotBlank
    @field:Size(max = 8_000)
    val instructions: String,
    @field:Min(value = 1, message = "Amount must be greater than or equal to 1")
    @field:Max(value = 5, message = "Amount must be less than or equal to 5")
    val difficulty: Int,
    val tags: List<String>? = null,
)

data class RecipeIngredientDto(
    @field:NotBlank
    val ingredientName: String,
    @field:Positive(message = "Quantity must be greater than 0")
    val quantity: Double,
    @field:NotBlank
    val unit: String,
)
