/*
 * Copyright © 2019 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
    AutoCodeInspection,
    Autofix,
    GoalWithFulfillment,
    PushImpact,
    Queue,
} from "@atomist/sdm";
import {
    DeliveryGoals,
    Tag,
    Version,
} from "@atomist/sdm-core";
import { Changelog } from "@atomist/sdm-pack-changelog";
import { DockerBuild } from "@atomist/sdm-pack-docker";
import { KubernetesDeploy } from "@atomist/sdm-pack-k8s";

/**
 * Interface to capture all goals that this SDM will manage.
 */
export interface AtomistClientSdmGoals extends DeliveryGoals {
    /** Manage concurrent tasks using Queue goal. */
    queue: Queue;
    /** Approval gate goal, insert after goals that need manual approval. */
    approvalGate: GoalWithFulfillment;

    /** Code inspections. */
    autoCodeInspection: AutoCodeInspection;
    /** Push impacts, including aspect fingerprints. */
    pushImpact: PushImpact;
    /** Create timestamped prerelease version for goal set. */
    version: Version;
    /** Code autofixes. */
    autofix: Autofix;
    /** Build the project. */
    build: GoalWithFulfillment;
    /** Create and push prerelease version Git tag(s). */
    tag: Tag;
    /** Build and push Docker image. */
    dockerBuild: DockerBuild;
    /** Publish prerelease version of build artifact. */
    publish: GoalWithFulfillment;

    /** Deploy Docker image to staging environment. */
    stagingDeploy: KubernetesDeploy;
    /** Deploy Docker image to production environment. */
    productionDeploy: KubernetesDeploy;
    /** Deploy Docker image to demo environment. */
    demoProductionDeploy: KubernetesDeploy;
    /** Deploy Docker image to integration environment. */
    integrationProductionDeploy: KubernetesDeploy;

    /** Publish release version of build artifact. */
    release: GoalWithFulfillment;
    /** Tag prerelease version of Docker image with release version. */
    releaseDocker: GoalWithFulfillment;
    /** Create and push release version Git tag. */
    releaseTag: GoalWithFulfillment;
    /** Update changelog after release. */
    releaseChangelog: Changelog;
    /** Publish documentation as part of release. */
    releaseDocs: GoalWithFulfillment;
    /** Create Homebrew core formula pull request. */
    releaseHomebrew: GoalWithFulfillment;
    /** Increment version after release. */
    releaseVersion: GoalWithFulfillment;
}
