package org.jakob72.recipemanager.controller

import com.ninjasquad.springmockk.MockkBean
import io.mockk.clearAllMocks
import io.mockk.every
import org.jakob72.recipemanager.TestData
import org.jakob72.recipemanager.exceptions.AlreadyExistsException
import org.jakob72.recipemanager.services.RecipeService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(controllers = [RecipeController::class])
class RecipeControllerTest(
    @param:Autowired val mockMvc: MockMvc,
) {
    @MockkBean
    lateinit var service: RecipeService

    @BeforeEach
    fun setup() = clearAllMocks()

    @Test
    fun `GET recipes should return list of recipes`() {
        every { service.getAllRecipes(any()) } returns listOf(TestData.testRecipe)

        mockMvc
            .perform(get("/api/recipes").with(jwt()))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].name").value("Test Recipe"))
    }

    @Test
    fun `GET recipes with no recipes should return empty list`() {
        every { service.getAllRecipes(any()) } returns emptyList()

        mockMvc
            .perform(get("/api/recipes").with(jwt()))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(0))
    }

    @Test
    fun `GET recipes by ingredient should return list of recipes`() {
        every { service.findRecipesByIngredient("Tomato", any()) } returns listOf(TestData.testRecipe)

        mockMvc
            .perform(get("/api/recipes").param("ingredient", "Tomato").with(jwt()))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].name").value("Test Recipe"))
    }

    @Test
    fun `GET recipes by name should return list of recipes`() {
        every { service.findRecipeByName("Test Recipe", any()) } returns TestData.testRecipe

        mockMvc
            .perform(get("/api/recipes").param("name", "Test Recipe").with(jwt()))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].name").value("Test Recipe"))
    }

    @Test
    fun `GET recipes by name with no match should return empty list`() {
        every { service.findRecipeByName("Nonexistent Recipe", any()) } returns null

        mockMvc
            .perform(get("/api/recipes").param("name", "Nonexistent Recipe").with(jwt()))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()").value(0))
    }

    @Test
    fun `GET recipe by ID should return recipe`() {
        every { service.findRecipeById(TestData.ID, any()) } returns TestData.testRecipe

        mockMvc
            .perform(get("/api/recipes/${TestData.ID}").with(jwt()))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.name").value("Test Recipe"))
    }

    @Test
    fun `GET recipe by ID with no match should return 404`() {
        every { service.findRecipeById(TestData.ID, any()) } throws NoSuchElementException()

        mockMvc
            .perform(get("/api/recipes/${TestData.ID}").with(jwt()))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `GET recipe by ID with invalid UUID should return 400`() {
        every { service.findRecipeById("invalid-uuid", any()) } throws IllegalArgumentException()

        mockMvc
            .perform(get("/api/recipes/invalid-uuid").with(jwt()))
            .andExpect(status().isBadRequest)
    }

    @Test
    fun `POSTing a new recipe should return 201`() {
        every { service.createRecipe(any(), any()) } returns TestData.testRecipe

        mockMvc
            .perform(
                post("/api/recipes")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "name": "Test Recipe",
                            "ingredients": [
                                {
                                    "ingredientName": "Test ingredient",
                                    "quantity": 2.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "Test instructions",
                            "difficulty": 4
                        }
                        """.trimIndent(),
                    ).with(jwt()),
            ).andExpect(status().isCreated)
            .andExpect(jsonPath("$.name").value("Test Recipe"))
    }

    @Test
    fun `POST an existing recipe should return 409`() {
        every {
            service.createRecipe(
                any(),
                any(),
            )
        } throws AlreadyExistsException("Recipe with name 'Test Recipe' already exists.")

        mockMvc
            .perform(
                post("/api/recipes")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "name": "Test Recipe",
                            "ingredients": [
                                {
                                    "ingredientName": "Test ingredient",
                                    "quantity": 2.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "Test instructions",
                            "difficulty": 4
                        }
                        """.trimIndent(),
                    ).with(jwt()),
            ).andExpect(status().isConflict)
    }

    @Test
    fun `POSTing a new recipe with missing fields should return 422`() {
        mockMvc
            .perform(
                post("/api/recipes")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "ingredients": [
                                {
                                    "ingredientName": "Test ingredient",
                                    "quantity": 2.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "Test instructions"
                        }
                        """.trimIndent(),
                    ).with(jwt()),
            ).andExpect(status().isUnprocessableEntity)
    }

    @Test
    fun `POSTing a new recipe with difficulty value beyond validity should return 422`() {
        every { service.createRecipe(any(), any()) } returns TestData.testRecipe

        mockMvc
            .perform(
                post("/api/recipes")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "name": "Test Recipe",
                            "ingredients": [
                                {
                                    "ingredientName": "Test ingredient",
                                    "quantity": 2.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "Test instructions",
                            "difficulty": 99
                        }
                        """.trimIndent(),
                    ).with(jwt()),
            ).andExpect(status().isUnprocessableEntity)
    }

    @Test
    fun `PUTting an existing recipe should return 200`() {
        every { service.updateRecipe(TestData.ID, any(), any()) } returns TestData.testRecipe

        mockMvc
            .perform(
                put("/api/recipes/${TestData.ID}")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "name": "Updated Recipe",
                            "ingredients": [
                                {
                                    "ingredientName": "Updated ingredient",
                                    "quantity": 3.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "Updated instructions",
                            "difficulty": 3,
                            "tags": ["updated", "test"]
                        }
                        """.trimIndent(),
                    ).with(jwt()),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$.name").value("Test Recipe"))
    }

    @Test
    fun `PUTting a non-existing recipe should return 404`() {
        every { service.updateRecipe("non-existent-id", any(), any()) } throws NoSuchElementException()

        mockMvc
            .perform(
                put("/api/recipes/non-existent-id")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "name": "Updated Recipe",
                            "ingredients": [
                                {
                                    "ingredientName": "Updated ingredient",
                                    "quantity": 3.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "Updated instructions",
                            "difficulty": 3,
                            "tags": ["updated", "test"]
                        }
                        """.trimIndent(),
                    ).with(jwt()),
            ).andExpect(status().isNotFound)
    }

    @Test
    fun `PUTting a recipe with invalid UUID should return 400`() {
        every { service.updateRecipe("invalid-uuid", any(), any()) } throws IllegalArgumentException()

        mockMvc
            .perform(
                put("/api/recipes/invalid-uuid")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "name": "Updated Recipe",
                            "ingredients": [
                                {
                                    "ingredientName": "Updated ingredient",
                                    "quantity": 3.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "Updated instructions",
                            "difficulty": 3,
                            "tags": ["updated", "test"]
                        }
                        """.trimIndent(),
                    ).with(jwt()),
            ).andExpect(status().isBadRequest)
    }

    @Test
    fun `PUTting a recipe with missing fields should return 422`() {
        mockMvc
            .perform(
                put("/api/recipes/${TestData.ID}")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "ingredients": [
                                {
                                    "ingredientName": "Updated ingredient",
                                    "quantity": 3.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "Updated instructions"
                        }
                        """.trimIndent(),
                    ).with(jwt()),
            ).andExpect(status().isUnprocessableEntity)
    }

    @Test
    fun `DELETing an existing recipe should return 204`() {
        every { service.deleteRecipe(TestData.ID, any()) } returns Unit

        mockMvc
            .perform(delete("/api/recipes/${TestData.ID}").with(jwt()))
            .andExpect(status().isNoContent)
    }

    @Test
    fun `DELETing a non-existing recipe should return 404`() {
        every { service.deleteRecipe("non-existent-id", any()) } throws NoSuchElementException()

        mockMvc
            .perform(delete("/api/recipes/non-existent-id").with(jwt()))
            .andExpect(status().isNotFound)
    }

    @Test
    fun `DELETing a recipe with invalid UUID should return 400`() {
        every { service.deleteRecipe("invalid-uuid", any()) } throws IllegalArgumentException()

        mockMvc
            .perform(delete("/api/recipes/invalid-uuid").with(jwt()))
            .andExpect(status().isBadRequest)
    }

    @Test
    fun `GET recipes without JWT should return 401`() {
        mockMvc
            .perform(get("/api/recipes"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `GET recipe by ID without JWT should return 401`() {
        every { service.findRecipeById(TestData.ID, any()) } returns TestData.testRecipe

        mockMvc
            .perform(get("/api/recipes/${TestData.ID}"))
            .andExpect(status().isUnauthorized)
    }

    @Test
    fun `POSTing a new recipe without JWT should return 401`() {
        every { service.createRecipe(any(), any()) } returns TestData.testRecipe

        mockMvc
            .perform(
                post("/api/recipes")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "name": "New Recipe",
                            "ingredients": [
                                {
                                    "ingredientName": "New ingredient",
                                    "quantity": 1.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "New instructions"
                        }
                        """.trimIndent(),
                    ),
            ).andExpect(status().isForbidden)
    }

    @Test
    fun `PUTting an existing recipe without JWT should return 401`() {
        every { service.updateRecipe(TestData.ID, any(), any()) } returns TestData.testRecipe

        mockMvc
            .perform(
                put("/api/recipes/${TestData.ID}")
                    .contentType("application/json")
                    .content(
                        """
                        {
                            "name": "Updated Recipe",
                            "ingredients": [
                                {
                                    "ingredientName": "Updated ingredient",
                                    "quantity": 3.5,
                                    "unit": "tests"
                                }
                            ],
                            "instructions": "Updated instructions"
                        }
                        """.trimIndent(),
                    ),
            ).andExpect(status().isForbidden)
    }

    @Test
    fun `DELETing an existing recipe without JWT should return 401`() {
        every { service.deleteRecipe(TestData.ID, any()) } returns Unit

        mockMvc
            .perform(delete("/api/recipes/${TestData.ID}"))
            .andExpect(status().isForbidden)
    }
}
