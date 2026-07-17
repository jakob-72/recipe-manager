package org.jakob72.recipemanager.exceptions

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.AuthenticationException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(AlreadyExistsException::class)
    fun handleAlreadyExistsException(e: AlreadyExistsException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.CONFLICT).body(e.message).also { logger.warn("Conflict: ${e.message}") }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(e: IllegalArgumentException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.message).also { logger.warn("Bad Request: ${e.message}") }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleHttpMessageNotReadableException(e: HttpMessageNotReadableException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Malformed JSON request: ${e.message}")
            .also { logger.warn("Malformed JSON: ${e.message}") }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleConstraintViolationException(e: MethodArgumentNotValidException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
            .body(
                e.bindingResult.fieldErrors
                    .map { it.field }
                    .distinct()
                    .sorted()
                    .joinToString(prefix = "Invalid fields: ", separator = ", ")
                    .ifBlank { "Validation failed" },
            ).also {
                logger.warn(
                    "ConstraintViolationException: invalid fields=${
                        e.bindingResult.fieldErrors.map { error -> error.field }.distinct().sorted()
                    }",
                )
            }

    @ExceptionHandler(NoSuchElementException::class)
    fun handleNoSuchElementException(e: NoSuchElementException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found")
            .also { logger.warn("NoSuchElementException: ${e.message}") }

    @ExceptionHandler(AuthenticationException::class)
    fun handleAuthenticationException(e: AuthenticationException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: ${e.message}")
            .also { logger.warn("AuthenticationException: ${e.message}") }

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDeniedException(e: AccessDeniedException): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: ${e.message}")
            .also { logger.warn("AccessDeniedException: ${e.message}") }

    @ExceptionHandler(Exception::class)
    fun handleGenericException(e: Exception): ResponseEntity<String> =
        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
            "An unexpected error occurred: ${e.message}",
        ).also { logger.error("Unexpected exception", e) }
}
