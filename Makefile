.PHONY: start

up:
	@./buildEnv.sh
	docker-compose up --build
