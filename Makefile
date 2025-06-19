.PHONY: start up clean re

up:	
	@./buildEnv.sh
	docker-compose -f docker-compose-prod.yml up --build

clean:
	docker volume ls -q | xargs docker volume rm
	docker system prune -a

down:
	docker compose -f docker-compose-prod.yml down
	docker compose -f docker-compose-dev.yml down



updev:
	@./buildEnv.sh
	docker compose -f docker-compose-dev.yml up --build

start:
	docker compose -f docker-compose-prod.yml up

startdev:
	docker compose -f docker-compose-dev.yml up

