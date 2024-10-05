.PHONY: gitlab-install local update-gems help

gitlab-install: ## Release changes in Gitlab runner
	@echo "Installing npm packages..."
	npm install
	@echo "Installing gulp-cli globally..."
	npm install -g gulp-cli
	@echo "Installing Ruby gems..."
	bundle install
	@echo "Updating Ruby gems..."
	bundle update
	@echo "Running gulp release task..."
	gulp release

local: ## Test changes locally
	@echo "Running gulp task..."
	gulp

release: ## Build changes locally
	@echo "Running gulp task to just build artifacts..."
	gulp release

update-gems: ## Update ruby gems
	@echo "Updating Ruby gems..."
	bundle update

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
