git-commit-msg:
	echo "npx commitlint --edit"

git-pre-commit:
	npm run lint
	npm run prettier-format