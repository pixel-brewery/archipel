---
title: Releases and public handover
description: Verified package publication, repository protection and the Pixel Brewery source-history cutover.
order: 30
---

# Releases and public handover

Archipel's maintained workflows prepare unattended publication after verified
pull requests merge into `main`. The publication boundary is the public
`pixel-brewery/archipel` repository with immutable ID `1441080766`. A repository
with the same name but another ID, a fork, a private repository or another branch
cannot publish through this path.

## Version and artifact contract

The `platform` group contains 25 libraries and the documentation MCP CLI. The
`prisma-generators` group contains the two Prisma generators. Each group retains
its fixed-version relationship and tag pattern: `v<version>` and
`prisma-generators-v<version>`. A normal source merge requests a patch increment
for both groups. Maintainers can request `minor` or `major` through the release
workflow's dispatch input, including `yarn release:minor` and
`yarn release:major`.

The prepared candidate has one parent: the exact source revision that requested
publication. Only package versions, coordinated internal dependency ranges,
changelogs, the lockfile and regenerated API documentation may change. The
candidate bundle includes both annotated tags and a manifest listing exactly 28
packages. Source identities, both group versions, tag targets and allowed changes
are verified again when importing the bundle.

Linux, macOS and Windows run the same complete source, tooling, documentation,
unit-test and ESM build checks on that prepared commit. The Ubuntu verification
job additionally packs each package, verifies all exported and CLI entry points,
checks the MIT notice and rejects private configuration, source files, tests and
source maps from the actual packed file list. The built MCP documentation corpus
must match the current source Markdown files byte for byte. It records each tarball's SHA-512
integrity in the publication manifest.

The publisher installs no dependencies and runs no package lifecycle scripts.
After rechecking the public repository and current main revision, it atomically
pushes the prepared main commit and both tags. It uploads only the verified
archives, verifies every exact public registry version and downloaded archive,
and creates one GitHub Release per group. Publication requests the documentation
workflow explicitly because the metadata commit contains `[skip ci]`.

All npm and GitHub Actions update types, including major versions, TypeScript
and published Pixel Brewery packages, use the full existing protected gate:
three successful platform jobs and `Quality Gate`. The canonical owner is
`infra/nx-plugins/src/executors/dependabot`, with shared proof in its private
`lib/github` modules. Trusted native Node bootstraps that same owner without an
installation, preserving the private Nx architecture.

The privileged controller executes only the trusted default-branch Nx owner,
without installing workspace dependencies or executing PR code or PR artifacts.
Its `merge`, `reconcile`, `authorize` and `continue` operations are non-cacheable.
Branch refresh and merge have Contents/PR write with Actions read. A separate
`authorize` job has only Contents read, PR read and Actions write. It approves
workflow execution through GitHub's native run-approval endpoint; it creates no
PR review, status, check or branch-rule exemption.

Reconciliation after verification/release completion and hourly checks bounded
same-repository bot inventories. A stale branch uses `expected_head_sha` and waits
for the replacement. Only real `pull_request` CI is merge proof. If it is waiting
for execution approval, the isolated authorizer verifies the exact Dependabot or
GitHub Actions service identity of both run actors before one approval request.
A missing native run remains pending. Manual diagnostic `workflow_dispatch` runs
remain available but cannot satisfy protected PR checks or shadow a native run.
Conflicts, real failures and rejected approvals retain the affected PR and attempt.

For every approval and merge, M is current protected main, B the unchanged bot
head, and C GitHub's actual `refs/pull/<number>/merge` commit. The owner checks
unique own-repository PR association, M as ancestor of B, C's ordered parents
[M, B] and C's tree equal to B. Source blobs are verified by Git object digest.
Only the fixed reviewed read-only CI baseline in trusted-main
`verificationPolicy.reviewedCiSha256` authorizes execution: its normalized main
SHA-256 must match that constant, and normalized PR CI must equal normalized main.
Normalization changes only full 40-character action pins with the same action
owner/path and optional SemVer comments. CI logic, scopes, secrets or syntax edits
require a conscious read-only review and explicit policy-digest update; no runtime
or PR input learns a new baseline. This positive review proof does not rely on a
partial YAML parser.

