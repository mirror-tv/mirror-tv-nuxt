# mirror-tv-nuxt

**Note: requires Node.js v14.x**

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## How CI/CD works?
We use [Google Cloud Build](https://cloud.google.com/build/docs/how-to) to do CI/CD.
And we already have a build trigger([mirror-tv-nuxt-build-and-deploy](https://console.cloud.google.com/cloud-build/triggers/edit/45defb92-e447-4d70-a0f3-c6b0696208a3?project=mirror-tv-275709)) connected to this repo.

For quick understanding how the CI/CD works, please see the following diagram.

<img src="https://github.com/mirror-media/mirror-tv-nuxt/blob/dev/docs/images/ci-cd-diagram.jpg" >

### Three Branches to Control CI/CD
Three branches are `dev`, `staging` and `prod` respectively.

When new codes are merged into these three branches, they are also built and deployed to three environemts.

If we want to deploy new commits to `dev` environemt, we do
1. create a PR: `base` is `dev` branch, and `compare` is the branch containing new commits
2. ask code reviews
3. merge the PR

After the PR merged, our cloud build trigger ([mirror-tv-nuxt-build-and-deploy](https://console.cloud.google.com/cloud-build/triggers/edit/45defb92-e447-4d70-a0f3-c6b0696208a3?project=mirror-tv-275709)) will start to run.

### What Cloud Build Does?
The cloud build will
1. clone mirror-tv-nuxt
2. checkout `dev` branch
3. install app's depencies (`yarn install`) and create app's the bundles (`yarn build`) 
4. build docker image: image name will be `gcr.io/mirror-tv-275709/mirror-tv-nuxt`, and tag will be `dev_fd120b5` (see Note 1) for example.
5. push docker image to Google Container Registry (see Note 2)
6. clone [mirror-media/kubernetes-configs](https://github.com/mirror-media/kubernetes-configs)
7. generate kubernetes configs with `namespace: dev` 
8. apply generated kubernetes configs to `tv-cluster`

Note:
1. Branch name, for example `dev`, will be part of tag name. `fd120b5` is the first seven characters of the commit ID associated with your build.
2. You can list image tags in the [Google Container Registry](https://console.cloud.google.com/gcr/images/mirror-tv-275709/GLOBAL/mirror-tv-nuxt?project=mirror-tv-275709&gcrImageListsize=30).

### How to Deploy to Staging?
If `dev` environment is deployed and tested, we could move on to deploy `staging` environment.
For deploying `staging` environment, we do 
1. create a PR: `base` is `staging` branch, and `compare` is `dev` branch
2. ask PM if we could deploy or not
3. if we could deploy, then merge the PR

After merging that PR, the cloud build will follow the above steps to build a new image tag, `staging_39639fe` for example, and deploy it to `staging` environment.

### How to Deploy to Production?
For deploying to `prod` environment, we do almost the same thing as deploying to `staging`.
Just create a new PR. `base` is `prod` branch and `compare` is `staging` branch instead.
However, there is one thing to mention, **we must confirm with PM before merging this PR**.
