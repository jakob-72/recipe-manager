package org.jakob72.recipemanager.data.models

import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.UUID

@Entity
@Table(name = "recipe")
class Recipe(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,
    @Column(nullable = false)
    var name: String,
    @Column(nullable = false, name = "user_id")
    var userId: UUID,
    @OneToMany(
        mappedBy = "recipe",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
    )
    var ingredients: MutableList<RecipeIngredient>,
    @Column(nullable = false)
    var instructions: String,
    @Column(nullable = false)
    var difficulty: Int,
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    var tags: List<String>?,
) {
    fun copy(
        id: UUID? = null,
        name: String? = null,
        ingredients: MutableList<RecipeIngredient>? = null,
        instructions: String? = null,
        difficulty: Int? = null,
        tags: List<String>? = null,
    ) = Recipe(
        id = id ?: this.id,
        userId = this.userId,
        name = name ?: this.name,
        ingredients = ingredients ?: this.ingredients.toMutableList(),
        instructions = instructions ?: this.instructions,
        difficulty = difficulty ?: this.difficulty,
        tags = tags,
    )
}
