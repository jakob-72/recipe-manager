package org.jakob72.recipemanager.data

import org.jakob72.recipemanager.data.models.Ingredient
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface IngredientRepository : JpaRepository<Ingredient, UUID> {
    fun findByNameIgnoreCase(name: String): Ingredient?
}