The latest eligible native run is selected independently of diagnostics and its
actual current `run_attempt` is reloaded. All actual jobs must succeed. Ordinary
maintainer-triggered native CI on the bot PR is valid after the same complete
source proof. A later reconciliation re-enters the full merger after a transient
skip, never a reduced path. Workflow/run/PR/M/B/C/protection are re-read immediately
before the ordinary SHA-guarded squash request. GitHub's strict required checks
remain the final merge authority; the actual closed, merged PR is then confirmed.

Confirmed merge outputs from either reconciliation or the CI event reach a
separate continuation job. Recovery resolves the current main commit association
and reads the full PR with `merged: true`; missing confirmation starts nothing.
Main verification receives `expected_head_sha`, and the existing patch release
retains `source_sha`. Existing exact-source main `push` or `workflow_dispatch` runs
are retained in every state, including queued, failed and cancelled. Diagnostic
branch runs do not suppress them. Every new request rechecks current main; a
superseding revision stops it. Interrupted requests can therefore be retried
without merging twice or preparing a duplicate release. Failed releases retain
their original source and artifact instead of receiving a blind new dispatch.

The separate continuation also preserves the existing all-main-push documentation
workflow with `expected_head_sha`. Release requests select `release.yml`,
`specifier: patch` and the confirmed merge as `source_sha`; release preflight
rejects another selected revision. The existing release App remains exclusive to
verified metadata publication. Human merges retain their ordinary main-push path.

The documentation MCP server reports its own installed package version in the
MCP initialization response. It reads the adjacent package manifest in source,
build and installed layouts; a real stdio-client test compares that value with
the built manifest. No server-version literal needs a separate release update.

## Credentials and main protection

Registry uploads and GitHub Release APIs use the repository's short-lived native
`GITHUB_TOKEN`. The native token receives write permissions only in its owning
publication job. Dependency installation and source verification receive read
permissions. No script retrieves a named personal account's token.

Only the atomic main/tag push uses the private **Pixel Brewery Releases** App,
ID `5547670`, with Contents write and Metadata read for this repository. Set
repository variable `RELEASE_APP_ID` and environment secret
`RELEASE_APP_PRIVATE_KEY`. Store the key only in `release-main`, whose deployment
policy allows exactly type `branch`, pattern `main`, without a reviewer or wait
timer. Do not configure a same-named repository or organization secret fallback.
This credential authenticates CI; it is independent of a maintainer's browser
login and never belongs in source, an issue or a chat.

The checked-in main PR rule specifies resolved conversations and these exact checks from
GitHub Actions integration `15368`, with strict current-base checking:

- `verify (ubuntu-latest)`
- `verify (macos-latest)`
- `verify (windows-latest)`
- `Quality Gate`

The verification workflow also emits a stable `Quality Gate` after the complete
platform matrix. It always runs and succeeds only when every platform succeeds;
failed, cancelled or skipped verification fails the gate. Pull requests,
merge-queue groups and manual verification run the same checks. Each pull
request, including Dependabot updates, gets its required checks from the pull
request run. Main releases call this same reusable workflow for the exact
prepared candidate, including the gate, before publication. The gate does not
publish or need source checkout, dependencies or repository permissions.

The checked-in protection payload includes all four contexts. Configure the live
rule only after the workflow revision is published and each required context is
observed from GitHub Actions. Read back the active protection independently;
editing the workflow or policy payload changes no GitHub setting by itself.

The sole-maintainer configuration has zero required approving reviews and retains
`@RueDeRennes` as CODEOWNER. Only release App `5547670` bypasses this PR/check rule.
A separate main history rule prevents deletion and non-fast-forward changes with
no bypass actors, including the release App. Never add an administrator, human
or all-Actions exception for normal publication. PR creation is restricted to
collaborators. Repository-default tokens are read-only and cannot approve PRs;
only GitHub-owned, SHA-pinned actions are permitted.

## Source-history cutover

The owner-selected baseline includes the verified `dev` and `main` source at
package version `0.1.24`. Existing unmerged Dependabot suggestions are regenerated
against the new source; they are not copied blindly into main. The replacement
repository has a new identity and begins with one main commit without a parent. Previous
Git tags, PR refs and release history are not imported. Existing registry packages
and published `0.1.24` archives remain unchanged. The next patch is `0.1.25` for
both groups; absent tags select Nx's first-release mode with the committed
manifest baseline. A partial tag history stops preparation. The former immutable
`v0.1.24` and `prisma-generators-v0.1.24` GitHub Release tags cannot be reused,
including after repository recreation; keep the published npm versions intact.

