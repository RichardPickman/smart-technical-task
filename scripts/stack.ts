#!/usr/bin/env ts-node

import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { StaticSiteStack } from './stack.lib';

const app = new App();

const stackName = String(process.env.npm_package_name);

new StaticSiteStack(app, stackName, { stackName });
