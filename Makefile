.PHONY: start up clean re

up:	
	@./buildEnv.sh
	docker-compose -f docker-compose-prod.yml up --build

clean:
	docker system prune -a
	docker volume ls -q | xargs docker volume rm
	@./buildEnv.sh
	docker compose -f docker-compose-prod.yml up --build



updev:
	@./buildEnv.sh
	docker compose -f docker-compose-dev.yml up --build


cleandev:
	docker system prune -a
	docker volume ls -q | xargs docker volume rm
	@./buildEnv.sh
	docker compose -f docker-compose-dev.yml  up --build
