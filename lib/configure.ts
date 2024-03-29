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

import { ConfigurationPostProcessor } from "@atomist/automation-client";
import { configureDashboardNotifications } from "@atomist/automation-client-ext-dashboard";
import { configureHumio } from "@atomist/automation-client-ext-humio";
import { configureRaven } from "@atomist/automation-client-ext-raven";
import { SoftwareDeliveryMachineConfiguration } from "@atomist/sdm";
import {
    CompressingGoalCache,
    ConfigurationPreProcessor,
    ConfigureOptions,
    LocalSoftwareDeliveryMachineConfiguration,
} from "@atomist/sdm-core";
import { GoogleCloudStorageGoalCacheArchiveStore } from "@atomist/sdm-pack-gcp";
import * as _ from "lodash";

// Remove once sdm-core gets released
interface ConfigureMachineOptions extends ConfigureOptions {
    name?: string;
    preProcessors?: ConfigurationPreProcessor[];
    postProcessors?: ConfigurationPostProcessor[];
}

/**
 * Provide default SDM configuration. If any other source defines
 * these values, they will override these defaults.
 */
async function configureSdmDefaults(cfg: LocalSoftwareDeliveryMachineConfiguration): Promise<LocalSoftwareDeliveryMachineConfiguration> {
    const defaultCfg: SoftwareDeliveryMachineConfiguration = {
        sdm: {
            npm: {
                publish: {
                    tag: {
                        defaultBranch: true,
                    },
                },
            },
            k8s: {
                job: {
                    cleanupInterval: 1000 * 60 * 10,
                },
            },
            cache: {
                bucket: "atm-atomist-sdm-goal-cache-production",
                enabled: true,
                path: "atomist-sdm-cache",
                store: new CompressingGoalCache(new GoogleCloudStorageGoalCacheArchiveStore()),
            },
        },
    };
    return _.defaultsDeep(cfg, defaultCfg);
}

export const machineOptions: ConfigureMachineOptions = {
    preProcessors: [
        configureSdmDefaults,
    ],
    postProcessors: [
        configureDashboardNotifications,
        configureHumio,
        configureRaven,
    ],
    requiredConfigurationValues: [
        "sdm.npm.npmrc",
        "sdm.npm.registry",
        "sdm.npm.access",
        "sdm.docker.hub.registry",
        "sdm.docker.hub.user",
        "sdm.docker.hub.password",
    ],
};
