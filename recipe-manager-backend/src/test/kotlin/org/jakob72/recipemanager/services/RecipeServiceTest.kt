package org.jakob72.recipemanager.services

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import io.mockk.clearAllMocks
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.jakob72.recipemanager.TestData
import org.jakob72.recipemanager.data.IngredientRepository
import org.jakob72.recipemanager.data.RecipeRepository
import org.jakob72.recipemanager.exceptions.AlreadyExistsException
import org.jakob72.recipemanager.extensions.toUUID
import java.util.Optional
import java.util.UUID

class RecipeServiceTest : StringSpec({
    val recipeRepository = mockk<RecipeRepository>()
    val ingredientRepository = mockk<IngredientRepository>()

    val service = RecipeService(recipeRepository, ingredientRepository)

    beforeTest { clearAllMocks() }

    "when getAllRecipes is called, then it should return all recipes" {
        // given
        every { recipeRepository.findAllByUserId(TestData.userUuid) } returns listOf(TestData.testRecipe)

        // when
        val result = service.getAllRecipes(TestData.USER_ID)

        // then
        result.size shouldBe 1
        result.first() shouldBe TestData.testRecipe
    }

    "when getAllRecipes is called and no recipes exist, then it should return an empty list" {
        // given
        every { recipeRepository.findAllByUserId(TestData.userUuid) } returns emptyList()

        // when
        val result = service.getAllRecipes(TestData.USER_ID)

        // then
        result.size shouldBe 0
    }

    "when findRecipeById is called with a valid id, then it should return the recipe" {
        // given
        val id = TestData.testRecipe.id.toString()
        every { recipeRepository.findByIdAndUserId(TestData.testRecipe.id!!, TestData.userUuid) } returns
            Optional.of(
                TestData.testRecipe,
            )

        // when
        val result = service.findRecipeById(id, TestData.USER_ID)

        // then
        result shouldBe TestData.testRecipe
    }

    "when findRecipeById is called with an invalid id, then it should throw a NoSuchElementException" {
        // given
        val id = UUID.randomUUID().toString()
        every { recipeRepository.findByIdAndUserId(any(), any()) } returns Optional.empty()

        // when
        val exception =
            shouldThrow<NoSuchElementException> {
                service.findRecipeById(id, TestData.USER_ID)
            }

        // then
        exception.message shouldBe "Recipe not found"
    }

    "when findRecipesByIngredient is called with a valid ingredient name, then it should return the recipes containing that ingredient" {
        // given
        val ingredientName = "Flour"
        every {
            recipeRepository.findByIngredientName(
                ingredientName,
                TestData.userUuid,
            )
        } returns listOf(TestData.testRecipe)

        // when
        val result = service.findRecipesByIngredient(ingredientName, TestData.USER_ID)

        // then
        result.size shouldBe 1
        result.first() shouldBe TestData.testRecipe
    }

    "when findRecipesByIngredient is called with an ingredient name that is not used in any recipe, then it should return an empty list" {
        // given
        val ingredientName = "NonExistentIngredient"
        every { recipeRepository.findByIngredientName(ingredientName, any()) } returns emptyList()

        // when
        val result = service.findRecipesByIngredient(ingredientName, TestData.USER_ID)

        // then
        result.size shouldBe 0
    }

    "when findRecipeByName is called with a valid name, then it should return the recipe" {
        // given
        val name = TestData.testRecipe.name
        every { recipeRepository.findByNameAndUserId(name, TestData.userUuid) } returns Optional.of(TestData.testRecipe)

        // when
        val result = service.findRecipeByName(name, TestData.USER_ID)

        // then
        result shouldBe TestData.testRecipe
    }

    "when findRecipeByName is called with an invalid name, then it should return null" {
        // given
        val name = "NonExistentRecipe"
        every { recipeRepository.findByNameAndUserId(name, any()) } returns Optional.empty()

        // when
        val result = service.findRecipeByName(name, TestData.USER_ID)

        // then
        result shouldBe null
    }

    "when createRecipe is called with a new recipe, then it should create and return the recipe and its ingredients" {
        // given
        val recipeRequest = TestData.testRecipeRequest
        every { recipeRepository.findByNameAndUserId(recipeRequest.name, TestData.userUuid) } returns Optional.empty()
        every { ingredientRepository.findByNameIgnoreCase("Test ingredient") } returns null
        every { ingredientRepository.save(any()) } answers { firstArg() }
        every { recipeRepository.save(any()) } answers { firstArg() }

        // when
        val result = service.createRecipe(recipeRequest, TestData.USER_ID)

        // then
        result.name shouldBe recipeRequest.name
        result.ingredients.size shouldBe recipeRequest.ingredients.size
        result.instructions shouldBe recipeRequest.instructions
        verify(exactly = 1) { ingredientRepository.save(any()) }
        verify(exactly = 1) { recipeRepository.save(any()) }
    }

    "when createRecipe is called with a recipe name that already exists, then it should throw an AlreadyExistsException" {
        // given
        val recipeRequest = TestData.testRecipeRequest
        every {
            recipeRepository.findByNameAndUserId(
                recipeRequest.name,
                any(),
            )
        } returns Optional.of(TestData.testRecipe)

        // when
        val exception =
            shouldThrow<AlreadyExistsException> {
                service.createRecipe(recipeRequest, TestData.USER_ID)
            }

        // then
        exception.message shouldBe "Recipe with name '${recipeRequest.name}' already exists."
        verify(exactly = 0) { ingredientRepository.save(any()) }
        verify(exactly = 0) { recipeRepository.save(any()) }
    }

    "when createRecipe is called with ingredients that already exist, then it should reuse the existing ingredients" {
        // given
        val recipeRequest = TestData.testRecipeRequest
        val existingIngredient = TestData.testIngredient
        every { recipeRepository.findByNameAndUserId(recipeRequest.name, any()) } returns Optional.empty()
        every { ingredientRepository.findByNameIgnoreCase("Test ingredient") } returns existingIngredient
        every { recipeRepository.save(any()) } answers { firstArg() }

        // when
        val result = service.createRecipe(recipeRequest, TestData.USER_ID)

        // then
        result.name shouldBe recipeRequest.name
        result.ingredients.size shouldBe recipeRequest.ingredients.size
        result.ingredients.first().ingredient shouldBe existingIngredient
        result.instructions shouldBe recipeRequest.instructions
        verify(exactly = 0) { ingredientRepository.save(any()) }
    }

    "when updateRecipe is called with a valid id and updated recipe data, then it should update and return the recipe and its ingredients" {
        // given
        val id = TestData.testRecipe.id.toString()
        val updatedRecipeRequest = TestData.updatedTestRecipeRequest
        every { recipeRepository.findByIdAndUserId(TestData.testRecipe.id!!, TestData.userUuid) } returns
            Optional.of(
                TestData.testRecipe,
            )
        every {
            recipeRepository.findByNameAndUserId(
                updatedRecipeRequest.name,
                TestData.userUuid,
            )
        } returns Optional.empty()
        every { ingredientRepository.findByNameIgnoreCase("Updated Test ingredient") } returns null
        every { ingredientRepository.save(any()) } answers { firstArg() }
        every { recipeRepository.save(any()) } answers { firstArg() }

        // when
        val result = service.updateRecipe(id, updatedRecipeRequest, TestData.USER_ID)

        // then
        result.name shouldBe updatedRecipeRequest.name
        result.ingredients.size shouldBe updatedRecipeRequest.ingredients.size
        result.instructions shouldBe updatedRecipeRequest.instructions
        verify(exactly = 1) { ingredientRepository.save(any()) }
        verify(exactly = 1) { recipeRepository.save(any()) }
    }

    "when updateRecipe is called with an invalid id, then it should throw a NoSuchElementException" {
        // given
        val id = UUID.randomUUID().toString()
        val updatedRecipeRequest = TestData.updatedTestRecipeRequest
        every { recipeRepository.findByIdAndUserId(any(), any()) } returns Optional.empty()

        // when
        val exception =
            shouldThrow<NoSuchElementException> {
                service.updateRecipe(id, updatedRecipeRequest, TestData.USER_ID)
            }

        // then
        exception.message shouldBe "Recipe not found"
        verify(exactly = 0) { ingredientRepository.save(any()) }
        verify(exactly = 0) { recipeRepository.save(any()) }
    }

    "when deleteRecipe is called with a valid id, then it should delete the recipe" {
        // given
        val id = TestData.testRecipe.id.toString()
        every { recipeRepository.deleteByIdAndUserId(TestData.testRecipe.id!!, TestData.userUuid) } returns 1

        // when
        service.deleteRecipe(id, TestData.USER_ID)

        // then
        verify(exactly = 1) { recipeRepository.deleteByIdAndUserId(TestData.testRecipe.id!!, TestData.userUuid) }
    }

    "when deleteRecipe is called with an invalid id, then it should throw a NoSuchElementException" {
        // given
        every { recipeRepository.deleteByIdAndUserId(TestData.ID.toUUID(), TestData.userUuid) } returns 0

        // when -> then
        shouldThrow<NoSuchElementException> {
            service.deleteRecipe(TestData.ID, TestData.USER_ID)
        }
    }
})
