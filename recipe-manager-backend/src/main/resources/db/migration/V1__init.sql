-- V1__init.sql

CREATE TABLE recipe
(
    id           UUID PRIMARY KEY,
    user_id      UUID         NOT NULL,
    name         VARCHAR(255) NOT NULL,
    difficulty    INTEGER      NOT NULL,
    tags         jsonb        NULL,
    instructions TEXT         NOT NULL
);

CREATE TABLE ingredient
(
    id   UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE recipe_ingredient
(
    id            UUID PRIMARY KEY,
    recipe_id     UUID             NOT NULL,
    ingredient_id UUID             NOT NULL,
    quantity      DOUBLE PRECISION NOT NULL,
    unit          VARCHAR(64)      NOT NULL,
    CONSTRAINT fk_recipe
        FOREIGN KEY (recipe_id)
            REFERENCES recipe (id)
            ON DELETE CASCADE,
    CONSTRAINT fk_ingredient
        FOREIGN KEY (ingredient_id)
            REFERENCES ingredient (id)
            ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_recipe_name_per_user_id ON recipe (name, user_id);

CREATE INDEX idx_recipe_ingredient_recipe_id_ingredient_id
    ON recipe_ingredient (recipe_id, ingredient_id);

CREATE INDEX idx_recipe_user_id
    ON recipe (user_id);
