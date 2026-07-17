.PHONY: format lint test stack-up stack-down stack-down-full start

format:
	./gradlew ktlintFormat

lint:
	./gradlew ktlintCheck

test:
	./gradlew test

stack-up:
	docker compose up -d

stack-down:
	docker compose down

stack-down-full:
	docker compose down -v --remove-orphans

start:
	./gradlew bootRun
