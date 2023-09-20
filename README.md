## How to run

Install the local dependencies:

```bash
yarn
```

Generate the prisma types on your machine:

```bash
yarn generate
```

Initialize the docker containers:

```bash
docker compose up
```

Install the dependencies in the docker container:

```bash
docker exec -it socorro-facil_web_1 sh -c "yarn"
# and run the postinstall script to generate the prisma types
docker exec -it socorro-facil_web_1 sh -c "yarn postinstall"
```
Now just open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Regenerating the prisma types

If you ever change the prisma types, I'll need to regenerate them on your machine and inside the docker container, so please run:

```bash
yarn generate
# followed by
docker exec -it socorro-facil sh -c "yarn generate"
```
You might need to restart the docker container and your code editor after that.

## Git guidelines

You can follow [git flow](https://danielkummer.github.io/git-flow-cheatsheet/) but usually there's no need for release branches, unless it's a special case where we really want to test something in a production-like environment.
If it's a small thing and staging is in sync with main, which is usually the case, you can just push it straigh into staging and then merge staging into main.
After merging a hotfix, feature or release branch into staging, you can delete the branch.
Feature, hotfix and release branches shouldbe squashed into a single commit before merging into staging/main, but when merging staging into main, you should keep the commits as they are (create a merge commit).