Maintainer commits and server-side PR merges must explicitly use the maintainer's
GitHub no-reply author address. Verify both author and committer metadata before
publication; a local Git identity alone does not configure GitHub merge authors.

Keep the old repository private until the replacement snapshot, branch inventory
and package preservation have been verified. Delete that archived repository only
under the owner's approved full-restart decision. Local backups and independent
clones remain outside GitHub's repository-history removal boundary.

After transferring the replacement repository to Pixel Brewery, complete the
live settings before allowing normal publication:

1. Select the new repository in the release App installation; retain only its
   already approved repositories and Archipel.
2. Connect all 28 existing public Archipel packages to this new repository and
   give it Actions **Write** access. Verify that their repository association has
   immutable ID `1441080766`. Before transfer, the organization package picker cannot
   select a repository owned by the personal account. Preserve all existing
   versions and visibility; do not delete or recreate the packages.
3. Provision the main-only release environment credential and verify its scope.
   Existing GitHub environment secrets cannot be read back or copied from
   Synapse or Symphony through the API.
4. Activate the two main-only protection rules and public Secret Scanning/Push
   Protection when public visibility makes them available in the account's plan.
   The reviewed payloads are in `.github/repository-rules/`.
5. Configure GitHub Pages with build type `workflow` and the main-only
   `github-pages` deployment environment. The site uses
   `https://pixel-brewery.github.io/archipel/`, including its `/archipel/` base.
6. Run the three-platform source workflow, then verify the first public release,
   both tags and GitHub Releases, all public package archives and the Pages site.

Source configuration alone is not proof of those external grants or a completed
public release. While the repository remains private, publication and privileged
bot automation deliberately remain inactive.

## Verification and recovery

Run `yarn run verify` before committing or pushing. It regenerates the Prisma client,
API references, the search index, LLM documentation and the package manifest. It builds
the documentation site and every library and tool, checks types, runs lint and tests,
and checks the ESM packages and their archive inventories. It uses one local task worker.
GitHub Actions calls `yarn run verify:ci` to check committed formatting and run the same
verification. Commit the regenerated API references and search index alongside the source.

The same verification includes `yarn public:check`, which rejects excluded private
project references in tracked and new non-ignored paths, symlink targets, UTF-8
and UTF-16 content, and decoded gzip archives. It streams file and archive content
without an expanded-size limit, fails when an archive cannot be decoded, and
redacts the excluded identifier from diagnostic paths. Ignored local data is
outside this source check unless it has been force-tracked. Git history and
remote issue or project content require their own separate audit.

`yarn release:dry-run` previews an ordinary patch. For a fresh source baseline,
`yarn release:first:dry-run` previews both groups without writing versions,
creating tags, uploading archives or requesting a GitHub Release. Local live
publication remains an explicitly authorized owner recovery operation, rather
than an alternate protected-main bypass.

GitHub's main/tag push is atomic; registry uploads and GitHub Releases are separate
durable operations. If publication fails after the push, rerun the failed
publication job in the same workflow run and candidate while main still points
at that candidate commit. A newer main revision deliberately blocks this recovery
and requires an operator to reconcile the already published candidate first. Existing versions must
match the exact verified archive integrity before being accepted as complete;
changed bytes or tag ownership stop recovery. Do not overwrite a published
version or calculate a new candidate to conceal an incomplete upload. A new
source revision is a new release request, not recovery of the old one.

## Documentation after a native-token dependency merge

The same private Nx owner continues the existing documentation workflow with
`expected_head_sha`, independently of main CI and the source-bound release. It
checks immutable repository/workflow identity, the exact current main source and
positive run IDs/attempts before treating a request as existing. Successful,
failed and cancelled attempts are retained; a superseding main revision prevents
a new dispatch. The documentation job checks its selected source and current main
immediately before deployment. No package or deployment is manually dispatched by
this delivery change.

Documentation retains its original trigger for every main push; dependency-only
merges also refresh the package reference site.
