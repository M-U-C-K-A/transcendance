.PHONY: start up clean re

up:
	@./buildEnv.sh
	docker-compose up --build

clean:
	docker compose down
	docker system prune -a -f
	@volumes=$$(docker volume ls -q); [ -z "$$volumes" ] || docker volume rm $$volumes

re: clean
	@./buildEnv.sh
	docker-compose up --build
