# ServiceNow SBOM Upload

Use this action to upload and optionally check the status of the SBOM on ServiceNow.

> **Product Links**
>
> - ServiceNow [Vulnerability Response](https://www.servicenow.com/products/vulnerability-response.html#features)
> - Vulnerability Response [technical documentation](https://docs.servicenow.com/bundle/tokyo-security-management/page/product/vulnerability-response/reference/vuln-landing-page.html)

# Usage

This action facilitates uploading a SBOM document to the SBOM Workspace. Configuring the action input parameter's `provider`, `repository`, `ref` and `path` values determines which SBOM document the action will upload.

### Prerequisites

- The Vulnerability Response application must already be installed on the provided ServiceNow instance
- The following repository secrets must be set:

  | Secret Name        | Example                             | Description                                                                                                                                                                                                            |
    | ------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `SN_INSTANCE_URL`  | `https://instance.service-now.com/` | The URL of the ServiceNow instance with an accessible SBOM Workspace. Ensure the URL has the _scheme_ (`https`), _subdomain_ (`instance`), _domain_ (`service-now`), and _top-level domain_ (`com`) for your instance. |
  | `SN_SBOM_USER`     | `username`                          | The username used to log into the ServiceNow instance. The user should have _sbom_ingest_ role assigned to it.                                                                                                         |
  | `SN_SBOM_PASSWORD` | `password`                          | The password used to log into the ServiceNow instance. The user should have _sbom_ingest_ role assigned to it.                                                                                                         |
  | `GH_TOKEN`         | `gh_78dajnkrffj2806fuz7578o`        | A GitHub token used to access the repository that is storing the SBOM document.                                                                                                                                        |

  > The `GH_TOKEN` must be generated with the [`repo`](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps#:~:text=Grants%20full%20access,owned%20by%20users.) scope.

  > GitHub repository secrets [documentation](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).

### Usage

The action may be launched from any supported [GitHub Action trigger](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows). The example below is sensitive to `push` events.

```yml
on: [push]

jobs:
  sbom-upload:
    runs-on: ubuntu-latest
    name: SBOM Workspace Upload
    steps:
      - name: Upload
        id: upload
        uses: ServiceNow/vulnerability-response@2.0.1
        with:
          snSbomUser: ${{ secrets.SN_SBOM_USERNAME }}
          snSbomPassword: ${{ secrets.SN_SBOM_PASSWORD }}
          snInstanceUrl: ${{ secrets.SN_INSTANCE_URL }}
          ghToken: ${{ secrets.GH_TOKEN }}
          ghAccountOwner: <REPOSITORY OWNER>
          repository: <REPOSITORY NAME>
          provider: "repository"
          path: "sboms/sample_sbom.txt"
```

**Non-Optional, Public Inputs: Configuration**

> These inputs configure the behavior of the action.

| Input Name       | Example                           | Description                                                                                                                                                                                                                                                                                                          |
| ---------------- | --------------------------------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `ghAccountOwner` | `github-account`                  | The account that owns the target repository.                                                                                                                                                                                                                                                                         |
| `repository`     | `github-repository`               | The name of the repository that holds the target SBOMs.                                                                                                                                                                                                                                                              |
| `provider`       | `repository` \| `dependencyGraph` | The value `repository` means an SBOM will be picked from a GitHub repository. The SBOM at the `ghAccountOwner/repository/path` will be picked. The value of `dependencyGraph` will generate an SBOM using GitHub's Dependency Graph API. The SBOM will be generated for the `ghAccountOwner/repository` application. |
| `path`           | `sboms/sample_sbom.json`          | The absolute path within the provided `repository` to the SBOM document.                                                                                                                                                                                                                                             |
| `ref` | `main` | The branch, commit, or tag where the targetted file can be found.                                                                                                                                                                                                                                                    |

**Optional, Public Inputs: API Parameters**

> These inputs are passed as search parameters to underlying SBOM Workspace `upload` endpoint. Refer to API documentation for further details.

| Input Name                | Type                           | Description                                                                        |
| ------------------------- | ------------------------------ | ---------------------------------------------------------------------------------- |
| `businessApplicationId`   | `<Sys ID>`                     | SYS ID of the business application to map with the root application of given SBOM. |
| `businessApplicationName` | `String`                       | Name of business application to map with the root application of given SBOM.       |
| `buildId`                 | `String`                       | Build ID of the SBOM build.                                                        |
| `productModelId`          | `<Sys ID>`                     | SYS ID of product model to map with the root application of given SBOM.            |
| `requestedBy`             | `Boolean`                      | Determines if devops workflow is executed.                                         |
| `lifecycleStage`          | `production \| pre_production` | Life cycle stage of the entity (i.e., production, pre_production).                 |
| `fetchVulnerabilityInfo`  | `Boolean`                      | Flag to run the vulnerability intelligence integration.                            |
| `fetchPackageInfo`        | `Boolean`                      | Flag to run the package intelligence integration.                                  |
| `sbomSource`              | `String`                       | The source of the SBOM.                                                            |
| `maxStatusPollAttempts`   | `String` (Number)              | The maximum number of status poll attempts before action errors out.               |
| `statusAttemptInterval`   | `String` (Number)              | The number of milliseconds between each status poll attempt.                       |

**Non-Optional, Secret Inputs**

| Secret Name      | Example                             | Description                                                                            |
| ---------------- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| `snSbomUser`     | `username`                          | The username used to authenticate into the instance that has SBOM Workspace installed. |
| `snSbomPassword` | `password`                          | The password used to authenticate into the instance that has SBOM Workspace installed. |
| `snInstanceUrl`  | `https://instance.service-now.com/` | The URL of the ServiceNow instance that has SBOM Workspace installed.                  |
| `ghToken`        | `gh_78dajnkrffj2806fuz7578o`        | A GitHub token used to access the repository that is storing the SBOM document.        |

**Annotated Fields**

- `uses`: Points to the ServiceNow SBOM Upload GitHub Action. Replace `<RELEASE TAG>` with the [appropriate version](https://github.com/ServiceNow/vulnerability-response/releases) of the Action.
- `gh-account-owner`: The account name that owns the target repository. Replace `<REPOSITORY OWNER>` with the appropriate account owner string. It can be found within the URL of the calling repository.
- `repository`: The repository name that holds the target SBOM document. Replace `<REPOSITORY NAME>` with the appropriate repository string. It can be found within the URL of the calling repository.

### Results

On successful upload, the following output is display, indicating the SBOM has been uploaded and is enqueued for processing:

```js
{
  result: {
    status: 'success',
    message: 'Queued for processing.',
    bomRecordId: 'abc123xyzabc123xyzabc123xyzabc123'
  }
}
```

To view vulnerability or package intelligence information within the GitHub Summary, set `fetchVulnerabilityInfo` or `fetchPackageInfo` to `'true'`.

---

### Complete Example Workflow

The following workflow is an example use of the SBOM Action. Not all values are required.

> For a given input value, a default can be set using the following syntax:
>
> `path: ${{ inputs.path || 'sboms/sample_sbom.json' }}`

```yml
on:
  push:
    paths:
      - "package.json"
      - "pnpm-lock.yaml"
  workflow_dispatch:
    inputs:
      gh-account-owner:
        description: "The account that owns the target SBOM repository."
        required: true
      provider:
        description: "The provider type for the action."
        required: true
        type: choice
        default: "repository"
        options:
          - repository
          - dependencyGraph
      repository:
        description: "The repository that holds the target SBOM documents."
        required: true
      path:
        description: "The path to the target SBOM document."
        required: true
      lifecycle-stage:
        description: "Denotes which environment for which this SBOM was generated (i.e., production, pre_production)."
        required: false
      fetch-package-info:
        description: "Fetch Package Info"
        required: false
        default: "true"
      fetch-vulnerability-info:
        description: "Fetch Vulnerability Info"
        required: false
        default: "true"
      max-status-poll-attempts:
        description: "The maximum number of status poll attempts."
        required: false
        default: "5"
      status-attempt-interval:
        description: "The time in ms between status poll attempts."
        required: false
        default: "10000"

jobs:
  sbom-upload:
    runs-on: ubuntu-latest
    name: SBOM Workspace Upload
    steps:
      - name: Upload
        id: upload
        uses: ServiceNow/vulnerability-response@v2.0.1
        with:
          snSbomUser: ${{ secrets.SN_SBOM_USERNAME }}
          snSbomPassword: ${{ secrets.SN_SBOM_PASSWORD }}
          snInstanceUrl: ${{ secrets.SN_INSTANCE_URL }}
          ghToken: ${{ secrets.GH_TOKEN }}
          ghAccountOwner: ${{ inputs.gh-account-owner }}
          provider: ${{ inputs.provider }}
          repository: ${{ inputs.repository }}
          path: ${{ inputs.path }}
          businessApplicationId: ${{ inputs.business-application-id }}
          businessApplicationName: ${{ inputs.business-application-name }}
          buildId: ${{ inputs.build-id }}
          productModelId: ${{ inputs.product-model-id }}
          requestedBy: ${{ inputs.requested-by }}
          lifecycleStage: ${{ inputs.lifecycle-stage }}
          fetchVulnerabilityInfo: ${{ inputs.fetch-vulnerability-info }}
          fetchPackageInfo: ${{ inputs.fetch-package-info }}
          sbomSource: ${{ inputs.source-sbom }}
          maxStatusPollAttempts: ${{ inputs.max-status-poll-attempts }}
          statusAttemptInterval: ${{ inputs.status-attempt-interval }}
```
> Note: A `workflow_dispatch` event populates the `inputs` object whereas `push` will not. To enable functionality across both events, set a default value explicitly on the action's input:
> ``` yml
> jobs:
>   sbom-upload:
>   runs-on: ubuntu-latest
>   name: SBOM Workspace Upload
>   steps:
>     - name: Upload
>       id: upload
>       uses: ServiceNow/vulnerability-response@v1.0.0
>       with:
>         // Truncated for brevity...
>         ghAccountOwner: ${{ inputs.gh-account-owner || 'DEFAULT VALUE' }}
> ```
