git-commit-msg:
	echo "npx commitlint --edit"

git-pre-commit:
	npx lint-staged
#	npm run lint
#	npm run prettier-format