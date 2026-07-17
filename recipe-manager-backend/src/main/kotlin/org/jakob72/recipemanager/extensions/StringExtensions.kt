package org.jakob72.recipemanager.extensions

import java.util.UUID

fun String.toUUID(): UUID = UUID.fromString(this)
