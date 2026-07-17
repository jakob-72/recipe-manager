package org.jakob72.recipemanager.data

import org.jakob72.recipemanager.data.models.Recipe
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.Optional
import java.util.UUID

@Repository
interface RecipeRepository : JpaRepository<Recipe, UUID> {
    fun findAllByUserId(userId: UUID): List<Recipe>

    fun findByIdAndUserId(
        id: UUID,
        userId: UUID,
    ): Optional<Recipe>

    fun findByNameAndUserId(
        name: String,
        userId: UUID,
    ): Optional<Recipe>

    @Query("SELECT r FROM Recipe r JOIN r.ingredients ri JOIN ri.ingredient i WHERE i.name = :ingredientName AND r.userId = :userId")
    fun findByIngredientName(
        ingredientName: String,
        userId: UUID,
    ): List<Recipe>

    @Modifying
    @Query("DELETE FROM Recipe r WHERE r.id = :id AND r.userId = :userId")
    fun deleteByIdAndUserId(
        id: UUID,
        userId: UUID,
    ): Int
}
