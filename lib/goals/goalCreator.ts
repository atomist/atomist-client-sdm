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
    goal,
    GoalWithFulfillment,
    IndependentOfEnvironment,
    ProductionEnvironment,
    PushImpact,
    Queue,
} from "@atomist/sdm";
import {
    GoalCreator,
    Tag,
    Version,
} from "@atomist/sdm-core";
import { Changelog } from "@atomist/sdm-pack-changelog";
import { DockerBuild } from "@atomist/sdm-pack-docker";
import { KubernetesDeploy } from "@atomist/sdm-pack-k8s";
import { AtomistClientSdmGoals } from "./goals";

/**
 * Create all goal instances and return an instance of HelloWorldGoals
 */
export const AtomistClientSdmGoalCreator: GoalCreator<AtomistClientSdmGoals> = async sdm => {

    const queue = new Queue({ concurrent: 5 });
    const approvalGate = goal(
        {
            displayName: "approval",
            environment: IndependentOfEnvironment,
            preApproval: true,
            descriptions: {
                planned: "Approval pending",
                waitingForPreApproval: "Approval pending",
                completed: "Approved",
            },
        },
        async gi => { /** Intentionally left empty */ });

    const autoCodeInspection = new AutoCodeInspection({ isolate: true });
    const pushImpact = new PushImpact();
    const version = new Version();
    const autofix = new Autofix({ setAuthor: true });
    const build = new GoalWithFulfillment({
        uniqueName: "build",
        environment: IndependentOfEnvironment,
        displayName: "build",
        workingDescription: "Building",
        completedDescription: "Built",
        failedDescription: "Build failed",
        isolated: true,
    });
    const tag = new Tag();
    const dockerBuild = new DockerBuild({ retryCondition: { retries: 5 } });
    const publish = new GoalWithFulfillment({
        uniqueName: "publish",
        environment: IndependentOfEnvironment,
        displayName: "publish",
        workingDescription: "Publishing",
        completedDescription: "Published",
        failedDescription: "Publish failed",
        isolated: true,
    }, build, dockerBuild);

    const stagingDeploy = new KubernetesDeploy({ environment: "testing" });
    const productionDeploy = new KubernetesDeploy({ environment: "production" });
    const demoProductionDeploy = new KubernetesDeploy({ environment: "production" });
    const integrationProductionDeploy = new KubernetesDeploy({ environment: "production" });

    const release = new GoalWithFulfillment({
        uniqueName: "release",
        environment: ProductionEnvironment,
        displayName: "release",
        workingDescription: "Releasing",
        completedDescription: "Released",
        failedDescription: "Release failed",
        isolated: true,
    });
    const releaseDocker = new GoalWithFulfillment({
        uniqueName: "release-docker",
        environment: ProductionEnvironment,
        displayName: "release Docker image",
        workingDescription: "Releasing Docker image",
        completedDescription: "Released Docker image",
        failedDescription: "Release Docker image failure",
        isolated: true,
    });
    const releaseTag = new GoalWithFulfillment({
        uniqueName: "release-tag",
        environment: ProductionEnvironment,
        displayName: "create release tag",
        workingDescription: "Creating release tag",
        completedDescription: "Created release tag",
        failedDescription: "Creating release tag failure",
    });
    const releaseChangelog = new Changelog();
    const releaseDocs = new GoalWithFulfillment({
        uniqueName: "release-docs",
        environment: ProductionEnvironment,
        displayName: "publish docs",
        workingDescription: "Publishing docs",
        completedDescription: "Published docs",
        failedDescription: "Publishing docs failure",
        isolated: true,
    });
    const releaseHomebrew = new GoalWithFulfillment({
        uniqueName: "release-homebrew",
        environment: ProductionEnvironment,
        displayName: "release Homebrew formula",
        workingDescription: "Releasing Homebrew formula",
        completedDescription: "Released Homebrew formula",
        failedDescription: "Release Homebrew formula failure",
        isolated: true,
    });
    const releaseVersion = new GoalWithFulfillment({
        uniqueName: "release-version",
        environment: ProductionEnvironment,
        displayName: "increment version",
        workingDescription: "Incrementing version",
        completedDescription: "Incremented version",
        failedDescription: "Incrementing version failure",
    }, releaseChangelog);

    return {
        queue,
        approvalGate,
        autoCodeInspection,
        pushImpact,
        version,
        autofix,
        build,
        tag,
        dockerBuild,
        stagingDeploy,
        productionDeploy,
        demoProductionDeploy,
        integrationProductionDeploy,
        publish,
        release,
        releaseDocker,
        releaseTag,
        releaseChangelog,
        releaseDocs,
        releaseHomebrew,
        releaseVersion,
    };
};
