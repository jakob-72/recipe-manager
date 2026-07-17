package org.jakob72.recipemanager.controller

import jakarta.validation.Valid
import org.jakob72.recipemanager.data.dto.RecipeRequest
import org.jakob72.recipemanager.data.dto.RecipeResponse
import org.jakob72.recipemanager.data.dto.toResponse
import org.jakob72.recipemanager.services.RecipeService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
@CrossOrigin(
    origins = ["*"],
    methods = [RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE],
)
class RecipeController(private val service: RecipeService) {
    @GetMapping("/recipes")
    fun getAllRecipes(
        @RequestParam(required = false) ingredient: String?,
        @RequestParam(required = false) name: String?,
        @AuthenticationPrincipal jwt: Jwt,
    ): ResponseEntity<List<RecipeResponse>> {
        val userId = jwt.userIdOrThrow()
        val recipes =
            when {
                !ingredient.isNullOrBlank() -> service.findRecipesByIngredient(ingredient, userId)
                !name.isNullOrBlank() -> service.findRecipeByName(name, userId)?.let { listOf(it) } ?: emptyList()
                else -> service.getAllRecipes(userId)
            }
        return ResponseEntity.ok(recipes.map { it.toResponse() })
    }

    @GetMapping("/recipes/{id}")
    fun getRecipeById(
        @PathVariable id: String,
        @AuthenticationPrincipal jwt: Jwt,
    ): ResponseEntity<RecipeResponse> {
        val userId = jwt.userIdOrThrow()
        return ResponseEntity.ok(service.findRecipeById(id, userId).toResponse())
    }

    @PostMapping("/recipes", consumes = ["application/json"])
    fun createRecipe(
        @Valid @RequestBody recipe: RecipeRequest,
        @AuthenticationPrincipal jwt: Jwt,
    ): ResponseEntity<RecipeResponse> {
        val userId = jwt.userIdOrThrow()
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createRecipe(recipe, userId).toResponse())
    }

    @PutMapping("/recipes/{id}", consumes = ["application/json"])
    fun updateRecipe(
        @PathVariable id: String,
        @Valid @RequestBody recipe: RecipeRequest,
        @AuthenticationPrincipal jwt: Jwt,
    ): ResponseEntity<RecipeResponse> {
        val userId = jwt.userIdOrThrow()
        return ResponseEntity.ok(service.updateRecipe(id, recipe, userId).toResponse())
    }

    @DeleteMapping("/recipes/{id}")
    fun deleteRecipe(
        @PathVariable id: String,
        @AuthenticationPrincipal jwt: Jwt,
    ): ResponseEntity<Void> {
        val userId = jwt.userIdOrThrow()
        service.deleteRecipe(id, userId)
        return ResponseEntity.noContent().build()
    }

    private fun Jwt.userIdOrThrow(): String = subject ?: throw UsernameNotFoundException("Missing subject claim")
}
